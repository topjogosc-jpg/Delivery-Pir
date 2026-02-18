
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFoodRecommendations = async (userMood: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário quer comer algo baseado no humor: "${userMood}". Sugira 3 categorias de comida. Responda apenas o JSON: {"suggestions": ["tipo1", "tipo2", "tipo3"]}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    const result = JSON.parse(response.text || '{"suggestions": []}');
    return result.suggestions as string[];
  } catch (error) {
    console.error("Erro na IA:", error);
    return ["Pizza", "Hambúrguer", "Açaí"];
  }
};
