import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  getAccountInfo,
  getAccountInfoByHash,
  getBalance,
  getCsprBalance,
  getAccountNamedKeys,
  getPurseBalanceDetails,
  queryGlobalState,
} from '../../../services/casperRpcService';
import {
  createReadEmbed,
  createErrorEmbed,
  truncate,
  motesToCspr,
  validatePublicKey,
  validateAccountHash,
  parseCLValue,
} from '../readHelper';

/**
 * Handle /account-info command
 */
export async function handleAccountInfoCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const address = interaction.options.getString('public-key', true);

    if (!validatePublicKey(address) && !validateAccountHash(address)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Address', 'Please provide a valid public key (68 hex) or account hash (64 hex)')],
      });
      return;
    }

    let accountInfo;
    if (validatePublicKey(address)) {
      accountInfo = await getAccountInfo(address);
    } else {
      accountInfo = await getAccountInfoByHash(address);
    }

    const account = accountInfo?.account;
    if (!account) {
      await interaction.editReply({ embeds: [createErrorEmbed('Account Not Found', 'Account does not exist on the network')] });
      return;
    }

    // Get main purse balance
    const balanceMotes = await getBalance(account.main_purse);
    const balanceCspr = motesToCspr(balanceMotes);

    // Build associated keys string
    const assocKeys = (account.associated_keys || [])
      .map((k: any) => `${truncate(k.account_hash, 30)} (weight: ${k.weight})`)
      .join('\n') || 'None';

    // Build named keys string
    const namedKeys = (account.named_keys || [])
      .slice(0, 10)
      .map((nk: any) => `${nk.name}: \`${truncate(nk.key, 35)}\``)
      .join('\n') || 'None';

    const embed = createReadEmbed('👤 Casper Account Info', [
      { name: 'Account Hash', value: `\`${truncate(account.account_hash, 40)}\``, inline: false },
      { name: 'Main Purse', value: `\`${truncate(account.main_purse, 40)}\``, inline: false },
      { name: 'Balance', value: `${balanceCspr} CSPR`, inline: true },
      { name: 'Deployment Threshold', value: account.action_thresholds?.deployment?.toString() || 'N/A', inline: true },
      { name: 'Key Management Threshold', value: account.action_thresholds?.key_management?.toString() || 'N/A', inline: true },
      { name: 'Associated Keys', value: assocKeys, inline: false },
      { name: 'Named Keys (Top 10)', value: namedKeys, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Account info query successful');
  } catch (error) {
    logger.error('Account info query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /purse-balance command
 */
export async function handlePurseBalanceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const purseUref = interaction.options.getString('purse-uref', true);
    const balanceMotes = await getBalance(purseUref);
    const balanceCspr = motesToCspr(balanceMotes);

    const embed = createReadEmbed('💰 Purse Balance', [
      { name: 'Purse URef', value: `\`${truncate(purseUref, 45)}\``, inline: false },
      { name: 'Balance (CSPR)', value: balanceCspr, inline: true },
      { name: 'Balance (motes)', value: balanceMotes, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Purse balance query successful');
  } catch (error) {
    logger.error('Purse balance query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /named-keys command
 */
export async function handleNamedKeysCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const publicKey = interaction.options.getString('public-key', true);

    if (!validatePublicKey(publicKey)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Public Key', 'Public key must be 68 hex characters')],
      });
      return;
    }

    const namedKeys = await getAccountNamedKeys(publicKey);

    if (namedKeys.length === 0) {
      const embed = createReadEmbed('🔑 Account Named Keys', [
        { name: 'Public Key', value: `\`${truncate(publicKey, 40)}\``, inline: false },
        { name: 'Named Keys', value: 'No named keys found', inline: false },
      ]);
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const namedKeysStr = namedKeys
      .slice(0, 20)
      .map((nk: any, i: number) => `${i + 1}. **${nk.name}**: \`${truncate(nk.key, 40)}\``)
      .join('\n');

    const embed = createReadEmbed('🔑 Account Named Keys', [
      { name: 'Public Key', value: `\`${truncate(publicKey, 40)}\``, inline: false },
      { name: 'Total Named Keys', value: namedKeys.length.toString(), inline: true },
      { name: 'Named Keys (Top 20)', value: namedKeysStr, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Named keys query successful');
  } catch (error) {
    logger.error('Named keys query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /account-balance command
 */
export async function handleAccountBalanceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const address = interaction.options.getString('address', true);

    if (!validatePublicKey(address) && !validateAccountHash(address)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Address', 'Provide a valid public key (68 hex) or account hash (64 hex)')],
      });
      return;
    }

    const balance = await getCsprBalance(address);

    const embed = createReadEmbed('💰 Account Balance', [
      { name: 'Address', value: `\`${truncate(address, 45)}\``, inline: false },
      { name: 'Balance', value: `${balance} CSPR`, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Account balance query successful');
  } catch (error) {
    logger.error('Account balance query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /purse-details command
 */
export async function handlePurseDetailsCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const purseUref = interaction.options.getString('purse-uref', true);
    const stateRootHash = interaction.options.getString('state-root-hash') || undefined;

    const result = await getPurseBalanceDetails(purseUref, stateRootHash);
    const balanceMotes = result.balance_value?.toString() || '0';
    const balanceCspr = motesToCspr(balanceMotes);

    const embed = createReadEmbed('💰 Purse Balance Details', [
      { name: 'Purse URef', value: `\`${truncate(purseUref, 45)}\``, inline: false },
      { name: 'Balance (CSPR)', value: balanceCspr, inline: true },
      { name: 'Balance (motes)', value: balanceMotes, inline: true },
      { name: 'State Root Hash', value: `\`${truncate(result.state_root_hash, 30)}\``, inline: false },
      { name: 'Has Proof', value: result.proof ? 'Yes' : 'No', inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Purse details query successful');
  } catch (error) {
    logger.error('Purse details query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /global-state command
 */
export async function handleGlobalStateCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const key = interaction.options.getString('key', true);
    const pathStr = interaction.options.getString('path') || '';
    const path = pathStr ? pathStr.split(',').map(p => p.trim()).filter(Boolean) : [];

    const result = await queryGlobalState(key, path);
    const storedValue = result.stored_value || {};

    // Determine what type of stored value we got
    let valueStr = 'N/A';
    if (storedValue.Account) {
      valueStr = `Account: hash=${truncate(storedValue.Account.account_hash, 30)}`;
    } else if (storedValue.Contract) {
      valueStr = `Contract: ${truncate(storedValue.Contract.contract_hash, 30)}`;
    } else if (storedValue.CLValue) {
      valueStr = parseCLValue(storedValue.CLValue);
    } else {
      valueStr = JSON.stringify(storedValue).substring(0, 200);
    }

    const embed = createReadEmbed('🔍 Global State Query', [
      { name: 'Key', value: `\`${truncate(key, 45)}\``, inline: false },
      { name: 'Path', value: path.length > 0 ? path.join(' → ') : '(root)', inline: false },
      { name: 'Block Hash', value: `\`${truncate(result.block_hash, 30)}\``, inline: false },
      { name: 'Stored Value', value: truncate(valueStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Global state query successful');
  } catch (error) {
    logger.error('Global state query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}
