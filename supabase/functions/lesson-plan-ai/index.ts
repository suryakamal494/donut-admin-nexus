import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  action: "generate_block" | "generate_quiz" | "suggest_explanation" | "generate_plan";
  topic?: string;
  subject?: string;
  chapter?: string;
  blockType?: string;
  context?: string;
  questionCount?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, topic, subject, chapter, blockType, context, questionCount } = await req.json() as RequestBody;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "generate_block":
        systemPrompt = `You are an expert education content creator helping teachers create engaging lesson plan blocks. Generate concise, actionable content for a teaching block. Keep responses focused and practical.`;
        userPrompt = `Create content for a "${blockType}" teaching block about "${topic}" in ${subject}. ${context ? `Additional context: ${context}` : ""}
        
Return a JSON object with:
- title: A clear, engaging title for this block (max 8 words)
- content: Detailed description of what to cover (2-3 sentences)
- duration: Suggested duration in minutes (number between 5-20)
- tips: One practical tip for the teacher`;
        break;

      case "generate_quiz":
        systemPrompt = `You are an expert education assessment creator. Generate clear, well-structured quiz questions for classroom use.`;
        userPrompt = `Create ${questionCount || 5} multiple-choice questions about "${topic}" in ${subject}, ${chapter ? `chapter: ${chapter}` : ""}.

Return a JSON object with:
- questions: Array of question objects, each with:
  - question: The question text
  - options: Array of 4 options (strings)
  - correctIndex: Index of correct answer (0-3)
  - explanation: Brief explanation of the answer`;
        break;

      case "suggest_explanation":
        systemPrompt = `You are an expert teacher creating clear, engaging explanations for students. Make concepts easy to understand with relatable examples.`;
        userPrompt = `Create a student-friendly explanation for "${topic}" in ${subject}. ${context ? `Context: ${context}` : ""}

Return a JSON object with:
- explanation: A clear 3-4 sentence explanation
- keyPoints: Array of 3-4 key bullet points students should remember
- realWorldExample: One relatable real-world example
- commonMistakes: One common misconception to address`;
        break;

      case "generate_plan":
        systemPrompt = `You are an expert curriculum designer helping teachers create effective, engaging lesson plans. Create structured, practical teaching flows.`;
        userPrompt = `Create a complete lesson plan for a 45-minute class on "${topic}" in ${subject}, ${chapter ? `chapter: ${chapter}` : ""}.

Return a JSON object with:
- title: Lesson plan title
- learningObjectives: Array of 2-3 learning objectives
- blocks: Array of teaching blocks, each with:
  - type: One of "explain", "demonstrate", "ask", "check", "practice", "homework"
  - title: Block title
  - content: What to cover
  - duration: Minutes (total should be ~40 minutes)
- homework: A suggested homework assignment`;
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

    // Parse the JSON response
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      // If JSON parsing fails, return the raw content
      parsedContent = { raw: content };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("lesson-plan-ai error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
