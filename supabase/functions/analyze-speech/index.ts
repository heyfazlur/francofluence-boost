
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
    const { audio, prompt } = await req.json();

    if (!audio) {
      throw new Error('No audio data provided');
    }

    // First, transcribe the audio using Whisper
    const formData = new FormData();
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const transcription = await transcriptionResponse.json();

    // Then, analyze the transcription using GPT-4
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a French language expert analyzing spoken French for TEF/TCF exam preparation.
            Compare the student's transcribed speech with the given prompt and provide detailed feedback.
            Return a JSON response with:
            1. Pronunciation mistakes and corrections with phonetic hints
            2. Suggestions for improvement
            3. Scores for pronunciation, fluency, and overall performance (0-100)
            Format:
            {
              "pronunciationScore": 0-100,
              "fluencyScore": 0-100,
              "overallScore": 0-100,
              "mistakes": [{"word": "...", "correction": "...", "phoneticHint": "..."}],
              "suggestions": ["...", "..."]
            }`
          },
          {
            role: 'user',
            content: `Prompt: ${prompt}\n\nStudent's speech: ${transcription.text}`
          }
        ],
      }),
    });

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-speech function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
