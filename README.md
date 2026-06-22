# Casper Discord Bot

A powerful Discord Bot built with Skill-based architecture for **on-chain write operations**, and **comprehensive read queries** on the Casper network.

## ✨ Features

### 📖 Read Queries (读取查询)

#### 🌐 Network & Blockchain Metadata
- Query node status, network peers, and chainspec
- Query block information by hash or height
- Query deploy/transaction details
- Query block transfers and state root hash

#### 👤 Account, Balance & Gas
- Query CSPR balance for any wallet address (Casper public key, account hash, or Ethereum-style)
- Query ERC20 token balances
- Query account info (associated keys, thresholds, named keys)
- Query purse balance by URef (with full proof details)
- Real-time gas price queries and transaction fee estimation
- Query global state by key and path

#### 📋 Contract & Dictionary
- Query contract metadata (hash, version, entry points)
- List all callable entry points with argument types
- Query dictionary items by URef, by account, or by contract
- Query stored state items by key and path
- List all named keys of a contract

#### 🪙 CEP-18 / CEP-47 / CEP-78 Tokens
- CEP-18: total supply, balance of, allowance, token metadata (name/symbol/decimals)
- CEP-47/78: total supply, owner of, tokens of owner, metadata, approved spender
- CEP-78: max supply limit, batch owner query

#### ⚖️ Staking & Validators
- Query all active validators for current era
- Query single validator detail (stake, commission rate, delegators)
- Query delegation records for a delegator
- Query full auction state and validator set changes
- Query era summary with reward allocations

#### 🔧 General DApp
- Counter: query current count value
- AMM: pool reserves, LP balance, staking info
- Governance: all proposals, proposal detail, vote record
- RWA: asset record query
- DEX: open orders query

#### 🔔 Monitoring & Alerts
- Set up balance change alerts
- Gas price monitoring alerts
- Custom message alerts
- Manage alert lists (add, view, delete)

### ✏️ Write Operations (链上写入)

#### 💸 Native CSPR
- Transfer CSPR to another account
- Create temporary purses
- Add/remove associated keys (multi-sig setup)
- Set action thresholds for account security
- Bind named keys for contract/token references

#### 🪙 CEP-18 Fungible Tokens
- Mint / Burn tokens
- Transfer tokens between accounts
- Approve / Increase / Decrease allowance
- Transfer from (approved spender transfers tokens)

#### 🖼️ CEP-47 / CEP-78 NFT
- Mint single NFT / Batch mint copies
- Burn single / Batch burn NFTs
- Transfer / Batch transfer NFTs
- Approve NFT for spender
- Update NFT metadata (CEP-78)
- Set NFT contract admin (CEP-78)

#### ⚖️ Staking / Consensus
- Bond (self-stake to become validator)
- Delegate CSPR to a validator
- Unbond self-staked CSPR
- Undelegate from a validator
- Withdraw staking rewards
- Set validator commission rate

#### 📈 DeFi AMM / Liquidity
- Swap tokens on AMM DEX
- Add / Remove liquidity to pools
- Stake LP tokens for farming rewards
- Claim farming rewards
- Create / Cancel limit orders

#### 🔧 General DApp
- Counter increment / decrement
- Dictionary key-value put / remove
- Governance: Create proposal, cast vote, execute proposal
- RWA asset record saving
- Generic contract call by hash

### 📢 Bot Utilities
- Push notification messages to specified channels
- Support custom message content

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
│   ├── network/           # Network query skill (read-only RPC)
│   ├── read/              # Read-only query skills
│   │   ├── readHelper.ts      # Shared read query helpers
│   │   ├── account/           # Account & asset read queries
│   │   ├── contract/          # Contract & dictionary read queries
│   │   ├── token/             # CEP-18/47/78 token read queries
│   │   ├── staking/           # Staking & validator read queries
│   │   └── dapp/              # General DApp read queries (AMM, governance, RWA)
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

### `/state-root-hash` - Query State Root Hash
Get the latest state root hash.

### `/transfers` - Query Block Transfers
View transfers in a specific block.

**Parameters:**
- `block-hash` (optional): Block hash

### `/chainspec` - Query Chainspec
View chainspec configuration information.

---

## 👤 Account & Asset Read Commands

