
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContentModerationRequest {
  content: string;
  type: 'job_title' | 'job_description' | 'message' | 'profile_bio';
}

interface ContentModerationResponse {
  isAllowed: boolean;
  reason?: string;
  suggestedAlternative?: string;
}

// Simple content moderation - in production, you'd use AI services
const inappropriateWords = [
  'spam', 'scam', 'fraud', 'fake', 'illegal',
  // Add more inappropriate words as needed
]

const moderateContent = (content: string): ContentModerationResponse => {
  const lowerContent = content.toLowerCase()
  
  // Check for inappropriate words
  for (const word of inappropriateWords) {
    if (lowerContent.includes(word)) {
      return {
        isAllowed: false,
        reason: `Content contains inappropriate word: ${word}`,
        suggestedAlternative: content.replace(new RegExp(word, 'gi'), '***')
      }
    }
  }
  
  // Check for excessive caps (spam indicator)
  const capsPercentage = (content.match(/[A-Z]/g) || []).length / content.length
  if (capsPercentage > 0.7 && content.length > 10) {
    return {
      isAllowed: false,
      reason: 'Excessive use of capital letters',
      suggestedAlternative: content.toLowerCase()
    }
  }
  
  // Check for repeated characters (spam indicator)
  if (/(.)\1{4,}/.test(content)) {
    return {
      isAllowed: false,
      reason: 'Repeated characters detected',
    }
  }
  
  return { isAllowed: true }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content, type }: ContentModerationRequest = await req.json()
    
    if (!content || !type) {
      return new Response(
        JSON.stringify({ error: 'Content and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = moderateContent(content)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
