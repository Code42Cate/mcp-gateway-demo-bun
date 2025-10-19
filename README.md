# E2B MCP Demo

Examples demonstrating E2B sandboxes with the (beta) MCP Gateway.

```javascript
import Sandbox from 'e2b'

const sandbox = await Sandbox.betaCreate({
    mcp: {
        duckduckgo: {},
        arxiv: {
            // MCP servers + properties are fully typed!
            storagePath: '/'
        },
    },
});

const mcpUrl = sandbox.betaGetMcpUrl();
```

## Setup

```bash
bun install
export E2B_API_KEY="e2b_"  # Get from e2b.dev or ~/.e2b/config.json
```

## Examples

There are three examples in `/examples`

### `basic.ts`
Creates an E2B sandbox with arXiv and DuckDuckGo MCP servers and outputs the MCP URL.
```bash
bun examples/basic.ts
```

### `claude-code.ts`
Uses Claude Code CLI to research a paper, find author info, and create a web page hosted in the sandbox.
```bash
export ANTHROPIC_API_KEY="your-key"
bun examples/claude-code.ts
```


### `mcp-client.ts`
Connects to MCP servers using the SDK client and lists available tools.
```bash
bun examples/mcp-client.ts
```


### `research-agent.ts`
OpenAI agent that researches papers on arXiv and searches for authors on DuckDuckGo.
```bash
export OPENAI_API_KEY="your-key"
bun examples/research-agent.ts
```


## Python

The beta is also released for the Python SDK:

```
pip install e2b==2.3.3
```

```python
from e2b import AsyncSandbox

import asyncio


async def main():
    sandbox = await AsyncSandbox.beta_create(
        mcp={
            "duckduckgo": {},
            "arxiv": {
                "storagePath": "/",
            },
        },
    )

    mcp_url = sandbox.beta_get_mcp_url()


if __name__ == "__main__":
    asyncio.run(main())
```
