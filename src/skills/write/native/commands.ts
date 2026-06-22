import { SlashCommandBuilder } from 'discord.js';

// ============================================================
// Native CSPR Operations Commands
// ============================================================

export const transferCommand = new SlashCommandBuilder()
  .setName('transfer')
  .setDescription('Transfer CSPR to another account')
  .addStringOption(option =>
    option.setName('recipient')
      .setDescription('Recipient public key (68 hex chars, starts with 02 or 03)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('amount')
      .setDescription('Amount of CSPR to transfer (e.g., 1.5)')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('transfer-id')
      .setDescription('Optional transfer ID for tracking (default: random)')
      .setRequired(false)
  )
  .addStringOption(option =>
    option.setName('source-purse')
      .setDescription('Optional source purse URef (default: main purse)')
      .setRequired(false)
  );

export const createPurseCommand = new SlashCommandBuilder()
  .setName('create-purse')
  .setDescription('Create a new temporary purse for collecting/distributing funds')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Optional name for the purse')
      .setRequired(false)
  );

export const addKeyCommand = new SlashCommandBuilder()
  .setName('add-key')
  .setDescription('Add an associated key to your account (multi-sig setup)')
  .addStringOption(option =>
    option.setName('public-key')
      .setDescription('Public key to add (68 hex chars)')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('weight')
      .setDescription('Weight of the key (1-255)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(255)
  );

export const removeKeyCommand = new SlashCommandBuilder()
  .setName('remove-key')
  .setDescription('Remove an associated key from your account')
  .addStringOption(option =>
    option.setName('public-key')
      .setDescription('Public key to remove (68 hex chars)')
      .setRequired(true)
  );

export const setThresholdCommand = new SlashCommandBuilder()
  .setName('set-threshold')
  .setDescription('Set the action threshold for your account (multi-sig security)')
  .addStringOption(option =>
    option.setName('action-type')
      .setDescription('Action type to set threshold for')
      .setRequired(true)
      .addChoices(
        { name: 'Deployment', value: 'deployment' },
        { name: 'Key Management', value: 'key_management' },
      )
  )
  .addIntegerOption(option =>
    option.setName('threshold')
      .setDescription('New threshold value (1-255)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(255)
  );

export const putNamedKeyCommand = new SlashCommandBuilder()
  .setName('put-named-key')
  .setDescription('Bind a named key to your account for quick contract/token references')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Name for the key (e.g., "my_token_contract")')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('key-value')
      .setDescription('Key value (hash hex string)')
      .setRequired(true)
  );
