import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  getContractInfo,
  getContractEntryPoints,
  getDictionaryItem,
  getDictionaryItemByAccount,
  getDictionaryItemByContract,
  getStateItem,
} from '../../../services/casperRpcService';
import {
  createReadEmbed,
  createErrorEmbed,
  truncate,
  validateContractHash,
  validatePublicKey,
  parseCLValue,
} from '../readHelper';

/**
 * Handle /contract-info command
 */
export async function handleContractInfoCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Contract Hash', 'Contract hash must be 64 hex chars (with or without hash- prefix)')],
      });
      return;
    }

    const result = await getContractInfo(contractHash);
    const contract = result?.contract;

    if (!contract) {
      await interaction.editReply({ embeds: [createErrorEmbed('Contract Not Found', 'Contract does not exist on the network')] });
      return;
    }

    // Build entry points list
    const entryPoints = contract.entry_points || [];
    const entryPointList = entryPoints
      .slice(0, 15)
      .map((ep: any, i: number) => `${i + 1}. **${ep.name}** (${ep.entry_point_type || 'contract'})`)
      .join('\n') || 'None';

    // Build named keys list
    const namedKeys = (contract.named_keys || [])
      .slice(0, 10)
      .map((nk: any) => `${nk.name}: \`${truncate(nk.key, 35)}\``)
      .join('\n') || 'None';

    const embed = createReadEmbed('📋 Contract Information', [
      { name: 'Contract Hash', value: `\`${truncate(contract.contract_hash, 40)}\``, inline: false },
      { name: 'Contract Package Hash', value: `\`${truncate(contract.contract_package_hash, 40)}\``, inline: false },
      { name: 'Version', value: contract.contract_version?.toString() || 'N/A', inline: true },
      { name: 'Protocol Version', value: contract.protocol_version?.toString() || 'N/A', inline: true },
      { name: 'Entry Points Count', value: entryPoints.length.toString(), inline: true },
      { name: 'Entry Points (Top 15)', value: entryPointList, inline: false },
      { name: 'Named Keys (Top 10)', value: namedKeys, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Contract info query successful');
  } catch (error) {
    logger.error('Contract info query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /entry-points command
 */
export async function handleEntryPointsCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Contract Hash', 'Contract hash must be 64 hex chars')],
      });
      return;
    }

    const entryPoints = await getContractEntryPoints(contractHash);

    if (!entryPoints || entryPoints.length === 0) {
      await interaction.editReply({ embeds: [createErrorEmbed('No Entry Points', 'Contract has no entry points or does not exist')] });
      return;
    }

    const entryPointList = entryPoints
      .map((ep: any, i: number) => {
        const args = (ep.args || [])
          .map((a: any) => `${a.name}:${a.cl_type}`)
          .join(', ');
        return `${i + 1}. **${ep.name}** (${ep.entry_point_type || 'contract'})\n   Args: ${args || 'none'}`;
      })
      .join('\n\n');

    const embed = createReadEmbed('🔧 Contract Entry Points', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Total Entry Points', value: entryPoints.length.toString(), inline: true },
      { name: 'Entry Points', value: truncate(entryPointList, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Entry points query successful');
  } catch (error) {
    logger.error('Entry points query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /dict-item command
 */
export async function handleDictItemCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const uref = interaction.options.getString('uref', true);
    const dictKey = interaction.options.getString('dict-key', true);

    const result = await getDictionaryItem(uref, dictKey);
    const storedValue = result?.stored_value || {};
    const clValue = storedValue.CLValue || storedValue.cl_value;

    const embed = createReadEmbed('📖 Dictionary Item', [
      { name: 'Seed URef', value: `\`${truncate(uref, 45)}\``, inline: false },
      { name: 'Dictionary Key', value: dictKey, inline: true },
      { name: 'Block Hash', value: `\`${truncate(result.block_hash, 30)}\``, inline: false },
      { name: 'Value', value: truncate(parseCLValue(clValue), 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Dictionary item query successful');
  } catch (error) {
    logger.error('Dictionary item query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /dict-by-account command
 */
export async function handleDictByAccountCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const publicKey = interaction.options.getString('public-key', true);
    const namedKey = interaction.options.getString('named-key', true);
    const dictKey = interaction.options.getString('dict-key', true);

    if (!validatePublicKey(publicKey)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Public Key', 'Public key must be 68 hex characters')],
      });
      return;
    }

    const result = await getDictionaryItemByAccount(publicKey, namedKey, dictKey);
    const storedValue = result?.stored_value || {};
    const clValue = storedValue.CLValue || storedValue.cl_value;

    const embed = createReadEmbed('📖 Dictionary Item (via Account)', [
      { name: 'Account Public Key', value: `\`${truncate(publicKey, 40)}\``, inline: false },
      { name: 'Named Key', value: namedKey, inline: true },
      { name: 'Dictionary Key', value: dictKey, inline: true },
      { name: 'Value', value: truncate(parseCLValue(clValue), 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Dictionary by account query successful');
  } catch (error) {
    logger.error('Dictionary by account query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /dict-by-contract command
 */
export async function handleDictByContractCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const namedKey = interaction.options.getString('named-key', true);
    const dictKey = interaction.options.getString('dict-key', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Contract Hash', 'Contract hash must be 64 hex chars')],
      });
      return;
    }

    const result = await getDictionaryItemByContract(contractHash, namedKey, dictKey);
    const storedValue = result?.stored_value || {};
    const clValue = storedValue.CLValue || storedValue.cl_value;

    const embed = createReadEmbed('📖 Dictionary Item (via Contract)', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Named Key', value: namedKey, inline: true },
      { name: 'Dictionary Key', value: dictKey, inline: true },
      { name: 'Value', value: truncate(parseCLValue(clValue), 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Dictionary by contract query successful');
  } catch (error) {
    logger.error('Dictionary by contract query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /state-item command
 */
export async function handleStateItemCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const key = interaction.options.getString('key', true);
    const pathStr = interaction.options.getString('path') || '';
    const path = pathStr ? pathStr.split(',').map(p => p.trim()).filter(Boolean) : [];

    const result = await getStateItem(key, undefined, path);
    const storedValue = result?.stored_value || {};

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

    const embed = createReadEmbed('📦 State Item Query', [
      { name: 'Key', value: `\`${truncate(key, 45)}\``, inline: false },
      { name: 'Path', value: path.length > 0 ? path.join(' → ') : '(root)', inline: false },
      { name: 'Block Hash', value: `\`${truncate(result.block_hash, 30)}\``, inline: false },
      { name: 'Stored Value', value: truncate(valueStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('State item query successful');
  } catch (error) {
    logger.error('State item query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /contract-named-keys command
 */
export async function handleContractNamedKeysCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Invalid Contract Hash', 'Contract hash must be 64 hex chars')],
      });
      return;
    }

    const result = await getContractInfo(contractHash);
    const namedKeys = result?.contract?.named_keys || [];

    if (namedKeys.length === 0) {
      const embed = createReadEmbed('🔑 Contract Named Keys', [
        { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
        { name: 'Named Keys', value: 'No named keys found', inline: false },
      ]);
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const namedKeysStr = namedKeys
      .slice(0, 20)
      .map((nk: any, i: number) => `${i + 1}. **${nk.name}**: \`${truncate(nk.key, 40)}\``)
      .join('\n');

    const embed = createReadEmbed('🔑 Contract Named Keys', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Total Named Keys', value: namedKeys.length.toString(), inline: true },
      { name: 'Named Keys (Top 20)', value: namedKeysStr, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Contract named keys query successful');
  } catch (error) {
    logger.error('Contract named keys query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}
