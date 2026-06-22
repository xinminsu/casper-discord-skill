import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  transferCspr,
  createPurse,
  addAssociatedKey,
  removeAssociatedKey,
  setActionThreshold,
  putNamedKey,
  getSigningPublicKeyHex,
} from '../../../services/casperTransactionService';
import { createDeploySuccessEmbed, checkSigningKey } from '../deployHelper';

/**
 * Validate a Casper public key (68 hex chars)
 */
function validatePublicKey(key: string): boolean {
  return /^[0-9a-fA-F]{68}$/.test(key);
}

/**
 * Handle /transfer command
 */
export async function handleTransferCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) {
    await interaction.reply({ content: keyError, ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const recipient = interaction.options.getString('recipient', true);
    const amount = interaction.options.getString('amount', true);
    const transferId = interaction.options.getInteger('transfer-id') ?? undefined;
    const sourcePurse = interaction.options.getString('source-purse') ?? undefined;

    if (!validatePublicKey(recipient)) {
      await interaction.editReply({
        content: '❌ Invalid recipient public key. Must be 68 hex characters starting with 02 or 03.',
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      await interaction.editReply({
        content: '❌ Invalid amount. Must be a positive number.',
      });
      return;
    }

    const { deployHash, result } = await transferCspr(recipient, amount, transferId, sourcePurse);

    const embed = createDeploySuccessEmbed(
      'CSPR Transfer',
      deployHash,
      result,
      [
        { name: 'From', value: `\`${getSigningPublicKeyHex().substring(0, 30)}...\``, inline: true },
        { name: 'To', value: `\`${recipient.substring(0, 30)}...\``, inline: true },
        { name: 'Amount', value: `${amount} CSPR`, inline: true },
      ]
    );

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Transfer successful: ${deployHash}`);
  } catch (error) {
    logger.error('Transfer failed:', error);
    await interaction.editReply({
      content: `❌ Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /create-purse command
 */
export async function handleCreatePurseCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) {
    await interaction.reply({ content: keyError, ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const name = interaction.options.getString('name') ?? undefined;

    const { deployHash, result } = await createPurse(name);

    const embed = createDeploySuccessEmbed(
      'Create Purse',
      deployHash,
      result,
      name ? [{ name: 'Purse Name', value: name, inline: true }] : undefined
    );

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Create purse successful: ${deployHash}`);
  } catch (error) {
    logger.error('Create purse failed:', error);
    await interaction.editReply({
      content: `❌ Create purse failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /add-key command
 */
export async function handleAddKeyCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) {
    await interaction.reply({ content: keyError, ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const publicKey = interaction.options.getString('public-key', true);
    const weight = interaction.options.getInteger('weight', true);

    if (!validatePublicKey(publicKey)) {
      await interaction.editReply({
        content: '❌ Invalid public key. Must be 68 hex characters starting with 02 or 03.',
      });
      return;
    }

    const { deployHash, result } = await addAssociatedKey(publicKey, weight);

    const embed = createDeploySuccessEmbed(
      'Add Associated Key',
      deployHash,
      result,
      [
        { name: 'Added Key', value: `\`${publicKey.substring(0, 30)}...\``, inline: true },
        { name: 'Weight', value: weight.toString(), inline: true },
      ]
    );

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Add key successful: ${deployHash}`);
  } catch (error) {
    logger.error('Add key failed:', error);
    await interaction.editReply({
      content: `❌ Add key failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /remove-key command
 */
export async function handleRemoveKeyCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) {
    await interaction.reply({ content: keyError, ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const publicKey = interaction.options.getString('public-key', true);

    if (!validatePublicKey(publicKey)) {
      await interaction.editReply({
        content: '❌ Invalid public key. Must be 68 hex characters starting with 02 or 03.',
      });
      return;
    }

    const { deployHash, result } = await removeAssociatedKey(publicKey);

    const embed = createDeploySuccessEmbed(
      'Remove Associated Key',
      deployHash,
      result,
      [
        { name: 'Removed Key', value: `\`${publicKey.substring(0, 30)}...\``, inline: true },
      ]
    );

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Remove key successful: ${deployHash}`);
  } catch (error) {
    logger.error('Remove key failed:', error);
    await interaction.editReply({
      content: `❌ Remove key failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /set-threshold command
 */
export async function handleSetThresholdCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) {
    await interaction.reply({ content: keyError, ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const actionType = interaction.options.getString('action-type', true);
    const threshold = interaction.options.getInteger('threshold', true);

    const { deployHash, result } = await setActionThreshold(actionType, threshold);

    const embed = createDeploySuccessEmbed(
      'Set Action Threshold',
      deployHash,
      result,
      [
        { name: 'Action Type', value: actionType, inline: true },
        { name: 'New Threshold', value: threshold.toString(), inline: true },
      ]
    );

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Set threshold successful: ${deployHash}`);
  } catch (error) {
    logger.error('Set threshold failed:', error);
    await interaction.editReply({
      content: `❌ Set threshold failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /put-named-key command
 */
export async function handlePutNamedKeyCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) {
    await interaction.reply({ content: keyError, ephemeral: true });
    return;
  }

  await interaction.deferReply();

  try {
    const name = interaction.options.getString('name', true);
    const keyValue = interaction.options.getString('key-value', true);

    const { deployHash, result } = await putNamedKey(name, keyValue);

    const embed = createDeploySuccessEmbed(
      'Put Named Key',
      deployHash,
      result,
      [
        { name: 'Key Name', value: name, inline: true },
        { name: 'Key Value', value: `\`${keyValue.substring(0, 30)}...\``, inline: true },
      ]
    );

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Put named key successful: ${deployHash}`);
  } catch (error) {
    logger.error('Put named key failed:', error);
    await interaction.editReply({
      content: `❌ Put named key failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
