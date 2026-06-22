import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  getContractInfo,
  getDictionaryItem,
  queryGlobalState,
  getAccountInfo,
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
 * Helper: Get a named key URef from a contract
 */
async function getNamedKeyURef(contractHash: string, namedKey: string): Promise<string | null> {
  const contractInfo = await getContractInfo(contractHash);
  const namedKeys = contractInfo?.contract?.named_keys || [];
  const found = namedKeys.find((nk: any) => nk.name === namedKey);
  return found ? found.key : null;
}

/**
 * Helper: Try multiple possible named key names
 */
async function tryNamedKeys(contractHash: string, possibleNames: string[]): Promise<string | null> {
  for (const name of possibleNames) {
    const uref = await getNamedKeyURef(contractHash, name);
    if (uref) return uref;
  }
  return null;
}

// ==================== Counter Handlers ====================

/**
 * Handle /counter-value command
 */
export async function handleCounterValueCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Counter contracts typically store count in a URef named "count" or "counter"
    let countURef: string | null = null;
    const possibleNames = ['count', 'counter', 'value', 'counter_value'];

    for (const name of possibleNames) {
      countURef = await getNamedKeyURef(contractHash, name);
      if (countURef) break;
    }

    if (!countURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find count URef in contract named keys')],
      });
      return;
    }

    const result = await queryGlobalState(countURef);
    const valueStr = parseCLValue(result?.stored_value?.CLValue);

    const embed = createReadEmbed('🔢 Counter Value', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Count URef', value: `\`${truncate(countURef, 40)}\``, inline: false },
      { name: 'Current Value', value: valueStr, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Counter value query successful');
  } catch (error) {
    logger.error('Counter value query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

// ==================== AMM Handlers ====================

/**
 * Handle /amm-reserves command
 */
export async function handleAmmReservesCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Try to find reserve URefs
    const reserveAURef = await tryNamedKeys(contractHash, ['reserve_a', 'token_a_reserve', 'reserve0', 'reserve_0']);
    const reserveBURef = await tryNamedKeys(contractHash, ['reserve_b', 'token_b_reserve', 'reserve1', 'reserve_1']);
    const lpSupplyURef = await tryNamedKeys(contractHash, ['lp_token_supply', 'total_lp', 'total_supply']);

    if (!reserveAURef && !reserveBURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find reserve URefs in contract named keys')],
      });
      return;
    }

    let reserveA = 'N/A';
    let reserveB = 'N/A';
    let lpSupply = 'N/A';

    if (reserveAURef) {
      const result = await queryGlobalState(reserveAURef);
      reserveA = parseCLValue(result?.stored_value?.CLValue);
    }

    if (reserveBURef) {
      const result = await queryGlobalState(reserveBURef);
      reserveB = parseCLValue(result?.stored_value?.CLValue);
    }

    if (lpSupplyURef) {
      const result = await queryGlobalState(lpSupplyURef);
      lpSupply = parseCLValue(result?.stored_value?.CLValue);
    }

    const embed = createReadEmbed('📈 AMM Pool Reserves', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Reserve A', value: reserveA, inline: true },
      { name: 'Reserve B', value: reserveB, inline: true },
      { name: 'LP Total Supply', value: lpSupply, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('AMM reserves query successful');
  } catch (error) {
    logger.error('AMM reserves query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /amm-lp-balance command
 */
export async function handleAmmLpBalanceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const user = interaction.options.getString('user', true);

    if (!validateContractHash(contractHash) || !validatePublicKey(user)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Input', 'Check contract hash and public key formats')] });
      return;
    }

    // Find LP balances dictionary
    let balancesURef: string | null = null;
    const possibleNames = ['lp_balances', 'balances', 'lp_token_balances'];

    for (const name of possibleNames) {
      balancesURef = await getNamedKeyURef(contractHash, name);
      if (balancesURef) break;
    }

    if (!balancesURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find LP balances URef in contract named keys')],
      });
      return;
    }

    // Get user account hash as dict key
    const accountInfo = await getAccountInfo(user);
    const accountHash = (accountInfo?.account?.account_hash || '').replace(/^account-hash-/, '');

    const result = await getDictionaryItem(balancesURef, accountHash);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const balanceStr = parseCLValue(clValue);

    const embed = createReadEmbed('📈 LP Token Balance', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'User', value: `\`${truncate(user, 40)}\``, inline: false },
      { name: 'LP Balance', value: balanceStr, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('AMM LP balance query successful');
  } catch (error) {
    logger.error('AMM LP balance query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /amm-stake-info command
 */
export async function handleAmmStakeInfoCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const user = interaction.options.getString('user', true);

    if (!validateContractHash(contractHash) || !validatePublicKey(user)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Input', 'Check contract hash and public key formats')] });
      return;
    }

    // Find staking info dictionary
    let stakeInfoURef: string | null = null;
    const possibleNames = ['stake_info', 'staking_info', 'user_stakes', 'stakes'];

    for (const name of possibleNames) {
      stakeInfoURef = await getNamedKeyURef(contractHash, name);
      if (stakeInfoURef) break;
    }

    if (!stakeInfoURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find stake info URef in contract named keys')],
      });
      return;
    }

    // Get user account hash
    const accountInfo = await getAccountInfo(user);
    const accountHash = (accountInfo?.account?.account_hash || '').replace(/^account-hash-/, '');

    const result = await getDictionaryItem(stakeInfoURef, accountHash);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const stakeStr = parseCLValue(clValue);

    const embed = createReadEmbed('📈 Staking Info', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'User', value: `\`${truncate(user, 40)}\``, inline: false },
      { name: 'Stake Info', value: truncate(stakeStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('AMM stake info query successful');
  } catch (error) {
    logger.error('AMM stake info query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

// ==================== Governance Handlers ====================

/**
 * Handle /all-proposals command
 */
export async function handleAllProposalsCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Try to find proposals URef or proposal count
    let proposalsURef: string | null = null;
    const possibleNames = ['proposals', 'all_proposals', 'proposal_list'];

    for (const name of possibleNames) {
      proposalsURef = await getNamedKeyURef(contractHash, name);
      if (proposalsURef) break;
    }

    // Also try to get proposal count
    let countURef: string | null = null;
    const countNames = ['proposal_count', 'total_proposals', 'next_proposal_id'];
    for (const name of countNames) {
      countURef = await getNamedKeyURef(contractHash, name);
      if (countURef) break;
    }

    let proposalCount = 'N/A';
    if (countURef) {
      const result = await queryGlobalState(countURef);
      proposalCount = parseCLValue(result?.stored_value?.CLValue);
    }

    const embed = createReadEmbed('🗳️ Governance Proposals', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Proposal Count', value: proposalCount, inline: true },
      { name: 'Proposals URef', value: proposalsURef ? `\`${truncate(proposalsURef, 40)}\`` : 'Not found', inline: false },
      { name: 'Hint', value: 'Use `/proposal-detail` to query individual proposal details by ID', inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('All proposals query successful');
  } catch (error) {
    logger.error('All proposals query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /proposal-detail command
 */
export async function handleProposalDetailCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const proposalId = interaction.options.getString('proposal-id', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Find proposals dictionary URef
    let proposalsURef: string | null = null;
    const possibleNames = ['proposals', 'all_proposals', 'proposal_list'];

    for (const name of possibleNames) {
      proposalsURef = await getNamedKeyURef(contractHash, name);
      if (proposalsURef) break;
    }

    if (!proposalsURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find proposals URef in contract named keys')],
      });
      return;
    }

    const result = await getDictionaryItem(proposalsURef, proposalId);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const proposalStr = parseCLValue(clValue);

    const embed = createReadEmbed('🗳️ Proposal Details', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Proposal ID', value: proposalId, inline: true },
      { name: 'Proposal Data', value: truncate(proposalStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Proposal detail query successful');
  } catch (error) {
    logger.error('Proposal detail query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /vote-record command
 */
export async function handleVoteRecordCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const proposalId = interaction.options.getString('proposal-id', true);
    const voter = interaction.options.getString('voter', true);

    if (!validateContractHash(contractHash) || !validatePublicKey(voter)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Input', 'Check contract hash and voter public key')] });
      return;
    }

    // Find votes dictionary URef
    let votesURef: string | null = null;
    const possibleNames = ['votes', 'vote_records', 'voter_records'];

    for (const name of possibleNames) {
      votesURef = await getNamedKeyURef(contractHash, name);
      if (votesURef) break;
    }

    if (!votesURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find votes URef in contract named keys')],
      });
      return;
    }

    // Dict key is typically proposalId + voter account hash
    const accountInfo = await getAccountInfo(voter);
    const accountHash = (accountInfo?.account?.account_hash || '').replace(/^account-hash-/, '');
    const dictKey = `${proposalId}_${accountHash}`;

    const result = await getDictionaryItem(votesURef, dictKey);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const voteStr = parseCLValue(clValue);

    const embed = createReadEmbed('🗳️ Vote Record', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Proposal ID', value: proposalId, inline: true },
      { name: 'Voter', value: `\`${truncate(voter, 40)}\``, inline: false },
      { name: 'Vote', value: truncate(voteStr, 100), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Vote record query successful');
  } catch (error) {
    logger.error('Vote record query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

// ==================== RWA Handlers ====================

/**
 * Handle /asset-record command
 */
export async function handleAssetRecordCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const assetId = interaction.options.getString('asset-id', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Find asset records dictionary URef
    let assetsURef: string | null = null;
    const possibleNames = ['assets', 'asset_records', 'records', 'rwa_assets'];

    for (const name of possibleNames) {
      assetsURef = await getNamedKeyURef(contractHash, name);
      if (assetsURef) break;
    }

    if (!assetsURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find assets URef in contract named keys')],
      });
      return;
    }

    const result = await getDictionaryItem(assetsURef, assetId);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const assetStr = parseCLValue(clValue);

    const embed = createReadEmbed('📄 RWA Asset Record', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Asset ID', value: assetId, inline: true },
      { name: 'Asset Record', value: truncate(assetStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Asset record query successful');
  } catch (error) {
    logger.error('Asset record query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

// ==================== DEX Order Handlers ====================

/**
 * Handle /open-orders command
 */
export async function handleOpenOrdersCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const user = interaction.options.getString('user', true);

    if (!validateContractHash(contractHash) || !validatePublicKey(user)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Input', 'Check contract hash and public key')] });
      return;
    }

    // Find user orders dictionary URef
    let ordersURef: string | null = null;
    const possibleNames = ['user_orders', 'orders', 'open_orders', 'order_book'];

    for (const name of possibleNames) {
      ordersURef = await getNamedKeyURef(contractHash, name);
      if (ordersURef) break;
    }

    if (!ordersURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find orders URef in contract named keys')],
      });
      return;
    }

    // Dict key is user account hash
    const accountInfo = await getAccountInfo(user);
    const accountHash = (accountInfo?.account?.account_hash || '').replace(/^account-hash-/, '');

    const result = await getDictionaryItem(ordersURef, accountHash);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const ordersStr = parseCLValue(clValue);

    const embed = createReadEmbed('📊 Open Orders', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'User', value: `\`${truncate(user, 40)}\``, inline: false },
      { name: 'Open Orders', value: truncate(ordersStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Open orders query successful');
  } catch (error) {
    logger.error('Open orders query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}
