import Sandbox from 'e2b'

console.log('Creating E2B sandbox with arXiv and DuckDuckGo MCP servers...');
const sandbox = await Sandbox.betaCreate({
    mcp: {
        duckduckgo: {},
        arxiv: {
            storagePath: '/'
        },
    },
    timeoutMs: 600_000, // 10 minutes until the sandbox is killed
});


const mcpUrl = sandbox.betaGetMcpUrl();
console.log(`Sandbox created with MCP URL: ${mcpUrl} and Auth token ${await sandbox.betaGetMcpToken()}`);