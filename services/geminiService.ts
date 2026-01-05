import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { filterTokens } from "./dexService";
import { FilterArgs, FilteredTokenDetails } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const filterTokensTool: FunctionDeclaration = {
  name: "filterTokens",
  description: "Filter cryptocurrency tokens from DexScreener based on financial criteria like volume, liquidity, market cap, and age.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      chain: {
        type: Type.STRING,
        description: 'Filter tokens by blockchain (e.g., "solana", "ethereum", "bsc")',
      },
      minVolume24h: {
        type: Type.NUMBER,
        description: 'Minimum 24-hour trading volume in USD',
      },
      minLiquidity: {
        type: Type.NUMBER,
        description: 'Minimum liquidity in USD',
      },
      minMarketCap: {
        type: Type.NUMBER,
        description: 'Minimum market capitalization in USD',
      },
      maxMarketCap: {
        type: Type.NUMBER,
        description: 'Maximum market capitalization in USD',
      },
      maxAgeDays: {
        type: Type.NUMBER,
        description: 'Maximum age of the token pair in days',
      },
    },
  },
};

export const runAgent = async (
  prompt: string, 
  onLog: (msg: string) => void
): Promise<{ text: string, tokens?: FilteredTokenDetails[] }> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  onLog("Initializing Agent...");
  
  try {
    const modelId = "gemini-2.0-flash-exp"; 
    
    onLog(`Reasoning with ${modelId}...`);

    const result = await ai.models.generateContent({
      model: modelId,
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: [filterTokensTool] }],
      }
    });

    const candidates = result.candidates;
    if (!candidates || candidates.length === 0) {
      return { text: "No response from AI." };
    }

    const firstPart = candidates[0].content.parts[0];

    // Check for Function Call
    if (firstPart.functionCall) {
      const fc = firstPart.functionCall;
      const fnName = fc.name;
      const args = fc.args as unknown as FilterArgs;

      if (fnName === 'filterTokens') {
        onLog(`Agent invoking tool: filterTokens(${JSON.stringify(args)})`);
        
        // Execute the tool
        const toolResultJson = await filterTokens(args);
        
        // Parse result to pass back to UI directly if needed
        let tokens: FilteredTokenDetails[] = [];
        try {
          const parsed = JSON.parse(toolResultJson);
          if (Array.isArray(parsed)) {
            tokens = parsed;
          }
        } catch (e) {
          console.error("Failed to parse tool result for UI", e);
        }

        onLog(`Tool execution complete. Found ${tokens.length} tokens. Synthesizing response...`);

        // Send tool output back to Gemini
        const result2 = await ai.models.generateContent({
          model: modelId,
          contents: [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [firstPart] }, // The function call
            { 
              role: "user", 
              parts: [{ 
                functionResponse: {
                  name: fnName,
                  response: { result: toolResultJson }
                } 
              }] 
            }
          ],
          config: {
             systemInstruction: SYSTEM_INSTRUCTION
          }
        });

        const finalResponse = result2.text || "Analysis complete.";
        return { text: finalResponse, tokens };
      }
    }

    // Fallback if no tool called
    return { text: result.text || "I couldn't process that request." };

  } catch (error: any) {
    console.error("Agent Error:", error);
    // Return a user-friendly error if it's a 404 or similar
    if (error.status === 404 || (error.message && error.message.includes("404"))) {
       return { text: "Error: The AI model is currently unavailable (404). Please try again later or check API configuration." };
    }
    return { text: "An error occurred while communicating with the AI Agent." };
  }
};