# Casper Discord Bot

A powerful Discord Bot built with Skill-based architecture for blockchain queries, transaction execution, gas estimation, event notifications, and **on-chain write operations** on the Casper network.

## ✨ Features

### 📊 Balance Query
- Query CSPR balance for any wallet address
- Query ERC20 token balances
- Real-time blockchain data from Casper network

### ⛽ Gas Related
- Real-time gas price queries
- Estimate transaction gas fees
- Display detailed gas parameters (Gas Limit, Max Fee, Priority Fee)

### 🔔 Event Notifications
- Set up balance change alerts
- Gas price monitoring alerts
- Custom message alerts
- Manage alert lists (add, view, delete)

### 📢 Message Push
- Push notification messages to specified channels
- Support custom message content

### 🌐 Network Query (Read-Only)
- Query node status and network peers
- Query block information by hash or height
- Query deploy/transaction details
- View validators and auction info
- View era information and state root hash
- Query block transfers and chainspec

### 💸 Native CSPR Write Operations
- Transfer CSPR to another account
- Create temporary purses
- Add/remove associated keys (multi-sig setup)
- Set action thresholds for account security
- Bind named keys for contract/token references

### 🪙 CEP-18 Fungible Token Operations
- Mint / Burn tokens
- Transfer tokens between accounts
- Approve / Increase / Decrease allowance
- Transfer from (approved spender transfers tokens)

### 🖼️ CEP-47 / CEP-78 NFT Operations
- Mint single NFT / Batch mint copies
- Burn single / Batch burn NFTs
- Transfer / Batch transfer NFTs
- Approve NFT for spender
- Update NFT metadata (CEP-78)
- Set NFT contract admin (CEP-78)

### ⚖️ Staking / Consensus Operations
- Bond (self-stake to become validator)
- Delegate CSPR to a validator
- Unbond self-staked CSPR
- Undelegate from a validator
- Withdraw staking rewards
- Set validator commission rate

### 📈 DeFi AMM / Liquidity Operations
- Swap tokens on AMM DEX
- Add / Remove liquidity to pools
- Stake LP tokens for farming rewards
- Claim farming rewards
- Create / Cancel limit orders

### 🔧 General DApp Operations
- Counter increment / decrement
- Dictionary key-value put / remove
- Governance: Create proposal, cast vote, execute proposal
- RWA asset record saving
- Generic contract call by hash

## 🏗️ Architecture

This project uses a modern **Skill-based architecture** where each feature is implemented as an independent skill module:

```
src/
├── core/                  # Core framework
│   └── SkillManager.ts    # Manages skill lifecycle
├── skills/                # Modular skills
│   ├── balance/           # Balance query skill
│   ├── gas/               # Gas price & estimation skill
│   ├── alert/             # Event monitoring skill
│   ├── push/              # Message push skill
│   ├── network/          # Network query skill (read-only RPC)
│   └── write/             # On-chain write operation skills
│       ├── deployHelper.ts   # Shared deploy result helpers
│       ├── native/           # Native CSPR operations (transfer, keys, purses)
│       ├── token/            # CEP-18 fungible token operations
│       ├── nft/              # CEP-47/CEP-78 NFT operations
│       ├── staking/          # Staking & consensus operations
│       └── defi/              # DeFi AMM & general DApp operations
├── services/              # Shared services
│   ├── web3Service.ts     # Blockchain interaction layer
│   ├── casperRpcService.ts     # Casper RPC read-only API
│   └── casperTransactionService.ts  # Casper deploy sign & submit
└── utils/                 # Utilities
    └── logger.ts          # Logging system
```

**Benefits:**
- ✅ **Modular**: Each skill is self-contained and independent
- ✅ **Extensible**: Easy to add new features without modifying existing code
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Testable**: Isolated modules for easy testing

## 🚀 Quick Start

### Prerequisites

1. **Clone the project**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file and fill in your configuration:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here

# Casper Blockchain Configuration
# Testnet (for testing)
CASPER_RPC_URL=https://node.testnet.casper.network/rpc
CASPER_CHAIN_ID=1

# Mainnet (for production)
# CASPER_RPC_URL=https://rpc.cspr.live
# CASPER_CHAIN_ID=1

# Signing Key for Write Operations (required for transfer, mint, stake, etc.)
# Option 1: Hex format private key (without 0x prefix)
# CASPER_SIGNING_KEY_HEX=your_private_key_hex_here
# Option 2: PEM format private key
# CASPER_SIGNING_KEY_PEM=-----BEGIN PRIVATE KEY-----
# ...your_pem_key...
# -----END PRIVATE KEY-----
# Key algorithm: ed25519 (default) or secp256k1
# CASPER_KEY_ALGORITHM=ed25519