> These commands are read-only (no Gas, no signing key required)

### `/account-info` - Query Account Info
Query Casper account info including associated keys, action thresholds, named keys, and main purse.

**Parameters:**
- `public-key` (required): Account public key (68 hex chars) or account hash (64 hex chars)

**Example:**
```
/account-info public-key:020275edc1e5e65f4ee0b21453e797b3750f3ea68746675865e12a2e93173c1263e7
```

### `/purse-balance` - Query Purse Balance
Query CSPR balance of a specific purse URef.

**Parameters:**
- `purse-uref` (required): Purse URef (e.g., `uref-xxx-yyy`)

### `/purse-details` - Query Purse Balance Details
Query purse balance with full proof details.

**Parameters:**
- `purse-uref` (required): Purse URef
- `state-root-hash` (optional): State root hash (uses latest if empty)

### `/named-keys` - List Account Named Keys
List all named keys of an account.

**Parameters:**
- `public-key` (required): Account public key (68 hex chars)

### `/global-state` - Query Global State
Query global state by key and optional path.

**Parameters:**
- `key` (required): State key (e.g., `account-hash-xxx`, `hash-xxx`, `uref-xxx`)
- `path` (optional): Path segments (comma-separated, e.g., `field1,field2`)

---

## 📋 Contract Read Commands

> These commands are read-only (no Gas, no signing key required)

### `/contract-info` - Query Contract Metadata
Query Casper contract metadata including hash, version, entry points, and named keys.

**Parameters:**
- `contract-hash` (required): Contract hash (64 hex chars or `hash-xxx` format)

### `/entry-points` - List Contract Entry Points
List all callable entry points of a contract with their argument types.

**Parameters:**
- `contract-hash` (required): Contract hash

### `/contract-named-keys` - List Contract Named Keys
List all named keys of a contract.

**Parameters:**
- `contract-hash` (required): Contract hash

### `/dict-item` - Query Dictionary Item by URef
Query a dictionary item by seed URef and dictionary key.

**Parameters:**
- `uref` (required): Seed URef (e.g., `uref-xxx-yyy`)
- `dict-key` (required): Dictionary key to query

### `/dict-by-account` - Query Dictionary via Account
Query a dictionary item using an account's named key as the seed URef.

**Parameters:**
- `public-key` (required): Account public key (68 hex chars)
- `named-key` (required): Named key in the account referencing the dictionary URef
- `dict-key` (required): Dictionary key to query

### `/dict-by-contract` - Query Dictionary via Contract
Query a dictionary item using a contract's named key as the seed URef.

**Parameters:**
- `contract-hash` (required): Contract hash
- `named-key` (required): Named key in the contract referencing the dictionary URef
- `dict-key` (required): Dictionary key to query

### `/state-item` - Query State Item
Query a stored state item by key and optional path (legacy `state_get_item`).

**Parameters:**
- `key` (required): State key
- `path` (optional): Path segments (comma-separated)

---

## 🪙 Token Read Commands (CEP-18 / CEP-47 / CEP-78)

> These commands are read-only (no Gas, no signing key required)

### CEP-18 Fungible Token Queries

- `/token-total-supply` - Query CEP-18 token total supply
  - `contract-hash` (required): CEP-18 contract hash

- `/token-balance` - Query CEP-18 token balance of an account
  - `contract-hash` (required): CEP-18 contract hash
  - `owner` (required): Token owner public key (68 hex chars)

- `/token-allowance` - Query CEP-18 allowance (approved spender amount)
  - `contract-hash` (required): CEP-18 contract hash
  - `owner` (required): Token owner public key
  - `spender` (required): Approved spender public key

- `/token-meta` - Query CEP-18 token metadata (name, symbol, decimals)
  - `contract-hash` (required): CEP-18 contract hash

### CEP-47 / CEP-78 NFT Queries

- `/nft-total-supply` - Query NFT contract total supply
  - `contract-hash` (required): NFT contract hash

- `/nft-owner-of` - Query the owner of a specific NFT
  - `contract-hash` (required): NFT contract hash
  - `token-id` (required): NFT token ID

- `/nft-tokens-of` - Query all NFT token IDs owned by an account
  - `contract-hash` (required): NFT contract hash
  - `owner` (required): Owner public key (68 hex chars)

