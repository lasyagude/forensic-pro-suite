import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages }: { messages: ChatMessage[] } = body;

    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!geminiKey && !groqKey) {
      return NextResponse.json({ error: "No API Keys configured (Gemini or Groq)" }, { status: 500 });
    }

    const latestMessage = messages[messages.length - 1].content;
    const systemPrompt = `You are an intelligent AI assistant built into the Forensic Pro Suite application. 
      Your purpose is to provide contextual, real-time guidance to users. 
      Help them understand features, guide navigation, clarify processes, and resolve any doubts.
      Keep responses concise, helpful, and professional.`;

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        let formattedHistory = messages.slice(0, -1).map((msg: ChatMessage) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));
        
        if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
          formattedHistory = formattedHistory.slice(1);
        }
        
        const chat = model.startChat({
          history: formattedHistory,
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser message: ${latestMessage}`);
        const responseText = result.response.text();

        return NextResponse.json({ response: responseText, provider: "gemini" });
      } catch (geminiError: unknown) {
        const errorMessage = geminiError instanceof Error ? geminiError.message : String(geminiError);
        console.warn("Gemini API failed, falling back to Groq if available:", errorMessage);
        if (!groqKey) {
          throw geminiError;
        }
      }
    }

    if (groqKey) {
      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: ChatMessage) => ({
          role: msg.role === "model" ? "assistant" : msg.role,
          content: msg.content
        }))
      ];

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: groqMessages,
          max_tokens: 1000,
        })
      });

      if (!groqResponse.ok) {
        throw new Error(`Groq API returned ${groqResponse.status}: ${await groqResponse.text()}`);
      }

      const groqData = await groqResponse.json();
      const responseText = groqData.choices[0].message.content;
      
      return NextResponse.json({ response: responseText, provider: "groq" });
    }
  } catch (error) {
    console.error("AI Assistant API Error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
