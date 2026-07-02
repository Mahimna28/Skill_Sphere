import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const session = token ? verifyToken(token) : null;

    if (!session) {
      console.log("AI Tutor: Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    console.log("AI Tutor: Received message:", message?.substring(0, 50));

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("AI Tutor: Missing OPENAI_API_KEY");
      return NextResponse.json({ error: "Service not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI tutor for students. Provide clear, educational, and accurate answers. Keep responses concise but thorough.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log("AI Tutor: OpenAI status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Tutor: OpenAI error:", errorText);
      
      let errorMessage = "AI service error";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error?.code === 'invalid_api_key' || response.status === 401) {
          errorMessage = "Invalid OpenAI API key. Please check your environment variables.";
        } else if (parsed.error?.message) {
          errorMessage = parsed.error.message;
        }
      } catch (e) {
        // Ignored, not JSON
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    
    console.log("AI Tutor: Reply length:", reply?.length);

    return NextResponse.json({ response: reply || "No response generated." });
  } catch (error) {
    console.error("AI Tutor: Unhandled error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
