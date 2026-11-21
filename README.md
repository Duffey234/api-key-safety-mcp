# api-key-safety-mcp

An education-only, read-only [MCP](https://modelcontextprotocol.io) server for people who connect trading bots to crypto exchanges. It answers four kinds of question:

- which API key permissions a bot needs, and which to leave off;
- what common exchange API errors mean and how to fix them;
- the warning signs of an unsafe bot or service;
- Quantaira's announced Dec 1, 2026 launch waves.

**Takes no keys.** The server never asks for, accepts or stores API keys, secrets, passphrases, passwords or 2FA codes. It refuses any argument that looks like a key. It needs no auth and stores nothing.

**Independent, unofficial, not financial advice.** This project is not affiliated with Quantaira, Limitless or any exchange.

## Endpoint

Streamable HTTP (stateless JSON-RPC 2.0), no auth:

```
https://api-key-safety-mcp.agentgate.workers.dev/mcp
```

`GET /` returns a plain JSON description of the server.

## Client config

```json
{
  "mcpServers": {
    "api-key-safety": {
      "type": "http",
      "url": "https://api-key-safety-mcp.agentgate.workers.dev/mcp"
    }
  }
}
```

## Tools

| Tool | Arguments | Returns |
|---|---|---|
| `get_required_permissions` | `exchange` (binance, bybit, bitget, okx, coinzoom), `bot_type` (spot, futures, read_only, copy_trading) | Permissions to enable and to leave off (withdrawals, transfers), plus an IP-whitelist tip |
| `explain_error` | `exchange`, `code` (for example `-2015`, `10003`) | Likely cause, fix and a step-by-step page |
| `get_red_flags` | none | Warning signs of an unsafe bot or service |
| `get_safe_key_checklist` | none | Checklist for creating a safe, scoped key |
| `get_quantaira_launch_waves` | `usdt` (optional) | Announced launch waves and guide links |

## Try it

```bash
curl -s -X POST https://api-key-safety-mcp.agentgate.workers.dev/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"explain_error","arguments":{"exchange":"binance","code":"-2015"}}}'
```

## Data sources

The answers are summarized from the exchanges' own documentation, last checked 2026-11-20:

- Binance: [How to create API keys](https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072)
- Bybit: [How to create your API key](https://www.bybit.com/en/help-center/article/How-to-create-your-API-key)
- Bitget: [API trading guideline](https://www.bitget.com/academy/Bitget-API-Trading-Guideline)
- OKX: [API FAQ](https://www.okx.com/en-us/help/api-faq)
- CoinZoom: [Connect or disable API trading](https://support.coinzoom.com/en/articles/18492681-how-to-connect-or-disable-api-trading-on-coinzoom)

Exchange rules change. Always confirm with the exchange's current docs.

## Docs

Full checklist and guides: https://quantaira.app/api-key-safety-checker?utm_source=github&utm_medium=referral&utm_campaign=mcp

## Self-host

The server is a single Cloudflare Worker (`src/index.js`) with its data in `src/kb.json`.

```bash
npx wrangler dev      # local
npx wrangler deploy   # your own account
```

## License

MIT
