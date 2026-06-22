import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  cep47Mint, cep47MintCopies, cep47Burn, cep47Transfer,
  cep47Approve, cep47TransferFrom, cep78SetTokenMetadata,
  cep78BatchTransfer, cep78BatchBurn, cep78SetAdmin,
} from '../../../services/casperTransactionService';
import { createDeploySuccessEmbed, checkSigningKey } from '../deployHelper';

function validatePublicKey(key: string): boolean {
  return /^[0-9a-fA-F]{68}$/.test(key);
}

export async function handleNftMintCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const recipient = interaction.options.getString('recipient', true);
    const tokenId = interaction.options.getString('token-id', true);
    const metadataKey = interaction.options.getString('metadata-key');
    const metadataValue = interaction.options.getString('metadata-value');

    if (!validatePublicKey(recipient)) {
      await interaction.editReply({ content: '❌ Invalid recipient public key.' }); return;
    }

    const metadata = (metadataKey && metadataValue) ? { [metadataKey]: metadataValue } : undefined;

    const { deployHash, result } = await cep47Mint(contractHash, recipient, tokenId, metadata);
    const embed = createDeploySuccessEmbed('NFT Mint (CEP-47)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Recipient', value: `\`${recipient.substring(0, 20)}...\``, inline: true },
      { name: 'Token ID', value: tokenId, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT mint successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT mint failed:', error);
    await interaction.editReply({ content: `❌ NFT mint failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftMintCopiesCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const recipient = interaction.options.getString('recipient', true);
    const count = interaction.options.getInteger('count', true);

    if (!validatePublicKey(recipient)) {
      await interaction.editReply({ content: '❌ Invalid recipient public key.' }); return;
    }

    const { deployHash, result } = await cep47MintCopies(contractHash, recipient, count);
    const embed = createDeploySuccessEmbed('NFT Batch Mint (CEP-47)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Recipient', value: `\`${recipient.substring(0, 20)}...\``, inline: true },
      { name: 'Count', value: count.toString(), inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT mint copies successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT mint copies failed:', error);
    await interaction.editReply({ content: `❌ NFT mint copies failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftBurnCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);
    const tokenId = interaction.options.getString('token-id', true);

    if (!validatePublicKey(owner)) {
      await interaction.editReply({ content: '❌ Invalid owner public key.' }); return;
    }

    const { deployHash, result } = await cep47Burn(contractHash, owner, tokenId);
    const embed = createDeploySuccessEmbed('NFT Burn (CEP-47)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Owner', value: `\`${owner.substring(0, 20)}...\``, inline: true },
      { name: 'Token ID', value: tokenId, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT burn successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT burn failed:', error);
    await interaction.editReply({ content: `❌ NFT burn failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftTransferCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const recipient = interaction.options.getString('recipient', true);
    const tokenId = interaction.options.getString('token-id', true);

    if (!validatePublicKey(recipient)) {
      await interaction.editReply({ content: '❌ Invalid recipient public key.' }); return;
    }

    const { deployHash, result } = await cep47Transfer(contractHash, recipient, tokenId);
    const embed = createDeploySuccessEmbed('NFT Transfer (CEP-47)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Recipient', value: `\`${recipient.substring(0, 20)}...\``, inline: true },
      { name: 'Token ID', value: tokenId, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT transfer successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT transfer failed:', error);
    await interaction.editReply({ content: `❌ NFT transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftApproveCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const spender = interaction.options.getString('spender', true);
    const tokenId = interaction.options.getString('token-id', true);

    if (!validatePublicKey(spender)) {
      await interaction.editReply({ content: '❌ Invalid spender public key.' }); return;
    }

    const { deployHash, result } = await cep47Approve(contractHash, spender, tokenId);
    const embed = createDeploySuccessEmbed('NFT Approve (CEP-47)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Spender', value: `\`${spender.substring(0, 20)}...\``, inline: true },
      { name: 'Token ID', value: tokenId, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT approve successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT approve failed:', error);
    await interaction.editReply({ content: `❌ NFT approve failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftTransferFromCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);
    const recipient = interaction.options.getString('recipient', true);
    const tokenId = interaction.options.getString('token-id', true);

    if (!validatePublicKey(owner) || !validatePublicKey(recipient)) {
      await interaction.editReply({ content: '❌ Invalid public key.' }); return;
    }

    const { deployHash, result } = await cep47TransferFrom(contractHash, owner, recipient, tokenId);
    const embed = createDeploySuccessEmbed('NFT Transfer From (CEP-47)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Owner', value: `\`${owner.substring(0, 20)}...\``, inline: true },
      { name: 'Recipient', value: `\`${recipient.substring(0, 20)}...\``, inline: true },
      { name: 'Token ID', value: tokenId, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT transfer_from successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT transfer_from failed:', error);
    await interaction.editReply({ content: `❌ NFT transfer_from failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftSetMetadataCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const tokenId = interaction.options.getString('token-id', true);
    const metadataKey = interaction.options.getString('metadata-key', true);
    const metadataValue = interaction.options.getString('metadata-value', true);

    const { deployHash, result } = await cep78SetTokenMetadata(contractHash, tokenId, { [metadataKey]: metadataValue });
    const embed = createDeploySuccessEmbed('NFT Set Metadata (CEP-78)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Token ID', value: tokenId, inline: true },
      { name: metadataKey, value: metadataValue, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT set metadata successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT set metadata failed:', error);
    await interaction.editReply({ content: `❌ Set metadata failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftBatchTransferCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const recipient = interaction.options.getString('recipient', true);
    const tokenIdsStr = interaction.options.getString('token-ids', true);
    const tokenIds = tokenIdsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (!validatePublicKey(recipient)) {
      await interaction.editReply({ content: '❌ Invalid recipient public key.' }); return;
    }

    const { deployHash, result } = await cep78BatchTransfer(contractHash, recipient, tokenIds);
    const embed = createDeploySuccessEmbed('NFT Batch Transfer (CEP-78)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Recipient', value: `\`${recipient.substring(0, 20)}...\``, inline: true },
      { name: 'Token Count', value: tokenIds.length.toString(), inline: true },
      { name: 'Token IDs', value: tokenIdsStr, inline: false },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT batch transfer successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT batch transfer failed:', error);
    await interaction.editReply({ content: `❌ Batch transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftBatchBurnCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const owner = interaction.options.getString('owner', true);
    const tokenIdsStr = interaction.options.getString('token-ids', true);
    const tokenIds = tokenIdsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (!validatePublicKey(owner)) {
      await interaction.editReply({ content: '❌ Invalid owner public key.' }); return;
    }

    const { deployHash, result } = await cep78BatchBurn(contractHash, owner, tokenIds);
    const embed = createDeploySuccessEmbed('NFT Batch Burn (CEP-78)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'Owner', value: `\`${owner.substring(0, 20)}...\``, inline: true },
      { name: 'Token Count', value: tokenIds.length.toString(), inline: true },
      { name: 'Token IDs', value: tokenIdsStr, inline: false },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT batch burn successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT batch burn failed:', error);
    await interaction.editReply({ content: `❌ Batch burn failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleNftSetAdminCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const contractHash = interaction.options.getString('contract-hash', true);
    const admin = interaction.options.getString('admin', true);

    if (!validatePublicKey(admin)) {
      await interaction.editReply({ content: '❌ Invalid admin public key.' }); return;
    }

    const { deployHash, result } = await cep78SetAdmin(contractHash, admin);
    const embed = createDeploySuccessEmbed('NFT Set Admin (CEP-78)', deployHash, result, [
      { name: 'Contract', value: `\`${contractHash.substring(0, 20)}...\``, inline: true },
      { name: 'New Admin', value: `\`${admin.substring(0, 20)}...\``, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`NFT set admin successful: ${deployHash}`);
  } catch (error) {
    logger.error('NFT set admin failed:', error);
    await interaction.editReply({ content: `❌ Set admin failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}
