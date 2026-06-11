# Dynamic Feed MCP server (stdio bridge to https://dynamicfeed.ai/mcp)
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.js ./
ENTRYPOINT ["node", "index.js"]
