import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { SkillManager } from './core/SkillManager';
import { BalanceSkill } from './skills/balance';
import { GasSkill } from './skills/gas';
import { AlertSkill } from './skills/alert';
import { PushSkill } from './skills/push';
import { NetworkSkill } from './skills/network';
import {
  NativeWriteSkill,
  TokenWriteSkill,
  NftWriteSkill,
  StakingWriteSkill,
  DefiWriteSkill,
} from './skills/write';
import {
  AccountReadSkill,
  ContractReadSkill,
  TokenReadSkill,
  StakingReadSkill,
  DappReadSkill,
} from './skills/read';
import { logger } from './utils/logger';

dotenv.config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
  partials: [Partials.Channel],
});

// Create Skill Manager
const skillManager = new SkillManager();

// Bot ready event
client.once('ready', async () => {
  logger.info(`Casper Bot is online! Username: ${client.user?.tag}`);
  logger.info(`Currently serving ${client.guilds.cache.size} servers`);
  
  // Initialize Skill Manager
  await skillManager.initialize();
  
  // Register all skills
  const skills = [
    new BalanceSkill(),
    new GasSkill(),
    new AlertSkill(),
    new PushSkill(),
    new NetworkSkill(),
    // Write operation skills
    new NativeWriteSkill(),
    new TokenWriteSkill(),
    new NftWriteSkill(),
    new StakingWriteSkill(),
    new DefiWriteSkill(),
    // Read query skills
    new AccountReadSkill(),
    new ContractReadSkill(),
    new TokenReadSkill(),
    new StakingReadSkill(),
    new DappReadSkill(),
  ];
  
  for (const skill of skills) {
    await skillManager.registerSkill(skill);
  }
  
  logger.info(`Registered ${skillManager.getSkillCount()} skills`);
  
  // Register commands with Discord
  await registerCommands();
});

// Handle interaction events
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await skillManager.handleCommand(interaction);
  }
});

// Error handling
client.on('error', (error) => {
  logger.error('Discord client error:', error);
});

process.on('unhandledRejection', (error: any) => {
  logger.error('Unhandled Promise rejection:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await skillManager.shutdown();
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down...');
  await skillManager.shutdown();
  client.destroy();
  process.exit(0);
});

// Start the bot
const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  logger.error('Error: DISCORD_TOKEN not configured in .env file');
  process.exit(1);
}

/**
 * Register commands with Discord API
 */
async function registerCommands() {
  try {
    const { REST, Routes } = await import('discord.js');
    const rest = new REST({ version: '10' }).setToken(TOKEN!);
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    
    if (!CLIENT_ID) {
      throw new Error('DISCORD_CLIENT_ID not configured');
    }
    
    // Collect all commands from skills
    const allSkills = skillManager.getAllSkills();
    const commands = allSkills.flatMap(skill => skill.commands);
    
    logger.info(`Registering ${commands.length} commands...`);
    
    const data = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands.map(cmd => cmd.toJSON()) }
    );
    
    logger.info(`Successfully registered ${(data as any[]).length} commands`);
  } catch (error) {
    logger.error('Command registration failed:', error);
    throw error;
  }
}

// Login to Discord
client.login(TOKEN)
  .then(() => {
    logger.info('Casper Bot logged in successfully!');
  })
  .catch((error: any) => {
    logger.error('Login failed:', error);
    process.exit(1);
  });

export { client, skillManager };
