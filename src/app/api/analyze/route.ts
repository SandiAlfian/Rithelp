import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy' });

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in .env.local" }, { status: 400 });
    }

    const { image, prompt } = await req.json();
    
    if (!image || !prompt) {
      return NextResponse.json({ error: "Image and Prompt are required" }, { status: 400 });
    }

    // image is base64 string: data:image/png;base64,iVBORw...
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]
    });

    return NextResponse.json({ result: response.text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze image" }, { status: 500 });
  }
}
