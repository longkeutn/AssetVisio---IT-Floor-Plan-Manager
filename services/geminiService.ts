import { GoogleGenAI, Type } from "@google/genai";
import { Device, AnalysisResult } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const analyzeAssets = async (locationName: string, devices: Device[]): Promise<AnalysisResult> => {
  try {
    const ai = initGenAI();
    
    const prompt = `
      Analyze the following IT assets located in "${locationName}".
      Provide a brief summary of the network health, list 3 specific maintenance recommendations, 
      and assign an alert level (LOW, MEDIUM, HIGH) based on device status distribution.
      
      Devices: ${JSON.stringify(devices.map(d => ({ 
        name: d.name, 
        type: d.type, 
        status: d.status,
        ip: d.ipAddress 
      })))}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            alertLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("No response from AI");

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      summary: "AI Analysis unavailable. Please check your API key or connection.",
      recommendations: ["Manually check offline devices", "Verify IP conflicts", "Check power supply"],
      alertLevel: "LOW"
    };
  }
};
