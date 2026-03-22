import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processImage(
  base64Image: string,
  mode: 'passport' | 'studio',
  backgroundPrompt?: string
) {
  const model = "gemini-2.5-flash-image";
  
  let prompt = "";
  if (mode === 'passport') {
    prompt = "Remove the background of this photo and replace it with a solid, plain light grey background suitable for a UK passport application. Ensure the lighting is even and there are no shadows behind the person. Keep the person's face and shoulders exactly as they are.";
  } else {
    prompt = `Remove the background of this photo and replace it with a professional studio photoshoot background. ${backgroundPrompt || "A soft-focus professional photography studio background with elegant lighting."} Ensure the person blends naturally with the new background.`;
  }

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: "image/png",
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to process image");
}
