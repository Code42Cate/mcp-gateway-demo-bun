import Sandbox from 'e2b'

const sbx = await Sandbox.betaCreate({
    envs: {
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
    },
    mcp: {
        duckduckgo: {},
        arxiv: {
            storagePath: '/'
        },
    },
});

const mcpUrl = sbx.betaGetMcpUrl();
const mcpToken = await sbx.betaGetMcpToken();
console.log(`Sandbox created with MCP URL: ${mcpUrl}`);

// Add MCP server with authentication token
await sbx.commands.run(`claude mcp add --transport http e2b-mcp-gateway ${mcpUrl} --header "Authorization: Bearer ${mcpToken}"`, { timeoutMs: 0, onStdout: console.log, onStderr: console.log });

console.log('Starting research, this will take a bit...');
await sbx.commands.run(
    `echo 'Use arxiv to search for a new paper about large language models and summarize it. Then use duckduckgo to find information about the main authors. Finally, create a minimal index.html page (in /web directory) outlining the paper and authors' | claude -p --dangerously-skip-permissions`,
    { timeoutMs: 0, onStdout: console.log, onStderr: console.log }
)

await sbx.commands.run('python3 -m http.server 3000 -d web', { background: true, timeoutMs: 0, onStdout: console.log, onStderr: console.log });

const webserverUrl = sbx.getHost(3000);
console.log(`Visit the web page at http://${webserverUrl}/index.html`);
