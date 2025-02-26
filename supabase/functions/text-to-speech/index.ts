
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY')
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL" // Sarah's voice ID - good for French pronunciation

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Generating speech for text:', text)

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.75,
            use_speaker_boost: true
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', errorText)
      throw new Error('Failed to generate speech')
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    )

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        format: 'mp3'
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      }
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      }
    )
  }
})
