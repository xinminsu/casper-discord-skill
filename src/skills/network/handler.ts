import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { logger } from '../../utils/logger';
import {
  getNodeStatus,
  getPeers,
  getBlockByHash,
  getBlockByHeight,
  getDeploy,
  getBlockTransfers,
  getEraInfo,
  getStateRootHash,
  getAuctionInfo,
  getChainspec,
} from '../../services/casperRpcService';

/**
 * Truncate a string for display
 */
function truncate(str: string, maxLen: number = 50): string {
  if (!str) return 'N/A';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

/**
 * Format timestamp
 */
function formatTimestamp(ts?: number): string {
  if (!ts) return 'N/A';
  return new Date(ts).toUTCString();
}

/**
 * Handle /node-status command
 */
export async function handleNodeStatusCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const status = await getNodeStatus();

    const embed = new EmbedBuilder()
      .setTitle('🌐 Casper Node Status')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Chain Name', value: status.chainspec_name || 'N/A', inline: true },
        { name: 'API Version', value: status.api_version || 'N/A', inline: true },
        { name: 'Starting State Root Hash', value: `\`${truncate(status.starting_state_root_hash, 30)}\``, inline: false },
        { name: 'Last Added Block Hash', value: `\`${truncate(status.last_added_block_info?.hash, 30)}\``, inline: false },
        { name: 'Last Added Block Height', value: status.last_added_block_info?.height?.toString() || 'N/A', inline: true },
        { name: 'Last Added Block Timestamp', value: formatTimestamp(status.last_added_block_info?.timestamp), inline: true },
        { name: 'Our Public Key', value: `\`${truncate(status.our_public_signing_key, 30)}\``, inline: false },
        { name: 'Peers', value: status.peers?.length?.toString() || '0', inline: true },
        { name: 'Build Version', value: status.build_version || 'N/A', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    await interaction.editReply({ embeds: [embed] });
    logger.info('Node status query successful');
  } catch (error) {
    logger.error('Node status query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /peers command
 */
export async function handlePeersCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const result = await getPeers();
    const peers = result.peers || [];

    const embed = new EmbedBuilder()
      .setTitle('🔌 Casper Network Peers')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Total Peers', value: peers.length.toString(), inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    // Show up to 10 peers
    const peerList = peers.slice(0, 10).map((peer: any, i: number) =>
      `${i + 1}. \`${peer.node_id}\` - ${peer.address}`
    ).join('\n') || 'No peers found';

    embed.addFields({ name: 'Peer List (Top 10)', value: peerList, inline: false });

    if (peers.length > 10) {
      embed.addFields({ name: 'Note', value: `Showing 10 of ${peers.length} peers`, inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Peers query successful: ${peers.length} peers`);
  } catch (error) {
    logger.error('Peers query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /block command
 */
export async function handleBlockCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const hash = interaction.options.getString('hash');
    const height = interaction.options.getInteger('height');

    let result;
    if (hash) {
      result = await getBlockByHash(hash);
    } else if (height !== null) {
      result = await getBlockByHeight(height);
    } else {
      // Get latest block
      result = await getBlockByHeight(0);
    }

    const block = result.block;
    if (!block) {
      await interaction.editReply({ content: '❌ Block not found' });
      return;
    }

    const header = block.header || {};
    const body = block.body || {};

    const embed = new EmbedBuilder()
      .setTitle('📦 Casper Block Information')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Block Hash', value: `\`${truncate(block.hash, 40)}\``, inline: false },
        { name: 'Height', value: header.height?.toString() || 'N/A', inline: true },
        { name: 'Era', value: header.era_id?.toString() || 'N/A', inline: true },
        { name: 'Timestamp', value: formatTimestamp(header.timestamp), inline: true },
        { name: 'State Root Hash', value: `\`${truncate(header.state_root_hash, 30)}\``, inline: false },
        { name: 'Parent Hash', value: `\`${truncate(header.parent_hash, 30)}\``, inline: false },
        { name: 'Proposer', value: `\`${truncate(header.proposer, 30)}\``, inline: false },
        { name: 'Deploy Count', value: body.deploy_hashes?.length?.toString() || '0', inline: true },
        { name: 'Transfer Count', value: body.transfer_hashes?.length?.toString() || '0', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    await interaction.editReply({ embeds: [embed] });
    logger.info('Block query successful');
  } catch (error) {
    logger.error('Block query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /deploy command
 */
export async function handleDeployCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const hash = interaction.options.getString('hash', true);
    const result = await getDeploy(hash);

    const deploy = result.deploy;
    if (!deploy) {
      await interaction.editReply({ content: '❌ Deploy not found' });
      return;
    }

    const header = deploy.header || {};
    const payment = deploy.payment || {};
    const session = deploy.session || {};

    const embed = new EmbedBuilder()
      .setTitle('📝 Casper Deploy Information')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Deploy Hash', value: `\`${truncate(hash, 40)}\``, inline: false },
        { name: 'Account', value: `\`${truncate(header.account, 30)}\``, inline: false },
        { name: 'Timestamp', value: formatTimestamp(header.timestamp), inline: true },
        { name: 'TTL', value: header.ttl?.toString() || 'N/A', inline: true },
        { name: 'Gas Price', value: header.gas_price?.toString() || 'N/A', inline: true },
        { name: 'Body Hash', value: `\`${truncate(header.body_hash, 30)}\``, inline: false },
        { name: 'Chain Name', value: header.chain_name || 'N/A', inline: true },
        { name: 'Dependencies', value: header.dependencies?.length?.toString() || '0', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    // Add execution results if available
    const executionResults = result.execution_results || [];
    if (executionResults.length > 0) {
      const firstResult = executionResults[0];
      embed.addFields(
        { name: 'Execution Result', value: firstResult.result?.Success ? '✅ Success' : '❌ Failed', inline: true },
        { name: 'Block Hash', value: `\`${truncate(firstResult.block_hash, 30)}\``, inline: false },
      );

      if (firstResult.result?.Success) {
        const success = firstResult.result.Success;
        embed.addFields(
          { name: 'Gas Consumed', value: success.cost || 'N/A', inline: true },
          { name: 'Transfer Count', value: success.effect?.transfers?.length?.toString() || '0', inline: true },
        );
      }
    }

    await interaction.editReply({ embeds: [embed] });
    logger.info('Deploy query successful');
  } catch (error) {
    logger.error('Deploy query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /validators command
 */
export async function handleValidatorsCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const result = await getAuctionInfo();
    const auctionState = result.auction_state || {};

    const embed = new EmbedBuilder()
      .setTitle('⚖️ Casper Network Validators')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Era ID', value: auctionState.era_id?.toString() || 'N/A', inline: true },
        { name: 'State Root Hash', value: `\`${truncate(auctionState.state_root_hash, 30)}\``, inline: false },
        { name: 'Total Validators', value: auctionState.bids?.length?.toString() || '0', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    // Show top 5 validators
    const bids = auctionState.bids || [];
    const activeValidators = bids.filter((b: any) => b.bid?.staked_amount);

    const topValidators = activeValidators
      .sort((a: any, b: any) => {
        const aStake = parseFloat(a.bid?.staked_amount || '0');
        const bStake = parseFloat(b.bid?.staked_amount || '0');
        return bStake - aStake;
      })
      .slice(0, 5);

    if (topValidators.length > 0) {
      const validatorList = topValidators.map((v: any, i: number) => {
        const stake = parseFloat(v.bid?.staked_amount || '0');
        const stakeCSPR = (stake / 1e9).toFixed(2);
        return `${i + 1}. Public Key: \`${truncate(v.public_key, 25)}\`\n   Staked: ${stakeCSPR} CSPR`;
      }).join('\n\n');

      embed.addFields({ name: 'Top 5 Validators by Stake', value: validatorList, inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
    logger.info('Validators query successful');
  } catch (error) {
    logger.error('Validators query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /era command
 */
export async function handleEraCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const result = await getEraInfo();
    const eraSummary = result.era_summary || {};

    const embed = new EmbedBuilder()
      .setTitle('📅 Casper Era Information')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Era ID', value: eraSummary.era_id?.toString() || 'N/A', inline: true },
        { name: 'Block Hash', value: `\`${truncate(eraSummary.block_hash, 30)}\``, inline: false },
        { name: 'State Root Hash', value: `\`${truncate(eraSummary.state_root_hash, 30)}\``, inline: false },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    await interaction.editReply({ embeds: [embed] });
    logger.info('Era query successful');
  } catch (error) {
    logger.error('Era query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /state-root-hash command
 */
export async function handleStateRootHashCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const stateRootHash = await getStateRootHash();

    const embed = new EmbedBuilder()
      .setTitle('🌳 Casper State Root Hash')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Latest State Root Hash', value: `\`${stateRootHash}\``, inline: false },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    await interaction.editReply({ embeds: [embed] });
    logger.info(`State root hash query successful: ${stateRootHash}`);
  } catch (error) {
    logger.error('State root hash query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /transfers command
 */
export async function handleTransfersCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const blockHash = interaction.options.getString('block-hash') || undefined;
    const result = await getBlockTransfers(blockHash);

    const transfers = result.transfers || [];

    const embed = new EmbedBuilder()
      .setTitle('💸 Casper Block Transfers')
      .setColor(0x0099FF)
      .addFields(
        { name: 'Block Hash', value: `\`${truncate(result.block_hash, 30)}\``, inline: false },
        { name: 'Total Transfers', value: transfers.length.toString(), inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    // Show up to 5 transfers
    if (transfers.length > 0) {
      const transferList = transfers.slice(0, 5).map((t: any, i: number) => {
        const amount = parseFloat(t.amount || '0') / 1e9;
        return `${i + 1}. From: \`${truncate(t.from, 20)}\`\n   To: \`${truncate(t.to, 20)}\`\n   Amount: ${amount.toFixed(4)} CSPR`;
      }).join('\n\n');

      embed.addFields({ name: 'Recent Transfers (Top 5)', value: transferList, inline: false });

      if (transfers.length > 5) {
        embed.addFields({ name: 'Note', value: `Showing 5 of ${transfers.length} transfers`, inline: false });
      }
    } else {
      embed.addFields({ name: 'Transfers', value: 'No transfers in this block', inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
    logger.info(`Transfers query successful: ${transfers.length} transfers`);
  } catch (error) {
    logger.error('Transfers query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

/**
 * Handle /chainspec command
 */
export async function handleChainspecCommand(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const result = await getChainspec();
    const chainspec = result.chainspec_bytes || {};

    const embed = new EmbedBuilder()
      .setTitle('📋 Casper Chainspec')
      .setColor(0x0099FF)
      .addFields(
        { name: 'API Version', value: result.api_version || 'N/A', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'Casper Discord Bot' });

    if (chainspec.chainspec_bytes) {
      // Try to parse if it's a string
      try {
        const parsed = JSON.parse(chainspec.chainspec_bytes);
        embed.addFields(
          { name: 'Network Name', value: parsed.network?.name || 'N/A', inline: true },
          { name: 'Chain ID', value: parsed.network?.chain_id?.toString() || 'N/A', inline: true },
        );
      } catch {
        embed.addFields(
          { name: 'Chainspec', value: 'Raw bytes available (not parseable as JSON)', inline: false },
        );
      }
    }

    await interaction.editReply({ embeds: [embed] });
    logger.info('Chainspec query successful');
  } catch (error) {
    logger.error('Chainspec query failed:', error);
    await interaction.editReply({
      content: `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
