
// Update to follow the latest @google/genai guidelines
import { GoogleGenAI, Type } from "@google/genai";

export const getFoodRecommendations = async (userMood: string) => {
  try {
    // Initialization must use a named parameter and the exact process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário quer comer algo baseado no humor ou desejo: "${userMood}". Sugira 3 categorias de comida adequadas. Responda apenas o JSON: {"suggestions": ["tipo1", "tipo2", "tipo3"]}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestions"]
        }
      }
    });
    
    // Access response text as a property, not a method, and handle potential undefined
    const text = response.text;
    const result = JSON.parse(text ? text.trim() : '{"suggestions": []}');
    return result.suggestions as string[];
  } catch (error) {
    console.error("Erro na busca inteligente Pira AI:", error);
    return ["Pizza", "Hambúrguer", "Açaí"];
  }
};
