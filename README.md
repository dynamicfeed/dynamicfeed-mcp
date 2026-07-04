# dynamicfeed-mcp

Local **stdio MCP server** for [Dynamic Feed](https://dynamicfeed.ai): the fresh, live data AI models
don't have on their own: weather, software versions, CVEs **& actively-exploited vulns**, sanctions,
global disasters, earthquakes/wildfires/drought, satellites & space weather, flights, AI models
and more. **91 tools across 19 verticals**, all commercially-licensed & keyless.

This bridge speaks MCP over **stdio** to your local client and proxies to the remote Dynamic Feed endpoint
over ordinary outbound HTTPS, so it works through corporate firewalls/VPNs that block remote SSE streams,
and it always exposes whatever tools the live server has (nothing hard-coded to drift).

> Prefer a remote URL? You don't even need this package. Point any MCP client at
> `https://dynamicfeed.ai/mcp` (it auto-detects modern Streamable HTTP **and** legacy SSE). This runner is
> for clients that only accept a local `command`, or networks that block remote streaming.

## Use it

**Claude Desktop / Cursor / Windsurf**: add to your MCP config:

```json
{
  "mcpServers": {
    "dynamic-feed": {
      "command": "npx",
      "args": ["-y", "dynamicfeed-mcp"]
    }
  }
}
```

That's it, no API key required (the MCP tools are keyless). Restart your client and the Dynamic Feed tools
appear.

## Options (env vars)

| Variable | Default | Purpose |
|---|---|---|
| `DYNAMICFEED_MCP_URL` | `https://dynamicfeed.ai/mcp` | Override the upstream endpoint |
| `DYNAMICFEED_API_KEY` | _(none)_ | Optional `X-API-Key` (tools are keyless, so rarely needed) |

## Example tools

`sports_pulse` · `current_weather` · `exploited_vulnerabilities` · `software_version` ·
`global_disasters` · `earthquakes` · `wildfires` · `satellite_position` · `space_weather` ·
`security_advisories` · `air_quality` · `live_flights` · `china_data` … and more.

MIT · [dynamicfeed.ai](https://dynamicfeed.ai)
