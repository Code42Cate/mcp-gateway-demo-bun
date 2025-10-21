import Sandbox from 'e2b'
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';

const sandbox = await Sandbox.betaCreate({
    mcp: {
        browserbase: {
            apiKey: process.env.BROWSERBASE_API_KEY!,
            geminiApiKey: process.env.GEMINI_API_KEY!,
            projectId: process.env.BROWSERBASE_PROJECT_ID!,
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
    'Make a screenshot of the e2b.dev landing page and tell me what it is about.',
    {
        stream: true,
    }
);

result
    .toTextStream({ compatibleWithNodeStreams: true })
    .pipe(process.stdout)

await result.completed;
await mcpServer.close();