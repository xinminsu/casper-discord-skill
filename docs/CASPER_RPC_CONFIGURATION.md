# Casper RPC Configuration Guide

## Problem

The default RPC URL `https://rpc.casper.network` returns a 404 error because this endpoint doesn't exist or is no longer available.

```
Error: server response 404 Not Found
requestUrl: "https://rpc.casper.network"
```

## Solution

Update your `.env` file with a working Casper RPC endpoint.

### Available Public RPC Endpoints

#### Option 1: CSPR.live (Recommended - Free)
```env
CASPER_RPC_URL=https://rpc.cspr.live
CASPER_CHAIN_ID=1
```

**Pros:**
- ✅ Free to use
- ✅ Reliable public endpoint
- ✅ No API key required

**Cons:**
- ⚠️ May have rate limits
- ⚠️ Shared resource

---

#### Option 2: Asgard Validator Node
```env
CASPER_RPC_URL=https://node.asgard.validators.cspr.live/rpc
CASPER_CHAIN_ID=1
```

**Pros:**
- ✅ Community-maintained
- ✅ Good uptime

**Cons:**
- ⚠️ May have usage limits

---

#### Option 3: BlastAPI (Testnet)
```env
CASPER_RPC_URL=https://casper-testnet.public.blastapi.io/rpc
CASPER_CHAIN_ID=1
```

**Note:** This is for testnet. Use for testing only.

---

#### Option 4: CSPR.cloud (Professional - Requires API Key)
```env
CASPER_RPC_URL=https://cspr.cloud/rpc?apiKey=YOUR_API_KEY
CASPER_CHAIN_ID=1
```

**Steps to get API key:**
1. Visit [https://cspr.cloud/](https://cspr.cloud/)
2. Sign up for an account
3. Generate your API key
4. Replace `YOUR_API_KEY` with your actual key

**Pros:**
- ✅ High performance
- ✅ Enterprise-grade reliability
- ✅ Professional support
- ✅ Higher rate limits

**Cons:**
- ❌ Requires registration
- ❌ May have costs for high usage

---

## Configuration Steps

### 1. Update .env File

Copy from `.env.example` and edit:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id

# Casper Blockchain Configuration
CASPER_RPC_URL=https://rpc.cspr.live
CASPER_CHAIN_ID=1

# Logging
LOG_LEVEL=info
ALERT_CHECK_INTERVAL=60
```

### 2. Restart the Bot

```bash
npm run dev
```

### 3. Test the Connection

In Discord, run:
```
/balance address:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

Expected output:
```
💰 Casper CSPR Balance
├─ Wallet Address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
├─ Balance: X.XXX CSPR
└─ Network: Casper
```

---

## Troubleshooting

### Still getting 404 errors?

1. **Verify the RPC URL is accessible:**
   ```bash
   curl -X POST https://rpc.cspr.live \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```

2. **Check if you need an API key:**
   - Some endpoints require authentication
   - Sign up at the provider's website

3. **Try alternative endpoints:**
   - Switch to a different RPC URL from the list above
   - Test each one to find the most reliable

4. **Check network connectivity:**
   ```bash
   ping rpc.cspr.live
   ```

### Getting rate limit errors?

1. **Switch to a different endpoint**
2. **Get an API key from CSPR.cloud**
3. **Reduce query frequency** (increase `ALERT_CHECK_INTERVAL`)

### Chain ID mismatch?

Make sure `CASPER_CHAIN_ID` matches the network:
- Mainnet: `1`
- Testnet: Check the specific testnet documentation

---

## Best Practices

### For Development
- Use free public endpoints
- Implement retry logic
- Add timeout handling

### For Production
- Use professional services (CSPR.cloud)
- Get API keys for higher limits
- Monitor endpoint health
- Have fallback endpoints configured

### Security
- Never commit `.env` files to version control
- Rotate API keys regularly
- Use environment variables for sensitive data

---

## Additional Resources

- [Casper Network Documentation](https://docs.casper.network/)
- [CSPR.cloud Platform](https://cspr.cloud/)
- [Casper Block Explorer](https://cspr.live/)
- [Casper Developer Portal](https://developer.cspr.live/)

---

## Quick Fix Summary

If you're seeing 404 errors, simply:

1. Open `.env` file
2. Change `CASPER_RPC_URL` to: `https://rpc.cspr.live`
3. Save the file
4. Restart the bot: `npm run dev`
5. Test again in Discord

That's it! 🎉
