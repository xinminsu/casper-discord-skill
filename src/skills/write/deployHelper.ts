import { EmbedBuilder } from 'discord.js';
import { parseExecutionResult, motesToCspr } from '../../services/casperTransactionService';

/**
 * Truncate a string for display
 */
function truncate(str: string, maxLen: number = 50): string {
  if (!str) return 'N/A';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

/**
 * Create a success embed for a deploy
 */
export function createDeploySuccessEmbed(
  title: string,
  deployHash: string,
  result: any,
  extraFields?: { name: string; value: string; inline?: boolean }[]
): EmbedBuilder {
  const parsed = parseExecutionResult(result);

  const embed = new EmbedBuilder()
    .setTitle(`✅ ${title}`)
    .setColor(0x00CC66)
    .addFields(
      { name: 'Deploy Hash', value: `\`${truncate(deployHash, 40)}\``, inline: false },
      { name: 'Status', value: parsed.success ? '✅ Success' : '❌ Failed', inline: true },
      { name: 'Gas Consumed', value: `${motesToCspr(parsed.cost)} CSPR`, inline: true },
    )
    .setTimestamp()
    .setFooter({ text: 'Casper Discord Bot - Write Operation' });

  if (parsed.errorMessage) {
    embed.addFields({ name: 'Error', value: truncate(parsed.errorMessage, 200), inline: false });
  }

  if (parsed.transfers && parsed.transfers.length > 0) {
    embed.addFields({
      name: 'Transfers',
      value: `${parsed.transfers.length} transfer(s) executed`,
      inline: true,
    });
  }

  if (extraFields) {
    for (const field of extraFields) {
      embed.addFields({
        name: field.name,
        value: field.value,
        inline: field.inline,
      });
    }
  }

  return embed;
}

/**
 * Create a pending embed (deploy submitted, waiting for confirmation)
 */
export function createDeployPendingEmbed(
  title: string,
  deployHash: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`⏳ ${title}`)
    .setColor(0xFFCC00)
    .addFields(
      { name: 'Deploy Hash', value: `\`${truncate(deployHash, 40)}\``, inline: false },
      { name: 'Status', value: 'Submitted - waiting for confirmation...', inline: false },
    )
    .setTimestamp()
    .setFooter({ text: 'Casper Discord Bot - Write Operation' });
}

/**
 * Check if signing key is configured and return error message if not
 */
export function checkSigningKey(): string | null {
  const pemKey = process.env.CASPER_SIGNING_KEY_PEM;
  const hexKey = process.env.CASPER_SIGNING_KEY_HEX;

  if (!pemKey && !hexKey) {
    return (
      '❌ No signing key configured.\n\n' +
      'To enable write operations, set one of the following in your `.env` file:\n' +
      '`CASPER_SIGNING_KEY_HEX=<your_private_key_hex>`\n' +
      '`CASPER_SIGNING_KEY_PEM=<your_private_key_pem>`\n\n' +
      'Generate a key pair with: `npx casper-client keygen -a ed25519`'
    );
  }

  return null;
}
