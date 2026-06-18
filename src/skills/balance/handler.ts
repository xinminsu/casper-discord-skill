import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ethers } from 'ethers';
import { getEthBalance, getTokenBalance } from '../../services/web3Service';
import { logger } from '../../utils/logger';

export async function handleBalanceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const address = interaction.options.getString('address', true);
  const token = interaction.options.getString('token');

  // Validate address format - Support Ethereum, Casper public key, and account hash formats
  const isEthereumFormat = /^0x[a-fA-F0-9]{40}$/.test(address);
  const isCasperPublicKey = /^[0-9a-fA-F]{68}$/.test(address); // Casper compressed public key (68 hex chars, starts with 02 or 03)
  const isCasperAccountHash = /^[0-9a-fA-F]{64}$/.test(address); // Casper account hash (64 hex chars)
  
  if (!isEthereumFormat && !isCasperPublicKey && !isCasperAccountHash) {
    const length = address.length;
    await interaction.editReply({
      content: `❌ Invalid wallet address format\n\nSupported formats:\n` +
               `1. Ethereum-style: 42 characters (0x + 40 hex chars)\n` +
               `   Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1\n` +
               `2. Casper Public Key: 68 hex characters (starts with 02 or 03)\n` +
               `   Example: 020275edc1e5e65f4ee0b21453e797b3750f3ea68746675865e12a2e93173c1263e7\n` +
               `3. Casper Account Hash: 64 hex characters\n` +
               `   Example: eb8b2c5376ba27c96cf79d596e2906d276547bf384ed5358899dfa58c5fea287\n\n` +
               `Received: ${length} characters`,
    });
    return;
  }

  try {
    let checksumAddress: string;
    let addressType: string;
    
    // Handle different address formats
    if (isEthereumFormat) {
      // Ethereum-style address - convert to checksum
      checksumAddress = ethers.getAddress(address.toLowerCase());
      addressType = 'Ethereum-style';
    } else if (isCasperPublicKey) {
      // Casper public key (68 hex chars, starts with 02 or 03)
      checksumAddress = address.toLowerCase();
      addressType = 'Casper Public Key';
    } else {
      // Casper account hash (64 hex chars)
      checksumAddress = address.toLowerCase();
      addressType = 'Casper Account Hash';
    }
    
    let balanceInfo: string;
    let title: string;

    if (token) {
      // Query ERC20 token balance
      if (!/^0x[a-fA-F0-9]{40}$/.test(token)) {
        await interaction.editReply({
          content: '❌ Invalid token contract address format. Must be 42 characters (0x + 40 hex chars)',
        });
        return;
      }
      
      // Convert token address to checksum format
      const checksumToken = ethers.getAddress(token.toLowerCase());
      balanceInfo = await getTokenBalance(checksumToken, checksumAddress);
      title = `💰 Casper Token Balance`;
    } else {
      // Query CSPR balance
      balanceInfo = await getEthBalance(checksumAddress);
      title = `💰 Casper CSPR Balance`;
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(0x0099FF)
      .addFields(
        { name: 'Wallet Address', value: `\`${checksumAddress}\``, inline: false },
        { name: 'Address Type', value: addressType, inline: true },
        { name: 'Balance', value: `\`${balanceInfo}\``, inline: false },
        { name: 'Network', value: 'Casper', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    await interaction.editReply({
      embeds: [embed],
    });

    logger.info(`Query balance: ${checksumAddress} on Casper`);
  } catch (error) {
    logger.error('Balance query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
