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

  // Validate address format - Support Ethereum, Casper public key, and account hash
  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr) ||  // Ethereum
           /^[0-9a-fA-F]{68}$/.test(addr) ||     // Casper public key
           /^[0-9a-fA-F]{64}$/.test(addr);       // Casper account hash
  };
  
  if (!isValidAddress(from) || !isValidAddress(to)) {
    await interaction.editReply({
      content: '❌ Invalid wallet address format\n\nSupported formats:\n' +
               '1. Ethereum-style: 42 characters (0x + 40 hex chars)\n' +
               '   Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1\n' +
               '2. Casper Public Key: 68 hex characters (starts with 02 or 03)\n' +
               '   Example: 020275edc1e5e65f4ee0b21453e797b3750f3ea68746675865e12a2e93173c1263e7\n' +
               '3. Casper Account Hash: 64 hex characters\n' +
               '   Example: eb8b2c5376ba27c96cf79d596e2906d276547bf384ed5358899dfa58c5fea287',
    });
    return;
  }

  try {
    // Handle different address formats
    const formatAddress = (addr: string) => {
      if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        return ethers.getAddress(addr.toLowerCase());
      }
      // Casper public key or account hash - use as-is (lowercase)
      return addr.toLowerCase();
    };
    
    const checksumFrom = formatAddress(from);
    const checksumTo = formatAddress(to);
    
    const gasInfo = await estimateGas(checksumFrom, checksumTo, value, '0x');

    const embed = new EmbedBuilder()
      .setTitle('⛽ Gas Estimation Result')
      .setColor(0xFFA500)
      .addFields(
        { name: 'From', value: `\`${from}\``, inline: false },
        { name: 'To', value: `\`${to}\``, inline: false },
        { name: 'Amount', value: `${value} CSPR`, inline: true },
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
