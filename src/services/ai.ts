import { GoogleGenAI } from "@google/genai";

export async function processImage(
  base64Image: string,
  mode: 'passport' | 'studio',
  backgroundPrompt?: string
) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("[Debug V2] API Key is missing. Please check your Vercel Environment Variables and Redeploy.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash-image";
  
  let prompt = "";
  if (mode === 'passport') {
    prompt = "Remove the background of this photo and replace it with a solid, plain light grey background suitable for a UK passport application. Ensure the lighting is even and there are no shadows behind the person. Keep the person's face and shoulders exactly as they are.";
  } else {
    prompt = `Remove the background of this photo and replace it with a professional studio photoshoot background. ${backgroundPrompt || "A soft-focus professional photography studio background with elegant lighting."} Ensure the person blends naturally with the new background.`;
  }

  const mimeType = base64Image.match(/data:([^;]+);base64/)?.[1] || "image/png";
  const base64Data = base64Image.split(',')[1];

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in Vercel environment variables.");
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      console.error("Gemini API Response:", response);
      throw new Error("The AI didn't return an image. This might be due to safety filters or an invalid image.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in the AI response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Your Gemini API Key is invalid. Please check it in Vercel settings.");
    }
    throw error;
  }
}
