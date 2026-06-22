import { ChatInputCommandInteraction } from 'discord.js';
import { logger } from '../../../utils/logger';
import {
  getEraValidators,
  getAuctionInfo,
  getDelegationInfo,
  getValidatorChangesInfo,
  getEraSummary,
} from '../../../services/casperRpcService';
import {
  createReadEmbed,
  createErrorEmbed,
  truncate,
  motesToCspr,
  validatePublicKey,
} from '../readHelper';

/**
 * Handle /era-validators command
 */
export async function handleEraValidatorsCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const blockHash = interaction.options.getString('block-hash') || undefined;
    const result = await getEraValidators(blockHash);
    const eraValidators = result?.era_validators || [];

    if (eraValidators.length === 0) {
      await interaction.editReply({ embeds: [createErrorEmbed('No Validators', 'No validators found for this era')] });
      return;
    }

    // Show top 10 validators by stake
    const topValidators = eraValidators
      .map((ev: any) => {
        const validators = ev.validator_weights || [];
        return validators.map((v: any) => ({
          publicKey: v.public_key,
          weight: v.weight,
        }));
      })
      .flat()
      .sort((a: any, b: any) => {
        const aVal = parseFloat(a.weight || '0');
        const bVal = parseFloat(b.weight || '0');
        return bVal - aVal;
      })
      .slice(0, 10);

    const validatorList = topValidators
      .map((v: any, i: number) => {
        const weightCspr = motesToCspr(v.weight);
        return `${i + 1}. \`${truncate(v.publicKey, 30)}\`\n   Stake: ${weightCspr} CSPR`;
      })
      .join('\n\n');

    const embed = createReadEmbed('⚖️ Era Validators', [
      { name: 'Era ID', value: result?.era_id?.toString() || 'N/A', inline: true },
      { name: 'Total Validator Sets', value: eraValidators.length.toString(), inline: true },
      { name: 'Top 10 Validators', value: validatorList, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Era validators query successful');
  } catch (error) {
    logger.error('Era validators query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /validator-detail command
 */
export async function handleValidatorDetailCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const publicKey = interaction.options.getString('public-key', true);

    if (!validatePublicKey(publicKey)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Public Key', 'Public key must be 68 hex chars')] });
      return;
    }

    // Get auction info and find this validator's bid
    const result = await getAuctionInfo();
    const bids = result?.auction_state?.bids || [];

    const validatorBid = bids.find((b: any) => b.public_key === publicKey);

    if (!validatorBid) {
      await interaction.editReply({ embeds: [createErrorEmbed('Validator Not Found', 'No bid found for this public key')] });
      return;
    }

    const bid = validatorBid.bid || {};
    const stakedAmount = motesToCspr(bid.staked_amount || '0');
    const delegationRate = bid.delegation_rate?.toString() || 'N/A';
    const vestingSchedule = bid.vesting_schedule ? 'Yes' : 'No';
    const inactive = bid.inactive ? 'Yes' : 'No';

    // Count delegators
    const delegators = bid.delegators || [];
    const totalDelegated = delegators.reduce((sum: number, d: any) => {
      return sum + parseFloat(d.staked_amount || '0');
    }, 0);
    const totalDelegatedCspr = motesToCspr(totalDelegated.toString());

    const embed = createReadEmbed('⚖️ Validator Details', [
      { name: 'Public Key', value: `\`${truncate(publicKey, 45)}\``, inline: false },
      { name: 'Staked Amount', value: `${stakedAmount} CSPR`, inline: true },
      { name: 'Delegation Rate', value: `${delegationRate}%`, inline: true },
      { name: 'Inactive', value: inactive, inline: true },
      { name: 'Vesting Schedule', value: vestingSchedule, inline: true },
      { name: 'Delegator Count', value: delegators.length.toString(), inline: true },
      { name: 'Total Delegated', value: `${totalDelegatedCspr} CSPR`, inline: true },
    ]);

    // Show top 5 delegators if any
    if (delegators.length > 0) {
      const topDelegators = delegators
        .sort((a: any, b: any) => parseFloat(b.staked_amount || '0') - parseFloat(a.staked_amount || '0'))
        .slice(0, 5);

      const delegatorList = topDelegators
        .map((d: any, i: number) => {
          const amount = motesToCspr(d.staked_amount);
          return `${i + 1}. \`${truncate(d.public_key, 30)}\`\n   Delegated: ${amount} CSPR`;
        })
        .join('\n\n');

      embed.addFields({ name: 'Top 5 Delegators', value: delegatorList, inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
    logger.info('Validator detail query successful');
  } catch (error) {
    logger.error('Validator detail query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /delegation command
 */
export async function handleDelegationCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const delegator = interaction.options.getString('delegator', true);
    const validator = interaction.options.getString('validator') || undefined;

    if (!validatePublicKey(delegator)) {
      await interaction.editReply({ embeds: [createErrorEmbed('Invalid Public Key', 'Delegator key must be 68 hex chars')] });
      return;
    }

    // Get auction info and find delegations
    const result = await getAuctionInfo();
    const bids = result?.auction_state?.bids || [];

    const delegations: { validator: string; amount: string }[] = [];

    for (const bid of bids) {
      const delegators = bid.bid?.delegators || [];
      for (const d of delegators) {
        if (d.public_key === delegator) {
          if (!validator || bid.public_key === validator) {
            delegations.push({
              validator: bid.public_key,
              amount: d.staked_amount || '0',
            });
          }
        }
      }
    }

    if (delegations.length === 0) {
      await interaction.editReply({ embeds: [createErrorEmbed('No Delegations', 'No delegation records found for this account')] });
      return;
    }

    const delegationList = delegations
      .map((d, i) => {
        const amount = motesToCspr(d.amount);
        return `${i + 1}. Validator: \`${truncate(d.validator, 30)}\`\n   Amount: ${amount} CSPR`;
      })
      .join('\n\n');

    const totalDelegated = delegations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

    const embed = createReadEmbed('⚖️ Delegation Info', [
      { name: 'Delegator', value: `\`${truncate(delegator, 45)}\``, inline: false },
      { name: 'Total Delegations', value: delegations.length.toString(), inline: true },
      { name: 'Total Delegated', value: `${motesToCspr(totalDelegated.toString())} CSPR`, inline: true },
      { name: 'Delegation Details', value: delegationList, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Delegation query successful');
  } catch (error) {
    logger.error('Delegation query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /auction-info command
 */
export async function handleAuctionInfoCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const blockHash = interaction.options.getString('block-hash') || undefined;
    const result = await getAuctionInfo(blockHash);
    const auctionState = result?.auction_state || {};

    const bids = auctionState.bids || [];
    const activeBids = bids.filter((b: any) => b.bid && !b.bid.inactive);
    const totalStaked = activeBids.reduce((sum: number, b: any) => {
      return sum + parseFloat(b.bid?.staked_amount || '0');
    }, 0);

    const embed = createReadEmbed('⚖️ Auction State', [
      { name: 'Era ID', value: auctionState.era_id?.toString() || 'N/A', inline: true },
      { name: 'State Root Hash', value: `\`${truncate(auctionState.state_root_hash, 30)}\``, inline: false },
      { name: 'Total Bids', value: bids.length.toString(), inline: true },
      { name: 'Active Bids', value: activeBids.length.toString(), inline: true },
      { name: 'Total Staked', value: `${motesToCspr(totalStaked.toString())} CSPR`, inline: true },
      { name: 'Block Height', value: auctionState.block_height?.toString() || 'N/A', inline: true },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Auction info query successful');
  } catch (error) {
    logger.error('Auction info query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /validator-changes command
 */
export async function handleValidatorChangesCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const result = await getValidatorChangesInfo();
    const changes = result?.changes || [];

    if (changes.length === 0) {
      const embed = createReadEmbed('⚖️ Validator Changes', [
        { name: 'Status', value: 'No recent validator changes', inline: false },
      ]);
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const changesList = changes
      .slice(0, 10)
      .map((c: any, i: number) => {
        const publicKey = truncate(c.public_key, 35);
        const type = c.change_type || {};
        const changeStr = type.Activated ? 'Activated' : type.Deactivated ? 'Deactivated' : 'Changed';
        return `${i + 1}. \`${publicKey}\`\n   Type: ${changeStr}`;
      })
      .join('\n\n');

    const embed = createReadEmbed('⚖️ Validator Changes', [
      { name: 'Total Changes', value: changes.length.toString(), inline: true },
      { name: 'Recent Changes (Top 10)', value: changesList, inline: false },
    ]);

    await interaction.editReply({ embeds: [embed] });
    logger.info('Validator changes query successful');
  } catch (error) {
    logger.error('Validator changes query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}

/**
 * Handle /era-summary command
 */
export async function handleEraSummaryCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const blockHash = interaction.options.getString('block-hash') || undefined;
    const result = await getEraSummary(blockHash);
    const eraSummary = result?.era_summary || {};

    // Get validator rewards if available
    const rewards = eraSummary.seigniorage_allocations || [];
    const totalReward = rewards.reduce((sum: number, r: any) => {
      return sum + parseFloat(r.amount || '0');
    }, 0);

    const embed = createReadEmbed('📅 Era Summary', [
      { name: 'Era ID', value: eraSummary.era_id?.toString() || 'N/A', inline: true },
      { name: 'Block Hash', value: `\`${truncate(eraSummary.block_hash, 30)}\``, inline: false },
      { name: 'State Root Hash', value: `\`${truncate(eraSummary.state_root_hash, 30)}\``, inline: false },
      { name: 'Total Rewards', value: `${motesToCspr(totalReward.toString())} CSPR`, inline: true },
      { name: 'Reward Recipients', value: rewards.length.toString(), inline: true },
    ]);

    // Show top 5 reward recipients
    if (rewards.length > 0) {
      const topRewards = rewards
        .sort((a: any, b: any) => parseFloat(b.amount || '0') - parseFloat(a.amount || '0'))
        .slice(0, 5);

      const rewardList = topRewards
        .map((r: any, i: number) => {
          const amount = motesToCspr(r.amount);
          const recipient = r.Validator ? `Validator: \`${truncate(r.Validator, 25)}\`` : `Delegator: \`${truncate(r.Delegator, 25)}\``;
          return `${i + 1}. ${recipient}\n   Reward: ${amount} CSPR`;
        })
        .join('\n\n');

      embed.addFields({ name: 'Top 5 Reward Recipients', value: rewardList, inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
    logger.info('Era summary query successful');
  } catch (error) {
    logger.error('Era summary query failed:', error);
    await interaction.editReply({
      embeds: [createErrorEmbed('Query Failed', error instanceof Error ? error.message : 'Unknown error')],
    });
  }
}
