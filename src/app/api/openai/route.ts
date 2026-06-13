import { NextResponse } from "next/server";

// Fallback chain: if one model is overloaded, try the next
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const geminiKey = process.env.GOOGLE_AI_KEY?.trim();

    if (!geminiKey || geminiKey.includes("your-gemini")) {
      return NextResponse.json(
        { message: "Google Gemini API Key is missing or invalid in environment variables." }, 
        { status: 500 }
      );
    }

    const systemPrompt = "You are an academic AI tutor for Skill Sphere. Help students with their questions concisely and professionally.";

    // Gemini requires alternating roles starting with 'user'. 'assistant' must be mapped to 'model'.
    let formattedContents: any[] = [];
    
    // Process messages into Gemini format
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      // Skip empty messages
      if (!msg.content || msg.content.trim() === "") continue;
      
      const role = msg.role === "assistant" ? "model" : "user";
      
      // For the very first user message, prepend the system prompt
      let text = msg.content;
      if (formattedContents.length === 0 && role === "user") {
        text = `System Prompt: ${systemPrompt}\n\nUser Question: ${text}`;
      }

      // If the last added message has the same role, append to it instead of creating a new object
      // (Gemini API throws errors for consecutive messages with the same role)
      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
        formattedContents[formattedContents.length - 1].parts[0].text += `\n\n${text}`;
      } else {
        formattedContents.push({
          role: role,
          parts: [{ text: text }]
        });
      }
    }

    // Ensure it starts with user (in case history starts with assistant somehow)
    if (formattedContents.length > 0 && formattedContents[0].role !== "user") {
      formattedContents.unshift({
        role: "user",
        parts: [{ text: `System Prompt: ${systemPrompt}\n\nHi.` }]
      });
    }

    // If history is completely empty for some reason, provide a fallback
    if (formattedContents.length === 0) {
      formattedContents.push({
        role: "user",
        parts: [{ text: `System Prompt: ${systemPrompt}\n\nHello.` }]
      });
    }

    const requestBody = JSON.stringify({
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    let lastError = "";

    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });

        const data = await response.json();

        // If overloaded (429/503), try next model
        if (response.status === 429 || response.status === 503) {
          console.warn(`Model ${model} is overloaded, trying next fallback...`);
          lastError = data.error?.message || `${model} is overloaded`;
          continue;
        }

        if (!response.ok) {
          console.error(`Gemini Error (${model}):`, JSON.stringify(data));
          lastError = data.error?.message || "Failed to get response from Gemini.";
          continue;
        }

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return NextResponse.json({ reply: data.candidates[0].content.parts[0].text });
        }

        lastError = "Received an empty response from the AI.";
      } catch (fetchError) {
        console.warn(`Fetch failed for ${model}:`, fetchError);
        lastError = `Network error with ${model}`;
        continue;
      }
    }

    // All models failed
    return NextResponse.json(
      { message: lastError || "All AI models are currently unavailable. Please try again in a moment." }, 
      { status: 503 }
    );

  } catch (error: any) {
    console.error("Internal API Error:", error);
    return NextResponse.json(
      { message: "An internal error occurred while processing your AI request." }, 
      { status: 500 }
    );
  }
}

