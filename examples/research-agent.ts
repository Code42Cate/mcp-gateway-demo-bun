import Sandbox from 'e2b'
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';

console.log('Creating E2B sandbox with arXiv and DuckDuckGo MCP servers...');
const sandbox = await Sandbox.betaCreate({
    mcp: {
        duckduckgo: {},
        arxiv: {
            storagePath: '/'
        },
    },
});


const mcpUrl = sandbox.betaGetMcpUrl();
console.log(`Sandbox created with MCP URL: ${mcpUrl}`);

const mcpServer = new MCPServerStreamableHttp({
    url: mcpUrl,
    name: 'E2B MCP Gateway',
    requestInit: {
        headers: {
            'Authorization': `Bearer ${await sandbox.betaGetMcpToken()}`
        }
    },
    toolFilter: async (_, tool) => {
        console.log(`Calling ${tool.name}`)
        return true
    },
});

const agent = new Agent({
    name: 'Research Assistant',
    model: 'gpt-5-nano-2025-08-07',
    mcpServers: [mcpServer],
});

await mcpServer.connect();
console.log('Agent is starting research...');

const result = await run(
    agent,
    'Find an interesting recent paper about large language models on arXiv, then search for the main author on DuckDuckGo to learn more about them.',
    {
        stream: true,
    }
);

result
    .toTextStream({ compatibleWithNodeStreams: true })
    .pipe(process.stdout)

await result.completed;
await mcpServer.close();