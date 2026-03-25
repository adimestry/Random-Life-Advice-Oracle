import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface AdviceResult {
  advice: string;
  title: string;
  quote: string;
  absurdity_rating: number;
}

export async function generateAdvice(question: string, mood: string): Promise<AdviceResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are an eccentric, wise-yet-absurd philosopher. 
  A user asks: "${question}"
  The mood of your advice should be: ${mood}.
  
  Provide your response in JSON format with:
  - "advice": 3 paragraphs of poetic/philosophical advice.
  - "title": A short, punchy title for this advice.
  - "quote": A single, memorable, absurdly wise sentence.
  - "absurdity_rating": A number from 1 to 10.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          advice: { type: Type.STRING },
          title: { type: Type.STRING },
          quote: { type: Type.STRING },
          absurdity_rating: { type: Type.NUMBER },
        },
        required: ["advice", "title", "quote", "absurdity_rating"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as AdviceResult;
}
