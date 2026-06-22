import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  cep18Mint,
  cep18Burn,
  cep18Transfer,
  cep18Approve,
  cep18IncreaseAllowance,
  cep18DecreaseAllowance,
  cep18TransferFrom,
} from '../../../services/casperTransactionService';
import { createDeploySuccessEmbed, checkSigningKey } from '../deployHelper';

function validatePublicKey(key: string): boolean {
  return /^[0-9a-fA-F]{68}$/.test(key);
}

export async function handleMintCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    if (!validatePublicKey(owner)) {
      await interaction.editReply({ content: '❌ Invalid owner public key. Must be 68 hex chars.' }); return;
    }
    const { deployHash, result } = await cep18Mint(contractHash, owner, amount, decimals);
    const embed = createDeploySuccessEmbed('CEP-18 Mint', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Owner', value: `\`${owner.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`CEP-18 mint successful: ${deployHash}`);
  } catch (error) {
    logger.error('CEP-18 mint failed:', error);
    await interaction.editReply({ content: `❌ Mint failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleBurnCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    if (!validatePublicKey(owner)) {
      await interaction.editReply({ content: '❌ Invalid owner public key.' }); return;
    }
    const { deployHash, result } = await cep18Burn(contractHash, owner, amount, decimals);
    const embed = createDeploySuccessEmbed('CEP-18 Burn', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Owner', value: `\`${owner.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`CEP-18 burn successful: ${deployHash}`);
  } catch (error) {
    logger.error('CEP-18 burn failed:', error);
    await interaction.editReply({ content: `❌ Burn failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleTokenTransferCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const recipient = interaction.options.getString('recipient', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    if (!validatePublicKey(recipient)) {
      await interaction.editReply({ content: '❌ Invalid recipient public key.' }); return;
    }
    const { deployHash, result } = await cep18Transfer(contractHash, recipient, amount, decimals);
    const embed = createDeploySuccessEmbed('CEP-18 Transfer', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Recipient', value: `\`${recipient.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`CEP-18 transfer successful: ${deployHash}`);
  } catch (error) {
    logger.error('CEP-18 transfer failed:', error);
    await interaction.editReply({ content: `❌ Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleApproveCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const spender = interaction.options.getString('spender', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    if (!validatePublicKey(spender)) {
      await interaction.editReply({ content: '❌ Invalid spender public key.' }); return;
    }
    const { deployHash, result } = await cep18Approve(contractHash, spender, amount, decimals);
    const embed = createDeploySuccessEmbed('CEP-18 Approve', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Spender', value: `\`${spender.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`CEP-18 approve successful: ${deployHash}`);
  } catch (error) {
    logger.error('CEP-18 approve failed:', error);
    await interaction.editReply({ content: `❌ Approve failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleIncreaseAllowanceCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const spender = interaction.options.getString('spender', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    if (!validatePublicKey(spender)) {
      await interaction.editReply({ content: '❌ Invalid spender public key.' }); return;
    }
    const { deployHash, result } = await cep18IncreaseAllowance(contractHash, spender, amount, decimals);
    const embed = createDeploySuccessEmbed('CEP-18 Increase Allowance', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Spender', value: `\`${spender.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`CEP-18 increase allowance successful: ${deployHash}`);
  } catch (error) {
    logger.error('CEP-18 increase allowance failed:', error);
    await interaction.editReply({ content: `❌ Increase allowance failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleDecreaseAllowanceCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const spender = interaction.options.getString('spender', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    if (!validatePublicKey(spender)) {
      await interaction.editReply({ content: '❌ Invalid spender public key.' }); return;
    }
    const { deployHash, result } = await cep18DecreaseAllowance(contractHash, spender, amount, decimals);
    const embed = createDeploySuccessEmbed('CEP-18 Decrease Allowance', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Spender', value: `\`${spender.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`CEP-18 decrease allowance successful: ${deployHash}`);
  } catch (error) {
    logger.error('CEP-18 decrease allowance failed:', error);
    await interaction.editReply({ content: `❌ Decrease allowance failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleTransferFromCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);
    const recipient = interaction.options.getString('recipient', true);
    const amount = interaction.options.getString('amount', true);
    const decimals = interaction.options.getInteger('decimals') ?? 9;
    if (!validatePublicKey(owner) || !validatePublicKey(recipient)) {
      await interaction.editReply({ content: '❌ Invalid public key. Must be 68 hex chars.' }); return;
    }
    const { deployHash, result } = await cep18TransferFrom(contractHash, owner, recipient, amount, decimals);
    const embed = createDeploySuccessEmbed('CEP-18 Transfer From', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Owner', value: `\`${owner.substring(0, 20)}...\``, inline: true },
      { name: 'Recipient', value: `\`${recipient.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: amount, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`CEP-18 transfer_from successful: ${deployHash}`);
  } catch (error) {
    logger.error('CEP-18 transfer_from failed:', error);
    await interaction.editReply({ content: `❌ Transfer from failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}
