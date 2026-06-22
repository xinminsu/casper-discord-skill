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
 * Helper: Try to read a CEP-18/CEP-47 contract entry point result.
 * Casper doesn't have a direct "call contract read-only" RPC, so we
 * query the contract's named keys / dictionary items that store the data.
 *
 * For CEP-18, the contract typically stores:
 * - balances in a dictionary under "balances" URef
 * - allowances in a dictionary under "allowances" URef
 * - total_supply as a URef named key
 *
 * For CEP-47/78, the contract typically stores:
 * - metadata in a dictionary
 * - owners in a dictionary
 */

/**
 * Get a contract's named key URef
 */
async function getContractNamedKeyURef(
  contractHash: string,
  namedKey: string
): Promise<string | null> {
  const contractInfo = await getContractInfo(contractHash);
  const namedKeys = contractInfo?.contract?.named_keys || [];
  const found = namedKeys.find((nk: any) => nk.name === namedKey);
  return found ? found.key : null;
}

/**
 * Handle /token-total-supply command
 * CEP-18 contracts store total_supply in a named key called "total_supply"
 */
export async function handleTokenTotalSupplyCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Try to find the total_supply URef in contract named keys
    let totalSupplyURef: string | null = null;
    const possibleNames = ['total_supply', 'total_supply_uref', 'totalsupply'];

    for (const name of possibleNames) {
      totalSupplyURef = await getContractNamedKeyURef(contractHash, name);
      if (totalSupplyURef) break;
    }

    if (!totalSupplyURef) {
      // Fallback: try querying the contract access_uref list
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find total_supply URef in contract named keys. The contract may use a different storage pattern.')],
      });
      return;
    }

    // Query the URef value
    const result = await queryGlobalState(totalSupplyURef);
    const clValue = result?.stored_value?.CLValue;
    const valueStr = parseCLValue(clValue);

    const embed = createReadEmbed('🪙 CEP-18 Total Supply', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Total Supply URef', value: `\`${truncate(totalSupplyURef, 40)}\``, inline: false },
      { name: 'Total Supply', value: valueStr, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Token total supply query successful');
  } catch (error) {
    logger.error('Token total supply query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /token-balance command
 * CEP-18 stores balances in a dictionary keyed by account hash
 */
export async function handleTokenBalanceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }
    if (!validatePublicKey(owner)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Public Key', 'Owner must be 68 hex chars')] });
      return;
    }

    // Find the balances URef in contract named keys
    let balancesURef: string | null = null;
    const possibleNames = ['balances', 'balances_uref', 'balance'];

    for (const name of possibleNames) {
      balancesURef = await getContractNamedKeyURef(contractHash, name);
      if (balancesURef) break;
    }

    if (!balancesURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find balances URef in contract named keys')],
      });
      return;
    }

    // The dictionary key is the account hash of the owner public key
    // For CEP-18, the dictionary key is typically the account hash (without "account-hash-" prefix)
    const accountHash = owner.substring(2); // Remove "02" or "03" prefix, then hash
    // Actually, Casper account hash is derived from the public key
    // We need to use the full account hash. Let's get it from account info.
    const accountInfo = await getAccountInfo(owner);
    const fullAccountHash = accountInfo?.account?.account_hash || '';
    const dictKey = fullAccountHash.replace(/^account-hash-/, '');

    const result = await getDictionaryItem(balancesURef, dictKey);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const valueStr = parseCLValue(clValue);

    const embed = createReadEmbed('🪙 CEP-18 Token Balance', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Owner', value: `\`${truncate(owner, 40)}\``, inline: false },
      { name: 'Balance', value: valueStr, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Token balance query successful');
  } catch (error) {
    logger.error('Token balance query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /token-allowance command
 */
export async function handleTokenAllowanceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);
    const spender = interaction.options.getString('spender', true);

    if (!validateContractHash(contractHash) || !validatePublicKey(owner) || !validatePublicKey(spender)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Input', 'Check contract hash and public key formats')] });
      return;
    }

    // Find the allowances URef
    let allowancesURef: string | null = null;
    const possibleNames = ['allowances', 'allowances_uref', 'allowance'];

    for (const name of possibleNames) {
      allowancesURef = await getContractNamedKeyURef(contractHash, name);
      if (allowancesURef) break;
    }

    if (!allowancesURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find allowances URef in contract named keys')],
      });
      return;
    }

    // Allowance dictionary key is typically: owner_account_hash + spender_account_hash
    const ownerAccountInfo = await getAccountInfo(owner);
    const spenderAccountInfo = await getAccountInfo(spender);
    const ownerHash = (ownerAccountInfo?.account?.account_hash || '').replace(/^account-hash-/, '');
    const spenderHash = (spenderAccountInfo?.account?.account_hash || '').replace(/^account-hash-/, '');
    const dictKey = ownerHash + spenderHash;

    const result = await getDictionaryItem(allowancesURef, dictKey);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const valueStr = parseCLValue(clValue);

    const embed = createReadEmbed('🪙 CEP-18 Allowance', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Owner', value: `\`${truncate(owner, 40)}\``, inline: false },
      { name: 'Spender', value: `\`${truncate(spender, 40)}\``, inline: false },
      { name: 'Allowance', value: valueStr, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Token allowance query successful');
  } catch (error) {
    logger.error('Token allowance query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /token-meta command
 * Query CEP-18 token metadata (name, symbol, decimals) from contract named keys
 */
export async function handleTokenMetaCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Try to read name, symbol, decimals from contract named keys
    const contractInfo = await getContractInfo(contractHash);
    const namedKeys = contractInfo?.contract?.named_keys || [];

    // Find common metadata named keys
    const nameKey = namedKeys.find((nk: any) => ['name', 'token_name'].includes(nk.name));
    const symbolKey = namedKeys.find((nk: any) => ['symbol', 'token_symbol'].includes(nk.name));
    const decimalsKey = namedKeys.find((nk: any) => ['decimals', 'token_decimals'].includes(nk.name));

    let nameValue = 'N/A';
    let symbolValue = 'N/A';
    let decimalsValue = 'N/A';

    if (nameKey) {
      try {
        const result = await queryGlobalState(nameKey.key);
        nameValue = parseCLValue(result?.stored_value?.CLValue);
      } catch { /* keep N/A */ }
    }

    if (symbolKey) {
      try {
        const result = await queryGlobalState(symbolKey.key);
        symbolValue = parseCLValue(result?.stored_value?.CLValue);
      } catch { /* keep N/A */ }
    }

    if (decimalsKey) {
      try {
        const result = await queryGlobalState(decimalsKey.key);
        decimalsValue = parseCLValue(result?.stored_value?.CLValue);
      } catch { /* keep N/A */ }
    }

    const embed = createReadEmbed('🪙 CEP-18 Token Metadata', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Name', value: nameValue, inline: true },
      { name: 'Symbol', value: symbolValue, inline: true },
      { name: 'Decimals', value: decimalsValue, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Token metadata query successful');
  } catch (error) {
    logger.error('Token metadata query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

// ==================== NFT Handlers ====================

/**
 * Handle /nft-total-supply command
 */
export async function handleNftTotalSupplyCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Try to find total_supply or minted_tokens URef
    let supplyURef: string | null = null;
    const possibleNames = ['total_supply', 'minted_tokens', 'number_of_minted_tokens', 'count'];

    for (const name of possibleNames) {
      supplyURef = await getContractNamedKeyURef(contractHash, name);
      if (supplyURef) break;
    }

    if (!supplyURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find total supply URef in contract named keys')],
      });
      return;
    }

    const result = await queryGlobalState(supplyURef);
    const valueStr = parseCLValue(result?.stored_value?.CLValue);

    const embed = createReadEmbed('🖼️ NFT Total Supply', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Total Supply', value: valueStr, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('NFT total supply query successful');
  } catch (error) {
    logger.error('NFT total supply query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /nft-owner-of command
 * CEP-47/78 stores ownership in a dictionary keyed by token ID
 */
export async function handleNftOwnerOfCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenId = interaction.options.getString('token-id', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Find the owners dictionary URef
    let ownersURef: string | null = null;
    const possibleNames = ['owners', 'token_owners', 'account_by_id', 'metadata_owners'];

    for (const name of possibleNames) {
      ownersURef = await getContractNamedKeyURef(contractHash, name);
      if (ownersURef) break;
    }

    if (!ownersURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find owners URef in contract named keys')],
      });
      return;
    }

    const result = await getDictionaryItem(ownersURef, tokenId);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const ownerStr = parseCLValue(clValue);

    const embed = createReadEmbed('🖼️ NFT Owner', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Token ID', value: tokenId, inline: true },
      { name: 'Owner', value: ownerStr, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('NFT owner query successful');
  } catch (error) {
    logger.error('NFT owner query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /nft-tokens-of command
 */
export async function handleNftTokensOfCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);

    if (!validateContractHash(contractHash) || !validatePublicKey(owner)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Input', 'Check contract hash and public key formats')] });
      return;
    }

    // CEP-47 stores a paginated list of token IDs per owner
    // The dictionary key is typically the account hash of the owner
    const accountInfo = await getAccountInfo(owner);
    const accountHash = (accountInfo?.account?.account_hash || '').replace(/^account-hash-/, '');

    // Find the owned tokens dictionary
    let ownedTokensURef: string | null = null;
    const possibleNames = ['owned_tokens', 'account_owned_tokens', 'token_owners_reverse'];

    for (const name of possibleNames) {
      ownedTokensURef = await getContractNamedKeyURef(contractHash, name);
      if (ownedTokensURef) break;
    }

    if (!ownedTokensURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find owned_tokens URef in contract named keys')],
      });
      return;
    }

    const result = await getDictionaryItem(ownedTokensURef, accountHash);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const tokensStr = parseCLValue(clValue);

    const embed = createReadEmbed('🖼️ NFT Tokens Owned', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Owner', value: `\`${truncate(owner, 40)}\``, inline: false },
      { name: 'Owned Tokens', value: truncate(tokensStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('NFT tokens-of query successful');
  } catch (error) {
    logger.error('NFT tokens-of query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /nft-metadata command
 */
export async function handleNftMetadataCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenId = interaction.options.getString('token-id', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Find metadata dictionary URef
    let metadataURef: string | null = null;
    const possibleNames = ['metadata', 'token_metadata', 'metadata_by_id', 'cep78_metadata'];

    for (const name of possibleNames) {
      metadataURef = await getContractNamedKeyURef(contractHash, name);
      if (metadataURef) break;
    }

    if (!metadataURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find metadata URef in contract named keys')],
      });
      return;
    }

    const result = await getDictionaryItem(metadataURef, tokenId);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const metadataStr = parseCLValue(clValue);

    const embed = createReadEmbed('🖼️ NFT Metadata', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Token ID', value: tokenId, inline: true },
      { name: 'Metadata', value: truncate(metadataStr, 200), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('NFT metadata query successful');
  } catch (error) {
    logger.error('NFT metadata query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /nft-approved command
 */
export async function handleNftApprovedCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenId = interaction.options.getString('token-id', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // Find approvals dictionary URef
    let approvalsURef: string | null = null;
    const possibleNames = ['approvals', 'token_approvals', 'approved'];

    for (const name of possibleNames) {
      approvalsURef = await getContractNamedKeyURef(contractHash, name);
      if (approvalsURef) break;
    }

    if (!approvalsURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find approvals URef in contract named keys')],
      });
      return;
    }

    const result = await getDictionaryItem(approvalsURef, tokenId);
    const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
    const approvedStr = parseCLValue(clValue);

    const embed = createReadEmbed('🖼️ NFT Approved Spender', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Token ID', value: tokenId, inline: true },
      { name: 'Approved', value: truncate(approvedStr, 100), inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('NFT approved query successful');
  } catch (error) {
    logger.error('NFT approved query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /nft-max-supply command (CEP-78)
 */
export async function handleNftMaxSupplyCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    // CEP-78 stores max_supply as a named key
    let maxSupplyURef: string | null = null;
    const possibleNames = ['max_supply', 'collection_max_supply', 'max_total_supply'];

    for (const name of possibleNames) {
      maxSupplyURef = await getContractNamedKeyURef(contractHash, name);
      if (maxSupplyURef) break;
    }

    if (!maxSupplyURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find max_supply URef in contract named keys')],
      });
      return;
    }

    const result = await queryGlobalState(maxSupplyURef);
    const valueStr = parseCLValue(result?.stored_value?.CLValue);

    const embed = createReadEmbed('🖼️ NFT Max Supply (CEP-78)', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Max Supply', value: valueStr, inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('NFT max supply query successful');
  } catch (error) {
    logger.error('NFT max supply query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /nft-batch-owners command (CEP-78)
 */
export async function handleNftBatchOwnersCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenIdsStr = interaction.options.getString('token-ids', true);
    const tokenIds = tokenIdsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (!validateContractHash(contractHash)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Hash', 'Contract hash must be 64 hex chars')] });
      return;
    }

    if (tokenIds.length === 0) {
      await interaction.editReply({ embeds: [createErrorEmbed('No Token IDs', 'Please provide comma-separated token IDs')] });
      return;
    }

    // Find owners URef
    let ownersURef: string | null = null;
    const possibleNames = ['owners', 'token_owners', 'account_by_id'];

    for (const name of possibleNames) {
      ownersURef = await getContractNamedKeyURef(contractHash, name);
      if (ownersURef) break;
    }

    if (!ownersURef) {
      await interaction.editReply({
        embeds: [createErrorEmbed('Not Found', 'Could not find owners URef in contract named keys')],
      });
      return;
    }

    // Batch query - limit to 10 at a time to avoid rate limits
    const limitedIds = tokenIds.slice(0, 10);
    const results: { tokenId: string; owner: string }[] = [];

    for (const tokenId of limitedIds) {
      try {
        const result = await getDictionaryItem(ownersURef, tokenId);
        const clValue = result?.stored_value?.CLValue || result?.stored_value?.cl_value;
        results.push({ tokenId, owner: parseCLValue(clValue) });
      } catch {
        results.push({ tokenId, owner: 'Error/Not Found' });
      }
    }

    const resultsStr = results
      .map(r => `Token #${r.tokenId}: ${truncate(r.owner, 50)}`)
      .join('\n');

    const embed = createReadEmbed('🖼️ NFT Batch Owners (CEP-78)', [
      { name: 'Contract Hash', value: `\`${truncate(contractHash, 40)}\``, inline: false },
      { name: 'Queried', value: `${limitedIds.length} of ${tokenIds.length} tokens`, inline: true },
      { name: 'Results', value: resultsStr, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('NFT batch owners query successful');
  } catch (error) {
    logger.error('NFT batch owners query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}
