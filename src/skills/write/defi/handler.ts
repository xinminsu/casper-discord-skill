import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  ammSwap, addLiquidity, removeLiquidity, stakeLp, claimReward,
  createOrder, cancelOrder,
  counterIncrement, counterDecrement,
  dictionaryPut, dictionaryRemove,
  createProposal, castVote, executeProposal,
  saveAssetRecord,
  callContract,
} from '../../../services/casperTransactionService';
import { CLValue } from 'casper-js-sdk';
import { createDeploySuccessEmbed, checkSigningKey } from '../deployHelper';

function truncate(s: string, len = 20): string {
  return s.length > len ? s.substring(0, len) + '...' : s;
}

// DeFi handlers

export async function handleSwapCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenIn = interaction.options.getString('token-in', true);
    const tokenOut = interaction.options.getString('token-out', true);
    const amountIn = interaction.options.getString('amount-in', true);
    const minAmountOut = interaction.options.getString('min-amount-out', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    const { deployHash, result } = await ammSwap(contractHash, tokenIn, tokenOut, amountIn, minAmountOut, decimals);
    const embed = createDeploySuccessEmbed('AMM Swap', deployHash, result, [
      { name: 'Token In', value: `\`${truncate(tokenIn)}\``, inline: true },
      { name: 'Token Out', value: `\`${truncate(tokenOut)}\``, inline: true },
      { name: 'Amount In', value: amountIn, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Swap successful: ${deployHash}`);
  } catch (error) {
    logger.error('Swap failed:', error);
    await interaction.editReply({ content: `❌ Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleAddLiquidityCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenA = interaction.options.getString('token-a', true);
    const tokenB = interaction.options.getString('token-b', true);
    const amountA = interaction.options.getString('amount-a', true);
    const amountB = interaction.options.getString('amount-b', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    const { deployHash, result } = await addLiquidity(contractHash, tokenA, tokenB, amountA, amountB, decimals);
    const embed = createDeploySuccessEmbed('Add Liquidity', deployHash, result, [
      { name: 'Token A', value: `\`${truncate(tokenA)}\``, inline: true },
      { name: 'Token B', value: `\`${truncate(tokenB)}\``, inline: true },
      { name: 'Amount A', value: amountA, inline: true },
      { name: 'Amount B', value: amountB, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Add liquidity successful: ${deployHash}`);
  } catch (error) {
    logger.error('Add liquidity failed:', error);
    await interaction.editReply({ content: `❌ Add liquidity failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleRemoveLiquidityCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const lpToken = interaction.options.getString('lp-token', true);
    const lpAmount = interaction.options.getString('lp-amount', true);
    const minAmountA = interaction.options.getString('min-amount-a', true);
    const minAmountB = interaction.options.getString('min-amount-b', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    const { deployHash, result } = await removeLiquidity(contractHash, lpToken, lpAmount, minAmountA, minAmountB, decimals);
    const embed = createDeploySuccessEmbed('Remove Liquidity', deployHash, result, [
      { name: 'LP Token', value: `\`${truncate(lpToken)}\``, inline: true },
      { name: 'LP Amount', value: lpAmount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Remove liquidity successful: ${deployHash}`);
  } catch (error) {
    logger.error('Remove liquidity failed:', error);
    await interaction.editReply({ content: `❌ Remove liquidity failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleStakeLpCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const lpToken = interaction.options.getString('lp-token', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    const { deployHash, result } = await stakeLp(contractHash, lpToken, amount, decimals);
    const embed = createDeploySuccessEmbed('Stake LP', deployHash, result, [
      { name: 'LP Token', value: `\`${truncate(lpToken)}\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Stake LP successful: ${deployHash}`);
  } catch (error) {
    logger.error('Stake LP failed:', error);
    await interaction.editReply({ content: `❌ Stake LP failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleClaimRewardCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const { deployHash, result } = await claimReward(contractHash);
    const embed = createDeploySuccessEmbed('Claim Reward', deployHash, result, [
      { name: 'Contract', value: `\`${truncate(contractHash)}\``, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Claim reward successful: ${deployHash}`);
  } catch (error) {
    logger.error('Claim reward failed:', error);
    await interaction.editReply({ content: `❌ Claim reward failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleCreateOrderCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenIn = interaction.options.getString('token-in', true);
    const tokenOut = interaction.options.getString('token-out', true);
    const amountIn = interaction.options.getString('amount-in', true);
    const price = interaction.options.getString('price', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    const { deployHash, result } = await createOrder(contractHash, tokenIn, tokenOut, amountIn, price, decimals);
    const embed = createDeploySuccessEmbed('Create Order', deployHash, result, [
      { name: 'Token In', value: `\`${truncate(tokenIn)}\``, inline: true },
      { name: 'Token Out', value: `\`${truncate(tokenOut)}\``, inline: true },
      { name: 'Amount In', value: amountIn, inline: true },
      { name: 'Price', value: price, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Create order successful: ${deployHash}`);
  } catch (error) {
    logger.error('Create order failed:', error);
    await interaction.editReply({ content: `❌ Create order failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleCancelOrderCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const orderId = interaction.options.getString('order-id', true);
    const { deployHash, result } = await cancelOrder(contractHash, orderId);
    const embed = createDeploySuccessEmbed('Cancel Order', deployHash, result, [
      { name: 'Order ID', value: orderId, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Cancel order successful: ${deployHash}`);
  } catch (error) {
    logger.error('Cancel order failed:', error);
    await interaction.editReply({ content: `❌ Cancel order failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

// DApp handlers

export async function handleCounterIncrementCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const { deployHash, result } = await counterIncrement(contractHash);
    const embed = createDeploySuccessEmbed('Counter Increment', deployHash, result, [
      { name: 'Contract', value: `\`${truncate(contractHash)}\``, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Counter increment successful: ${deployHash}`);
  } catch (error) {
    logger.error('Counter increment failed:', error);
    await interaction.editReply({ content: `❌ Counter increment failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleCounterDecrementCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const { deployHash, result } = await counterDecrement(contractHash);
    const embed = createDeploySuccessEmbed('Counter Decrement', deployHash, result, [
      { name: 'Contract', value: `\`${truncate(contractHash)}\``, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Counter decrement successful: ${deployHash}`);
  } catch (error) {
    logger.error('Counter decrement failed:', error);
    await interaction.editReply({ content: `❌ Counter decrement failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleDictPutCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const key = interaction.options.getString('key', true);
    const value = interaction.options.getString('value', true);
    const { deployHash, result } = await dictionaryPut(contractHash, key, value);
    const embed = createDeploySuccessEmbed('Dictionary Put', deployHash, result, [
      { name: 'Key', value: key, inline: true },
      { name: 'Value', value: truncate(value, 50), inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Dict put successful: ${deployHash}`);
  } catch (error) {
    logger.error('Dict put failed:', error);
    await interaction.editReply({ content: `❌ Dict put failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleDictRemoveCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const key = interaction.options.getString('key', true);
    const { deployHash, result } = await dictionaryRemove(contractHash, key);
    const embed = createDeploySuccessEmbed('Dictionary Remove', deployHash, result, [
      { name: 'Removed Key', value: key, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Dict remove successful: ${deployHash}`);
  } catch (error) {
    logger.error('Dict remove failed:', error);
    await interaction.editReply({ content: `❌ Dict remove failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleCreateProposalCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const title = interaction.options.getString('title', true);
    const description = interaction.options.getString('description', true);
    const votingDuration = interaction.options.getInteger('voting-duration', true);
    const { deployHash, result } = await createProposal(contractHash, title, description, votingDuration);
    const embed = createDeploySuccessEmbed('Create Proposal', deployHash, result, [
      { name: 'Title', value: title, inline: true },
      { name: 'Voting Duration', value: `${votingDuration} blocks`, inline: true },
      { name: 'Description', value: truncate(description, 100), inline: false },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Create proposal successful: ${deployHash}`);
  } catch (error) {
    logger.error('Create proposal failed:', error);
    await interaction.editReply({ content: `❌ Create proposal failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleCastVoteCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const proposalId = interaction.options.getString('proposal-id', true);
    const vote = interaction.options.getString('vote', true);
    const { deployHash, result } = await castVote(contractHash, proposalId, vote);
    const embed = createDeploySuccessEmbed('Cast Vote', deployHash, result, [
      { name: 'Proposal ID', value: proposalId, inline: true },
      { name: 'Vote', value: vote, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Cast vote successful: ${deployHash}`);
  } catch (error) {
    logger.error('Cast vote failed:', error);
    await interaction.editReply({ content: `❌ Cast vote failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleExecuteProposalCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const proposalId = interaction.options.getString('proposal-id', true);
    const { deployHash, result } = await executeProposal(contractHash, proposalId);
    const embed = createDeploySuccessEmbed('Execute Proposal', deployHash, result, [
      { name: 'Proposal ID', value: proposalId, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Execute proposal successful: ${deployHash}`);
  } catch (error) {
    logger.error('Execute proposal failed:', error);
    await interaction.editReply({ content: `❌ Execute proposal failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleSaveAssetCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const assetId = interaction.options.getString('asset-id', true);
    const ownerHash = interaction.options.getString('owner-hash', true);
    const documentHash = interaction.options.getString('document-hash', true);
    const metadata = interaction.options.getString('metadata') ?? undefined;
    const { deployHash, result } = await saveAssetRecord(contractHash, assetId, ownerHash, documentHash, metadata);
    const embed = createDeploySuccessEmbed('Save RWA Asset', deployHash, result, [
      { name: 'Asset ID', value: assetId, inline: true },
      { name: 'Owner Hash', value: `\`${truncate(ownerHash)}\``, inline: true },
      { name: 'Document Hash', value: `\`${truncate(documentHash)}\``, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Save asset successful: ${deployHash}`);
  } catch (error) {
    logger.error('Save asset failed:', error);
    await interaction.editReply({ content: `❌ Save asset failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

// Generic contract call handler
export async function handleCallContractCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const entryPoint = interaction.options.getString('entry-point', true);
    const argsJson = interaction.options.getString('args-json');

    // Parse args JSON into CLValue map
    const argsMap = new Map<string, CLValue>();
    if (argsJson) {
      try {
        const parsed = JSON.parse(argsJson);
        for (const [key, value] of Object.entries(parsed)) {
          argsMap.set(key, CLValue.newCLString(String(value)));
        }
      } catch {
        await interaction.editReply({ content: '❌ Invalid args JSON. Use format: {"key":"value"}' });
        return;
      }
    }

    const { deployHash, result } = await callContract(contractHash, entryPoint, argsMap);
    const embed = createDeploySuccessEmbed('Contract Call', deployHash, result, [
      { name: 'Contract', value: `\`${truncate(contractHash)}\``, inline: true },
      { name: 'Entry Point', value: entryPoint, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Contract call successful: ${deployHash}`);
  } catch (error) {
    logger.error('Contract call failed:', error);
    await interaction.editReply({ content: `❌ Contract call failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}
