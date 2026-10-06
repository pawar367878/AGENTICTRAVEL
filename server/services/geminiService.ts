import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }

  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
      aiClient = null;
    }
  }

  return aiClient;
}

export async function enhancePlanWithGemini(prompt: string): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert AI Travel Orchestrator specializing in Multi-Agent Collaborative Travel Planning. Provide practical, high-value, concise, structured recommendations and day-wise itineraries matching the exact budget, travel style, and constraints.',
      },
    });

    return response.text || null;
  } catch (error) {
    console.warn('Gemini API call failed, falling back to local multi-agent heuristic engine:', error);
    return null;
  }
}
