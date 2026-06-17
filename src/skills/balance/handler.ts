import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ethers } from 'ethers';
import { getEthBalance, getTokenBalance } from '../../services/web3Service';
import { logger } from '../../utils/logger';

export async function handleBalanceCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const address = interaction.options.getString('address', true);
  const token = interaction.options.getString('token');

  // Validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    const length = address.length;
    const expectedLength = 42;
    await interaction.editReply({
      content: `❌ Invalid wallet address format\n\nExpected: 42 characters (0x + 40 hex chars)\nReceived: ${length} characters\n\nExample: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1`,
    });
    return;
  }

  try {
    // Convert addresses to checksum format to avoid checksum errors
    // First convert to lowercase, then get proper checksum
    const checksumAddress = ethers.getAddress(address.toLowerCase());
    
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
      // Query ETH balance
      balanceInfo = await getEthBalance(checksumAddress);
      title = `💰 Casper ETH Balance`;
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(0x0099FF)
      .addFields(
        { name: 'Wallet Address', value: `\`${checksumAddress}\``, inline: false },
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
