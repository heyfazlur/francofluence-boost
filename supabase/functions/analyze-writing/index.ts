
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, prompt } = await req.json();

    if (!text) {
      throw new Error('No text provided');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a French language expert helping students prepare for TEF/TCF exams. 
            Analyze the French text provided and return a JSON response with:
            1. Grammatical errors and their corrections
            2. Suggestions for improvement
            3. Scores for grammar, vocabulary, clarity, and overall performance (0-100)
            Your response should match this format exactly:
            {
              "errors": [{"original": "...", "correction": "...", "explanation": "..."}],
              "suggestions": ["...", "..."],
              "score": {"grammar": 0-100, "vocabulary": 0-100, "clarity": 0-100, "total": 0-100}
            }`
          },
          {
            role: 'user',
            content: `Writing prompt: ${prompt}\n\nStudent's text: ${text}`
          }
        ],
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-writing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
