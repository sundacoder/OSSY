# OSSY | OpenServ Agent Interface

**OSSY** is an advanced, agentic AI interface designed to analyze cryptocurrency markets using the **OpenServ AI SDK** pattern. It leverages **Google Gemini 2.0 Flash** for high-speed reasoning and **DexScreener** for real-time market data to execute specific financial strategies (Aggressive, Growth, Inflation Fighting).

## 🏗 Architecture

The application is structured into two distinct components: the **Agent Definition** (Server-side) and the **Agentic Interface** (Client-side).

### 1. Agentic Interface (Frontend)
Hosted on Vercel, this is a React 19 application using ES Modules (no build step required).
- **AI Core**: Connects directly to Google Gemini 2.0 Flash via the client-side `geminiService`.
- **Tooling**: Implements `function calling` that mirrors the server-side agent capabilities.
- **Simulation**: In this web interface, the browser executes the `filterTokens` tool logic (fetching from DexScreener) to provide immediate feedback without needing a running OpenServ Node for the demo.
- **Visualization**: Renders complex market data using Recharts scatter plots.

### 2. OpenServ Agent (Server-side)
Located in `server/agent.ts`. This is the canonical implementation using the `@openserv-labs/sdk`.
- **Capability**: `filterTokens` - logic to fetch boosted tokens and filter by chain, volume, liquidity, and age.
- **Deployment**: This script is designed to be deployed as a standalone worker or microservice within the OpenServ Network.

## 🚀 Features

- **Strategy Selection**: 
  - 🚀 **Aggressive**: Targets <7 day old tokens, high volume/liquidity ratio.
  - 📈 **Growth**: Targets established movers ($5m-$50m mcap).
  - 🛡 **Inflation Fighting**: Targets high liquidity, >90 day old blue chips.
- **Real-time Data**: Direct integration with DexScreener Boosts and Pairs API.
- **Visual Analytics**: Logarithmic scatter plots to identify outliers.
- **Reasoning Logs**: View the AI's internal thought process and tool execution.

## 🛠 Configuration & Secrets

To run this application, you need to configure the following environment variables.

### Local Development / Vercel
For the frontend to work, you primarily need the Google Gemini API Key.

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | **Google Gemini API Key**. Used for the AI reasoning engine. | ✅ Yes |
| `API_BASE_URL` | OpenServ API Endpoint (Defaults to `https://api.openserv.ai/v1`) | ❌ Optional |
| `OPENSERV_API_KEY` | Key for authenticating with OpenServ (if connecting to live network) | ❌ Optional |

> **Note**: In Vercel, add `API_KEY` to your Project Settings > Environment Variables.

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**: Commit this codebase to a repository.
2. **Import to Vercel**:
   - Vercel will detect the `index.html` and treat it as a static site.
   - The included `vercel.json` ensures all routes rewrite to `index.html` (SPA behavior).
3. **Set Environment Variables**:
   - Add `API_KEY` (Your Google Gemini Key).
4. **Deploy**: Click deploy.

### Deploying the OpenServ Agent

To deploy the backend logic found in `server/agent.ts`:

1. Ensure you have a Node.js environment.
2. Install dependencies:
   ```bash
   npm install @openserv-labs/sdk axios zod dotenv
   ```
3. Run the agent:
   ```bash
   ts-node server/agent.ts
   ```

## 📂 Project Structure

```
├── index.html              # Entry point (Tailwind + Import Maps)
├── App.tsx                 # Main React Component
├── api.ts                  # OpenServ Axios Client
├── constants.ts            # Strategy definitions & System Prompts
├── types.ts                # TypeScript Interfaces
├── services/
│   ├── dexService.ts       # DexScreener API Logic (Client-side mirror)
│   └── geminiService.ts    # Google Gemini AI Integration
├── components/             # UI Components (Charts, Lists, Selectors)
└── server/
    └── agent.ts            # Canonical OpenServ Agent Implementation
```

## 🛡 License

MIT
