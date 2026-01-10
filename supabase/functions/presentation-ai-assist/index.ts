import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context, question, history } = await req.json();

    console.log('AI Assist request:', { context, question, historyLength: history?.length });

    // Build the system prompt
    const systemPrompt = `You are an AI teaching assistant helping a teacher during a live classroom presentation.

You have access to the following context about the current lesson:
${context}

Your role is to:
1. Help the teacher explain concepts in simpler terms
2. Provide real-world examples and analogies
3. Suggest additional questions to ask students
4. Identify common misconceptions students might have
5. Provide quick facts and clarifications

Keep your responses:
- Concise (2-4 sentences max for quick answers)
- Teacher-focused (you're helping the teacher, not directly speaking to students)
- Practical and immediately usable in the classroom

If asked about something outside the current lesson context, you can still help but acknowledge you're going beyond the current material.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: question },
    ];

    // Call Lovable AI (gemini-3-flash-preview for fast responses)
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          response: "AI service is not configured. Please contact support." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.lovable.dev/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedResponse = data.choices?.[0]?.message?.content || 
      "I couldn't generate a response. Please try again.";

    console.log('AI Assist response generated successfully');

    return new Response(
      JSON.stringify({ response: generatedResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in presentation-ai-assist function:', errorMessage);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        response: "I'm having trouble processing your request. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
