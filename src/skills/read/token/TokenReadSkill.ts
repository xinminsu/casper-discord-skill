import { BaseSkill } from '../../BaseSkill';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  tokenTotalSupplyCommand,
  tokenBalanceCommand,
  tokenAllowanceCommand,
  tokenMetaCommand,
  nftTotalSupplyCommand,
  nftOwnerOfCommand,
  nftTokensOfCommand,
  nftMetadataCommand,
  nftApprovedCommand,
  nftMaxSupplyCommand,
  nftBatchOwnersCommand,
} from './commands';
import {
  handleTokenTotalSupplyCommand,
  handleTokenBalanceCommand,
  handleTokenAllowanceCommand,
  handleTokenMetaCommand,
  handleNftTotalSupplyCommand,
  handleNftOwnerOfCommand,
  handleNftTokensOfCommand,
  handleNftMetadataCommand,
  handleNftApprovedCommand,
  handleNftMaxSupplyCommand,
  handleNftBatchOwnersCommand,
} from './handler';

/**
 * Token Read Skill
 *
 * Read-only queries for CEP-18 fungible tokens and CEP-47/CEP-78 NFTs:
 * - CEP-18: total_supply, balance_of, allowance, name/symbol/decimals
 * - CEP-47/78: total_supply, owner_of, tokens_of_owner, metadata, approved, max_supply, batch_owners
 */
export class TokenReadSkill extends BaseSkill {
  constructor() {
    super({
      name: 'token-read',
      version: '1.0.0',
      description: 'Query CEP-18 fungible tokens and CEP-47/78 NFT information (read-only)',
      author: 'Casper Team',
      commands: [
        tokenTotalSupplyCommand,
        tokenBalanceCommand,
        tokenAllowanceCommand,
        tokenMetaCommand,
        nftTotalSupplyCommand,
        nftOwnerOfCommand,
        nftTokensOfCommand,
        nftMetadataCommand,
        nftApprovedCommand,
        nftMaxSupplyCommand,
        nftBatchOwnersCommand,
      ],
    });
  }

  async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    switch (interaction.commandName) {
      // CEP-18
      case 'token-total-supply':
        await handleTokenTotalSupplyCommand(interaction);
        break;
      case 'token-balance':
        await handleTokenBalanceCommand(interaction);
        break;
      case 'token-allowance':
        await handleTokenAllowanceCommand(interaction);
        break;
      case 'token-meta':
        await handleTokenMetaCommand(interaction);
        break;
      // CEP-47 / CEP-78 NFT
      case 'nft-total-supply':
        await handleNftTotalSupplyCommand(interaction);
        break;
      case 'nft-owner-of':
        await handleNftOwnerOfCommand(interaction);
        break;
      case 'nft-tokens-of':
        await handleNftTokensOfCommand(interaction);
        break;
      case 'nft-metadata':
        await handleNftMetadataCommand(interaction);
        break;
      case 'nft-approved':
        await handleNftApprovedCommand(interaction);
        break;
      case 'nft-max-supply':
        await handleNftMaxSupplyCommand(interaction);
        break;
      case 'nft-batch-owners':
        await handleNftBatchOwnersCommand(interaction);
        break;
      default:
        await interaction.reply({
          content: `❌ Unknown command: ${interaction.commandName}`,
          ephemeral: true,
        });
    }
  }
}