- `/nft-metadata` - Query NFT metadata (image, attributes, etc.)
  - `contract-hash` (required): NFT contract hash
  - `token-id` (required): NFT token ID

- `/nft-approved` - Query approved spender for an NFT
  - `contract-hash` (required): NFT contract hash
  - `token-id` (required): NFT token ID

### CEP-78 Advanced NFT Queries

- `/nft-max-supply` - Query NFT contract max supply limit
  - `contract-hash` (required): CEP-78 contract hash

- `/nft-batch-owners` - Query owners of multiple NFTs at once
  - `contract-hash` (required): CEP-78 contract hash
  - `token-ids` (required): Comma-separated token IDs (e.g., `1,2,3`)

---

## ⚖️ Staking & Validator Read Commands

> These commands are read-only (no Gas, no signing key required)

### `/era-validators` - Query Era Validators
Query all active validators for the current era.

**Parameters:**
- `block-hash` (optional): Block hash (uses latest if empty)

### `/validator-detail` - Query Validator Details
Query detailed information about a single validator (stake, commission rate, delegators).

**Parameters:**
- `public-key` (required): Validator public key (68 hex chars)

### `/delegation` - Query Delegation Info
Query delegation information for a delegator across all or a specific validator.

**Parameters:**
- `delegator` (required): Delegator public key (68 hex chars)
- `validator` (optional): Validator public key to filter by

### `/auction-info` - Query Full Auction State
Query full auction state including all bids and delegators.

**Parameters:**
- `block-hash` (optional): Block hash

### `/validator-changes` - Query Validator Changes
Query recent validator set changes.

### `/era-summary` - Query Era Summary
Query era summary including validator rewards and seigniorage allocations.

**Parameters:**
- `block-hash` (optional): Block hash

---

## 🔧 General DApp Read Commands

> These commands are read-only (no Gas, no signing key required)

### Counter

- `/counter-value` - Query the current value of a counter contract
  - `contract-hash` (required): Counter contract hash

### AMM / Liquidity

- `/amm-reserves` - Query AMM pool reserves (token balances and LP supply)
  - `contract-hash` (required): AMM pool contract hash

- `/amm-lp-balance` - Query user LP token balance in an AMM pool
  - `contract-hash` (required): AMM pool contract hash
  - `user` (required): User public key (68 hex chars)

- `/amm-stake-info` - Query user LP staking info (staked amount, pending rewards)
  - `contract-hash` (required): Staking contract hash
  - `user` (required): User public key (68 hex chars)

### Governance

- `/all-proposals` - Query all governance proposals
  - `contract-hash` (required): Governance contract hash

- `/proposal-detail` - Query details of a single governance proposal
  - `contract-hash` (required): Governance contract hash
  - `proposal-id` (required): Proposal ID

- `/vote-record` - Query a user vote record on a proposal
  - `contract-hash` (required): Governance contract hash
  - `proposal-id` (required): Proposal ID
  - `voter` (required): Voter public key (68 hex chars)

### RWA & DEX

- `/asset-record` - Query an RWA (Real World Asset) record on-chain
  - `contract-hash` (required): RWA contract hash
  - `asset-id` (required): Asset ID

- `/open-orders` - Query open orders for a user on a DEX
  - `contract-hash` (required): DEX contract hash
  - `user` (required): User public key (68 hex chars)

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
│   │   ├── read/           # Read-only query skills
│   │   │   ├── readHelper.ts   # Shared read query helpers
│   │   │   ├── account/        # Account & asset queries
│   │   │   ├── contract/       # Contract & dictionary queries
│   │   │   ├── token/          # CEP-18/47/78 token queries
│   │   │   ├── staking/        # Staking & validator queries
│   │   │   └── dapp/           # General DApp queries
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

3. **Read Queries**: 
   - Read operations are free (no Gas, no signing key required)
   - All read queries go through RPC `state_get_*`, `query_global_state`, `state_get_dictionary_item` etc.
   - Token/NFT queries read contract storage via named keys and dictionaries
   - Dictionary batch reads are limited to 10 items to avoid rate limits

4. **Data Storage**: 
   - Currently using in-memory storage for alerts
   - Production should use databases (e.g., MongoDB, PostgreSQL)

5. **Rate Limiting**: 
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
