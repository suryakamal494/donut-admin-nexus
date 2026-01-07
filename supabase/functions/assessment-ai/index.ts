import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  action: "generate_quiz" | "generate_homework";
  topic: string;
  subject: string;
  chapter?: string;
  questionCount?: number;
  difficulty?: string;
  questionTypes?: string[];
  homeworkType?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, topic, subject, chapter, questionCount, difficulty, questionTypes, homeworkType } = await req.json() as RequestBody;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "generate_quiz":
        systemPrompt = `You are an expert education assessment creator. Generate clear, well-structured quiz questions suitable for classroom use. Each question should test understanding, not just memorization.`;
        userPrompt = `Create ${questionCount || 5} quiz questions about "${topic}" in ${subject}${chapter ? `, chapter: ${chapter}` : ""}.

Difficulty level: ${difficulty || "medium"}
Question types to include: ${questionTypes?.join(", ") || "MCQ"}

Return a JSON object with:
{
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation",
      "difficulty": "easy|medium|hard",
      "marks": 1
    }
  ],
  "totalMarks": number,
  "estimatedTime": number (in minutes)
}`;
        break;

      case "generate_homework":
        systemPrompt = `You are an expert education content creator. Generate meaningful homework assignments that reinforce classroom learning and encourage independent thinking.`;
        userPrompt = `Create a ${homeworkType || "practice"} homework assignment about "${topic}" in ${subject}${chapter ? `, chapter: ${chapter}` : ""}.

Return a JSON object with:
{
  "title": "Assignment title",
  "description": "Brief description of the assignment",
  "instructions": ["Step 1", "Step 2", ...],
  "tasks": [
    {
      "id": "t1",
      "type": "problem|question|activity|reading",
      "content": "Task description",
      "marks": number (optional)
    }
  ],
  "totalMarks": number (optional),
  "estimatedTime": number (in minutes),
  "resources": ["Optional resource links or references"]
}`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = { raw: content };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("assessment-ai error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
