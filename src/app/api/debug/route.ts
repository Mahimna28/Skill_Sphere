import { NextResponse } from "next/server";

export async function GET() {
  const geminiKey = process.env.GOOGLE_AI_KEY || "";
  const openaiKey = process.env.OPENAI_API_KEY || "";
  
  return NextResponse.json({
    gemini: geminiKey
      ? geminiKey.includes("your-gemini") 
        ? "❌ Still placeholder value" 
        : `✅ Key loaded (starts with: ${geminiKey.substring(0, 8)}...)`
      : "❌ Not set",
    openai: openaiKey
      ? openaiKey.includes("your-openai")
        ? "❌ Still placeholder value"
        : `✅ Key loaded (starts with: ${openaiKey.substring(0, 8)}...)`
      : "❌ Not set",
    mode: !geminiKey.includes("your-gemini") && geminiKey 
      ? "🤖 REAL Gemini AI" 
      : "📚 Local fallback",
  });
}
