import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ethers } from 'ethers';
import { estimateGas, getCurrentGasPrice } from '../../services/web3Service';
import { logger } from '../../utils/logger';

export async function handleGasPriceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const gasPrices = await getCurrentGasPrice();

    const embed = new EmbedBuilder()
      .setTitle('⛽ Current Gas Price')
      .setColor(0x00FF00)
      .addFields(
        { name: 'Network', value: 'CASPER', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Gas Price', value: `\`${gasPrices.gasPrice}\``, inline: true },
        { name: 'Max Fee Per Gas', value: `\`${gasPrices.maxFeePerGas}\``, inline: true },
        { name: 'Priority Fee', value: `\`${gasPrices.maxPriorityFeePerGas}\``, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    await interaction.editReply({
      embeds: [embed],
    });

    logger.info(`Query Gas price: Casper`);
  } catch (error) {
    logger.error('Gas price query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

export async function handleGasEstimateCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const from = interaction.options.getString('from', true);
  const to = interaction.options.getString('to', true);
  const value = interaction.options.getString('value') || '0';

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(from) || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
    await interaction.editReply({
      content: '❌ Invalid wallet address format. Addresses must be 42 characters (0x + 40 hex chars)',
    });
    return;
  }

  try {
    // Convert addresses to checksum format to avoid checksum errors
    // First convert to lowercase, then get proper checksum
    const checksumFrom = ethers.getAddress(from.toLowerCase());
    const checksumTo = ethers.getAddress(to.toLowerCase());
    
    const gasInfo = await estimateGas(checksumFrom, checksumTo, value, '0x');

    const embed = new EmbedBuilder()
      .setTitle('⛽ Gas Estimation Result')
      .setColor(0xFFA500)
      .addFields(
        { name: 'From', value: `\`${from}\``, inline: false },
        { name: 'To', value: `\`${to}\``, inline: false },
        { name: 'Amount', value: `${value} ETH`, inline: true },
        { name: 'Network', value: 'Casper', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Gas Limit', value: `\`${gasInfo.gasLimit}\``, inline: true },
        { name: 'Gas Price', value: `\`${gasInfo.gasPrice}\``, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Max Fee Per Gas', value: `\`${gasInfo.maxFeePerGas}\``, inline: true },
        { name: 'Priority Fee', value: `\`${gasInfo.maxPriorityFeePerGas}\``, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Estimated Total Cost', value: `\`${gasInfo.estimatedCost}\``, inline: false }
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    await interaction.editReply({
      embeds: [embed],
    });

    logger.info(`Gas estimate: ${from} -> ${to} on Casper`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Gas estimation failed:', error);
    
    // Format the error message for better readability
    let userMessage = `❌ Gas estimation failed\n\n${errorMessage}`;
    
    await interaction.editReply({
      content: userMessage,
    });
  }
}
