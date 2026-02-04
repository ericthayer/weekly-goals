
import { GoogleGenAI, Type } from "@google/genai";
import { WeeklyData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function summarizeWeek(data: WeeklyData): Promise<{ summary: string; actions: string }> {
  const prompt = `
    As an expert productivity coach, analyze this developer's weekly journal and provide a summary and retro actions.
    
    Weekly Data:
    ${JSON.stringify(data, null, 2)}
    
    Focus on:
    1. Key accomplishments vs initial goals.
    2. Patterns in unplanned items.
    3. Constructive feedback for the next week.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A summary of the week's outcomes and findings." },
            actions: { type: Type.STRING, description: "Retro actions or things to try next week." },
          },
          required: ["summary", "actions"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      summary: result.summary || "Unable to generate summary.",
      actions: result.actions || "No specific actions suggested."
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      summary: "Error generating summary. Please try again later.",
      actions: "Error generating actions."
    };
  }
}

export async function suggestActionItems(dayGoal: string): Promise<string[]> {
  const prompt = `Suggest 3 specific developer action items for the goal: "${dayGoal}". Keep them short and actionable.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
}
