import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  bond, delegate, unbond, undelegate, withdrawRewards, setCommissionRate,
} from '../../../services/casperTransactionService';
import { createDeploySuccessEmbed, checkSigningKey } from '../deployHelper';

function validatePublicKey(key: string): boolean {
  return /^[0-9a-fA-F]{68}$/.test(key);
}

export async function handleBondCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const amount = interaction.options.getString('amount', true);
    const delegatorRate = interaction.options.getInteger('delegator-rate') ?? undefined;
    const { deployHash, result } = await bond(amount, delegatorRate);
    const fields = [{ name: 'Amount', value: `${amount} CSPR`, inline: true }];
    if (delegatorRate !== undefined) fields.push({ name: 'Delegator Rate', value: `${delegatorRate}%`, inline: true });
    const embed = createDeploySuccessEmbed('Bond (Self-Stake)', deployHash, result, fields);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Bond successful: ${deployHash}`);
  } catch (error) {
    logger.error('Bond failed:', error);
    await interaction.editReply({ content: `❌ Bond failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleDelegateCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const validator = interaction.options.getString('validator', true);
    const amount = interaction.options.getString('amount', true);
    if (!validatePublicKey(validator)) {
      await interaction.editReply({ content: '❌ Invalid validator public key.' }); return;
    }
    const { deployHash, result } = await delegate(validator, amount);
    const embed = createDeploySuccessEmbed('Delegate', deployHash, result, [
      { name: 'Validator', value: `\`${validator.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: `${amount} CSPR`, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Delegate successful: ${deployHash}`);
  } catch (error) {
    logger.error('Delegate failed:', error);
    await interaction.editReply({ content: `❌ Delegate failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleUnbondCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const amount = interaction.options.getString('amount', true);
    const { deployHash, result } = await unbond(amount);
    const embed = createDeploySuccessEmbed('Unbond', deployHash, result, [
      { name: 'Amount', value: `${amount} CSPR`, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Unbond successful: ${deployHash}`);
  } catch (error) {
    logger.error('Unbond failed:', error);
    await interaction.editReply({ content: `❌ Unbond failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleUndelegateCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const validator = interaction.options.getString('validator', true);
    const amount = interaction.options.getString('amount', true);
    if (!validatePublicKey(validator)) {
      await interaction.editReply({ content: '❌ Invalid validator public key.' }); return;
    }
    const { deployHash, result } = await undelegate(validator, amount);
    const embed = createDeploySuccessEmbed('Undelegate', deployHash, result, [
      { name: 'Validator', value: `\`${validator.substring(0, 20)}...\``, inline: true },
      { name: 'Amount', value: `${amount} CSPR`, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Undelegate successful: ${deployHash}`);
  } catch (error) {
    logger.error('Undelegate failed:', error);
    await interaction.editReply({ content: `❌ Undelegate failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleWithdrawRewardsCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const { deployHash, result } = await withdrawRewards();
    const embed = createDeploySuccessEmbed('Withdraw Rewards', deployHash, result);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Withdraw rewards successful: ${deployHash}`);
  } catch (error) {
    logger.error('Withdraw rewards failed:', error);
    await interaction.editReply({ content: `❌ Withdraw rewards failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

export async function handleSetCommissionRateCommand(interaction: ChatInputCommandInteraction) {
  const keyError = checkSigningKey();
  if (keyError) { await interaction.reply({ content: keyError, ephemeral: true }); return; }
  await interaction.deferReply();
  try {
    const rate = interaction.options.getInteger('rate', true);
    const { deployHash, result } = await setCommissionRate(rate);
    const embed = createDeploySuccessEmbed('Set Commission Rate', deployHash, result, [
      { name: 'New Rate', value: `${rate}%`, inline: true },
    ]);
    await interaction.editReply({ embeds: [embed] });
    logger.info(`Set commission rate successful: ${deployHash}`);
  } catch (error) {
    logger.error('Set commission rate failed:', error);
    await interaction.editReply({ content: `❌ Set commission rate failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}
