import Sandbox from 'e2b'
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

console.log('Creating E2B sandbox with arXiv and DuckDuckGo MCP servers...');
const sandbox = await Sandbox.betaCreate({
    mcp: {
        duckduckgo: {
        }
    },
    timeoutMs: 600_000,
});

// TODO: There is a race condition, will be fixed before release
await new Promise(resolve => setTimeout(resolve, 1000));

const client = new Client({
    name: 'streamable-e2b-gateway-client',
    version: '1.0.0'
});


const transport = new StreamableHTTPClientTransport(new URL(sandbox.betaGetMcpUrl()), {
     requestInit: {
        headers: {
            'Authorization': `Bearer ${await sandbox.betaGetMcpToken()}`
        }
     }
});

await client.connect(transport);

console.log('Connected to MCP server');

const tools = await client.listTools();
for (const tool of tools.tools) {
    console.log(tool.name);
}

console.log('Disconnecting from MCP server');
await client.close();