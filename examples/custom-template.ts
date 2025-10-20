import { Sandbox } from "../../E2B-sdk/packages/js-sdk/src/sandbox";
import { Template } from "../../E2B-sdk/packages/js-sdk/src/template";
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const alias = "browserbase-mcp-gateway";

export const template = Template()
    .fromTemplate("mcp-gateway")
    // this will cache the browserbase server docker image in the template, speeding up the listTools call during runtime
    .betaAddMcpServer("browserbase")

await Template.build(template, {
    alias,
    cpuCount: 8,
    memoryMB: 8192,
    onBuildLogs: console.log,
});

const sandbox = await Sandbox.betaCreate(alias, {
    mcp: {
        browserbase: {
            apiKey: process.env.BROWSERBASE_API_KEY!,
            geminiApiKey: process.env.GEMINI_API_KEY!,
            projectId: process.env.BROWSERBASE_PROJECT_ID!,
        }
    },
    timeoutMs: 600_000,
});

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