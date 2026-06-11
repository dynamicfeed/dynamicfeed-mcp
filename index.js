#!/usr/bin/env node
/**
 * Dynamic Feed — local stdio MCP server.
 *
 * A thin bridge: speaks MCP over stdio to your local client (Claude Desktop, Cursor, Windsurf, …)
 * and proxies every request to the remote Dynamic Feed MCP endpoint over Streamable HTTP. Because the
 * upstream hop is ordinary outbound HTTPS request/response (not a long-lived SSE stream), this works
 * through corporate firewalls / VPNs that block remote SSE — and it always exposes whatever tools the
 * live server has (no hard-coded list to drift).
 *
 *   Claude Desktop / Cursor config:
 *   { "mcpServers": { "dynamic-feed": { "command": "npx", "args": ["-y", "dynamicfeed-mcp"] } } }
 *
 * Env:
 *   DYNAMICFEED_MCP_URL   override the upstream endpoint (default https://dynamicfeed.ai/mcp)
 *   DYNAMICFEED_API_KEY   optional; sent as X-API-Key (the MCP tools are keyless, so usually unneeded)
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const REMOTE = process.env.DYNAMICFEED_MCP_URL || "https://dynamicfeed.ai/mcp";
const API_KEY = process.env.DYNAMICFEED_API_KEY || "";

function log(msg) {
  process.stderr.write(`[dynamicfeed] ${msg}\n`);
}

async function main() {
  // 1) Connect to the live Dynamic Feed MCP (Streamable HTTP — firewall-friendly outbound HTTPS).
  const requestInit = API_KEY ? { headers: { "X-API-Key": API_KEY } } : undefined;
  const upstream = new Client(
    { name: "dynamicfeed-stdio", version: "1.0.0" },
    { capabilities: {} }
  );
  await upstream.connect(new StreamableHTTPClientTransport(new URL(REMOTE), { requestInit }));
  log(`connected upstream → ${REMOTE}`);

  // 2) Re-expose those tools to the local client over stdio.
  const server = new Server(
    { name: "dynamic-feed", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const { tools } = await upstream.listTools();
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    return await upstream.callTool(req.params);
  });

  await server.connect(new StdioServerTransport());
  log("stdio bridge ready — Dynamic Feed tools available to your client");
}

main().catch((err) => {
  log(`fatal: ${err?.stack || err}`);
  process.exit(1);
});
