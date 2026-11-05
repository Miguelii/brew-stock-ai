import { MCP_HANDLER } from '@/_bff/modules/mcp/mcp.handler'

// Yahoo, Finnhub and the stock_data fallback run in sequence for one ticker
export const maxDuration = 60

export { MCP_HANDLER as GET, MCP_HANDLER as POST }