# Logging
LOG_LEVEL=info
```

> ⚠️ **Write Operations Security**: To use any on-chain write command (transfer, mint, stake, etc.), you must configure a signing key. Generate a key pair with: `npx casper-client keygen -a ed25519`

4. **Get Discord Bot Token**

5. **Run the project**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## 📖 Command Usage Guide

### `/balance` - Query Balance

Query wallet CSPR or token balance on Casper network.

**Parameters:**
- `address` (required): Wallet address
- `token` (optional): ERC20 token contract address

**Example:**
```
/balance address:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
/balance address:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb token:0xdAC17F958D2ee523a2206206994597C13D831ec7
```

### `/gas-price` - Query Gas Price

View current Casper network gas price information.

**Example:**
```
/gas-price
```

### `/gas-estimate` - Estimate Gas Fees

Estimate gas fees required for a transaction on Casper.

**Parameters:**
- `from` (required): Sender address
- `to` (required): Receiver address
- `value` (optional): Transfer amount (CSPR), default 0

**Example:**
```
/gas-estimate from:0xSender... to:0xReceiver... value:0.1
```

### `/alert` - Manage Alerts

Set up and manage blockchain event notifications.

**Subcommands:**

#### `/alert add` - Add Alert
- `type` (required): Alert type (balance/gas/custom)
- `address` (optional): Monitored wallet address
- `threshold` (optional): Trigger threshold
- `message` (optional): Custom message

**Example:**
```
/alert add type:balance address:0x742d... threshold:1.5
/alert add type:custom message:"Daily Gas Price Report"
```

#### `/alert list` - List All Alerts

**Example:**
```
/alert list
```

#### `/alert remove` - Remove Alert
- `id` (required): Alert ID

**Example:**
```
/alert remove id:alert_1234567890_abc123
```

### `/push` - Push Message

Push notification messages to channels.

**Parameters:**
- `message` (required): Message content to push
- `channel` (optional): Target channel, default current channel

**Example:**
```
/push message:"Important Notice: System maintenance scheduled tonight"
```

---

## 🌐 Network Query Commands (Read-Only)

### `/node-status` - Query Node Status
View Casper node status including chain name, API version, last block info.

### `/peers` - Query Network Peers
List network peers connected to the RPC node.

### `/block` - Query Block
Query block information by hash or height.

**Parameters:**
- `hash` (optional): Block hash
- `height` (optional): Block height

**Example:**
```
/block height:12345
/block hash:0xabc123...
```

### `/deploy` - Query Deploy
Query deploy/transaction information by hash.

**Parameters:**
- `hash` (required): Deploy hash

### `/validators` - Query Validators
View top validators by staked amount.

### `/era` - Query Era Info
View current era information.

### `/state-root-hash` - Query State Root Hash
Get the latest state root hash.

### `/transfers` - Query Block Transfers
View transfers in a specific block.

**Parameters:**
- `block-hash` (optional): Block hash

### `/chainspec` - Query Chainspec
View chainspec configuration information.

---

## 💸 Native CSPR Write Commands

> ⚠️ Requires signing key configuration in `.env`

### `/transfer` - Transfer CSPR
Transfer CSPR tokens to another account.

**Parameters:**
- `recipient` (required): Recipient public key (68 hex chars)
- `amount` (required): Amount in CSPR (e.g., 1.5)
- `transfer-id` (optional): Transfer ID for tracking
- `source-purse` (optional): Source purse URef

**Example:**
```
/transfer recipient:020275edc1e5e65f4ee0b21453e797b3750f3ea68746675865e12a2e93173c1263e7 amount:10.5
```

### `/create-purse` - Create Purse
Create a new temporary purse for collecting/distributing funds.

**Parameters:**
- `name` (optional): Name for the purse

### `/add-key` - Add Associated Key
Add an associated key to your account for multi-sig setup.

**Parameters:**
- `public-key` (required): Public key to add (68 hex chars)
- `weight` (required): Key weight (1-255)

### `/remove-key` - Remove Associated Key
Remove an associated key from your account.

**Parameters:**
- `public-key` (required): Public key to remove (68 hex chars)

### `/set-threshold` - Set Action Threshold
Set the action threshold for deployment or key management.

**Parameters:**
- `action-type` (required): `deployment` or `key_management`
- `threshold` (required): New threshold value (1-255)

### `/put-named-key` - Put Named Key
Bind a named key to your account for quick contract/token references.

**Parameters:**
- `name` (required): Name for the key
- `key-value` (required): Key value (hash hex string)

---

## 🪙 CEP-18 Token Write Commands

> ⚠️ Requires signing key configuration in `.env`

### `/mint` - Mint Tokens
Mint CEP-18 fungible tokens to an account.

**Parameters:**
- `contract-hash` (required): CEP-18 contract hash
- `owner` (required): Token owner public key (68 hex chars)
- `amount` (required): Amount to mint
- `decimals` (optional): Token decimals (default: 9)

### `/burn` - Burn Tokens
Burn CEP-18 fungible tokens from an account.

### `/token-transfer` - Transfer Tokens
Transfer CEP-18 tokens to another account.

**Parameters:**
- `contract-hash` (required): CEP-18 contract hash
- `recipient` (required): Recipient public key (68 hex chars)
- `amount` (required): Amount to transfer
- `decimals` (optional): Token decimals (default: 9)

### `/approve` - Approve Spender
Approve a spender for CEP-18 tokens.

### `/increase-allowance` - Increase Allowance
Increase spending allowance for a spender.

### `/decrease-allowance` - Decrease Allowance
Decrease spending allowance for a spender.

### `/transfer-from` - Transfer From
Transfer CEP-18 tokens on behalf of an approved owner.

---

## 🖼️ NFT Write Commands (CEP-47 / CEP-78)

> ⚠️ Requires signing key configuration in `.env`

### `/nft-mint` - Mint Single NFT
Mint a single NFT (CEP-47 standard).

**Parameters:**
- `contract-hash` (required): NFT contract hash
- `recipient` (required): Recipient public key (68 hex chars)
- `token-id` (required): Unique token ID
- `metadata-key` (optional): Metadata key
- `metadata-value` (optional): Metadata value

### `/nft-mint-copies` - Batch Mint NFTs
Mint multiple NFT copies (CEP-47 batch mint).

### `/nft-burn` - Burn NFT
Burn an NFT (CEP-47 standard).

### `/nft-transfer` - Transfer NFT
Transfer an NFT to another account.

### `/nft-approve` - Approve NFT
Approve a spender for an NFT.

### `/nft-transfer-from` - Transfer NFT From
Transfer NFT from approved owner.

### `/nft-set-metadata` - Set NFT Metadata
Update NFT metadata (CEP-78 advanced).

### `/nft-batch-transfer` - Batch Transfer NFTs
Batch transfer multiple NFTs (CEP-78).

**Parameters:**
- `contract-hash` (required): CEP-78 contract hash
- `recipient` (required): Recipient public key
- `token-ids` (required): Comma-separated token IDs (e.g., "1,2,3")

### `/nft-batch-burn` - Batch Burn NFTs
Batch burn multiple NFTs (CEP-78).

### `/nft-set-admin` - Set NFT Admin
Set NFT contract admin (CEP-78).

---

## ⚖️ Staking Write Commands

> ⚠️ Requires signing key configuration in `.env`

### `/bond` - Bond (Self-Stake)
Bond CSPR to become a validator.

**Parameters:**
- `amount` (required): Amount of CSPR to bond
- `delegator-rate` (optional): Delegator rate (0-100)

### `/delegate` - Delegate
Delegate CSPR to a validator.

**Parameters:**
- `validator` (required): Validator public key (68 hex chars)
- `amount` (required): Amount of CSPR to delegate

### `/unbond` - Unbond
Unbond your self-staked CSPR.

### `/undelegate` - Undelegate
Withdraw delegation from a validator.

### `/withdraw-rewards` - Withdraw Rewards
Withdraw staking rewards to your purse.

### `/set-commission-rate` - Set Commission Rate
Set validator commission rate (for validators only).

---

## 📈 DeFi & DApp Write Commands

> ⚠️ Requires signing key configuration in `.env`

### DeFi AMM Commands

- `/swap` - Swap tokens on an AMM DEX
- `/add-liquidity` - Add liquidity to an AMM pool
- `/remove-liquidity` - Remove liquidity from an AMM pool
- `/stake-lp` - Stake LP tokens for farming rewards
- `/claim-reward` - Claim farming rewards
- `/create-order` - Create a limit order on a DEX
- `/cancel-order` - Cancel a DEX limit order

**`/swap` Example:**
```
/swap contract-hash:0xabc... token-in:0xdef... token-out:0xghi... amount-in:100 min-amount-out:95
```

### General DApp Commands

- `/counter-increment` - Increment a counter contract
- `/counter-decrement` - Decrement a counter contract
- `/dict-put` - Write a key-value pair to a dictionary
- `/dict-remove` - Remove a key from a dictionary
- `/create-proposal` - Create a governance proposal
- `/cast-vote` - Cast a vote on a governance proposal
- `/execute-proposal` - Execute a passed governance proposal
- `/save-asset` - Save an RWA asset record to the blockchain
- `/call-contract` - Generic contract call by hash

**`/call-contract` Example:**
```
/call-contract contract-hash:0xabc... entry-point:mint args-json:{"recipient":"020275..."}
```

## 🏗️ Project Structure

```
casper-discord-skill/
├── src/
│   ├── core/               # Core framework
│   │   └── SkillManager.ts # Skill lifecycle manager
│   ├── skills/             # Modular skills
│   │   ├── types.ts        # Skill interfaces
│   │   ├── BaseSkill.ts    # Base skill class
│   │   ├── SkillRegistry.ts# Skill registry
│   │   ├── balance/        # Balance query skill
│   │   ├── gas/            # Gas estimation skill
│   │   ├── alert/          # Event alert skill
│   │   ├── push/           # Message push skill
│   │   ├── network/        # Network query skill (read-only RPC)
│   │   └── write/          # On-chain write operation skills
│   │       ├── deployHelper.ts  # Shared deploy helpers
│   │       ├── native/     # Native CSPR operations
│   │       ├── token/      # CEP-18 token operations
│   │       ├── nft/        # CEP-47/CEP-78 NFT operations
│   │       ├── staking/    # Staking & consensus operations
│   │       └── defi/       # DeFi AMM & DApp operations
│   ├── services/           # Shared services
│   │   ├── web3Service.ts            # Blockchain service layer
│   │   ├── casperRpcService.ts       # Casper RPC read-only API
│   │   └── casperTransactionService.ts  # Deploy sign & submit service
│   ├── utils/              # Utilities
│   │   └── logger.ts       # Logging utility
│   └── index.ts            # Entry point
├── docs/                   # Documentation
│   └── SKILL_DEVELOPMENT.md
├── logs/                   # Log files
├── .env.example            # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript (ES2020)
- **Discord Framework**: discord.js v14
- **Blockchain SDK**: casper-js-sdk v5 (Deploy construction, signing, CLValue types)
- **Web3 Library**: ethers.js v6 (unit conversion, byte handling)
- **HTTP Client**: axios (RPC calls)
- **Logging**: winston
- **Task Scheduling**: node-cron

