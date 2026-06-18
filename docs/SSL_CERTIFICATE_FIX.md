# SSL/TLS Certificate Issue Fix

## Problem

When connecting to Casper RPC nodes, you may encounter this error:

```
❌ Query failed: RPC error: self-signed certificate; if the root CA is installed locally, try running Node.js with --use-system-ca
```

This happens because some Casper RPC endpoints use self-signed SSL certificates that Node.js doesn't trust by default.

## Solutions

### Solution 1: Use `--use-system-ca` Flag (Recommended for Production)

For compiled JavaScript (production):

```bash
node --use-system-ca dist/index.js
```

This tells Node.js to use the system's certificate store, which includes commonly trusted CAs.

**Updated in package.json:**
```json
{
  "scripts": {
    "start": "node --use-system-ca dist/index.js"
  }
}
```

### Solution 2: Disable TLS Verification (Development Only)

For development with ts-node, set the environment variable:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```

**Updated in package.json:**
```json
{
  "scripts": {
    "dev": "cross-env NODE_TLS_REJECT_UNAUTHORIZED=0 ts-node src/index.ts"
  }
}
```

⚠️ **Warning**: This disables SSL certificate verification and should ONLY be used in development environments.

### Solution 3: Use Alternative RPC Endpoints

Some Casper RPC providers offer properly signed certificates:

```env
# Try these alternatives in your .env file
CASPER_RPC_URL=https://cspr.cloud/rpc
# or
CASPER_RPC_URL=https://rpc.cspr.live
```

### Solution 4: Install Root CA Certificates

If you're on Windows:

1. Download the Casper RPC certificate
2. Install it to your system's trusted root certificate store
3. Restart your terminal/IDE

On Linux:
```bash
sudo update-ca-certificates
```

On macOS:
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certificate.crt
```

## Testing

After applying the fix, test the balance command:

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

## Security Notes

- ✅ **Production**: Use `--use-system-ca` flag (secure)
- ⚠️ **Development**: `NODE_TLS_REJECT_UNAUTHORIZED=0` is acceptable but not recommended for production
- ❌ **Never**: Commit `.env` files with sensitive data
- 🔒 **Best Practice**: Use RPC providers with valid SSL certificates

## Troubleshooting

### Still getting certificate errors?

1. Check your Node.js version (should be >= 18.x)
2. Verify the RPC URL is accessible:
   ```bash
   curl https://rpc.casper.network
   ```
3. Try alternative RPC endpoints
4. Check firewall/proxy settings

### Bot starts but queries fail?

1. Verify `.env` configuration
2. Check RPC endpoint status
3. Review logs in `logs/combined.log`
4. Test with a different wallet address

## References

- [Node.js TLS Documentation](https://nodejs.org/api/tls.html)
- [Casper Network RPC Documentation](https://docs.casper.network/)
- [ethers.js Provider Configuration](https://docs.ethers.org/v6/api/providers/)