## ⚙️ Configuration

### Discord Configuration

- `DISCORD_TOKEN`: Discord Bot authentication token
- `DISCORD_CLIENT_ID`: Discord application Client ID

### Blockchain Configuration

- `CASPER_RPC_URL`: Casper network RPC node
- `CASPER_CHAIN_ID`: Casper chain ID (default 1)

### Signing Key Configuration (for Write Operations)

- `CASPER_SIGNING_KEY_HEX`: Private key in hex format (for signing deploys)
- `CASPER_SIGNING_KEY_PEM`: Private key in PEM format (alternative to hex)
- `CASPER_KEY_ALGORITHM`: Key algorithm, `ed25519` (default) or `secp256k1`

> Generate a key pair with: `npx casper-client keygen -a ed25519`

### Other Configuration

- `LOG_LEVEL`: Log level (debug/info/warn/error)
- `ALERT_CHECK_INTERVAL`: Alert check interval (seconds)

## 📝 Development Guide

### Adding New Skills

Creating a new skill is simple:

1. Create skill directory: `src/skills/my-skill/`
2. Extend BaseSkill class
3. Define commands and handlers
4. Register in `src/index.ts`

See [SKILL_DEVELOPMENT.md](docs/SKILL_DEVELOPMENT.md) for detailed guide.

### Viewing Logs

Log files are saved in `logs/` directory:
- `logs/error.log`: Error logs
- `logs/combined.log`: All logs

## ⚠️ Important Notes

1. **Security**: 
   - Never commit `.env` file to version control
   - Do not hardcode private keys or sensitive information in code
   - Use key management services in production

2. **Transaction Execution**: 
   - Write operations require a configured signing key in `.env`
   - All deploys are signed locally and submitted via RPC
   - Deploy confirmation is polled automatically (default timeout: 120s)
   - Gas price is fixed at 1 mote per gas unit on Casper
   - Default gas payment: 10 CSPR (adjustable in code)
   - Contract installation uses 50 CSPR gas payment

3. **Data Storage**: 
   - Currently using in-memory storage for alerts
   - Production should use databases (e.g., MongoDB, PostgreSQL)

4. **Rate Limiting**: 
   - Discord API has rate limits, control request frequency
   - RPC nodes may also have request limits

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License

## 📞 Contact

For questions or suggestions, please submit an Issue.

---

**Casper Discord Bot** - Making blockchain interactions simpler 🚀
