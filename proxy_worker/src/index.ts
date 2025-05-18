
interface Env {
  OPENROUTER_API_KEY: string;
}

interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const MAX_TEXT_LENGTH = 2000;
const ALLOWED_EXTENSION_ID = 'chrome-extension://YOUR_EXTENSION_ID';

async function handleOptions(request: Request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_EXTENSION_ID,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

function constructPrompt(textSegment: string, userGoal: string): string {
  return `
<mindframe_analysis>
  <input>
    <text_segment><![CDATA[${textSegment}]]></text_segment>
    <user_goal><![CDATA[${userGoal}]]></user_goal>
  </input>
  <output_format>
    Please analyze the text and provide insights in the following XML format:
    <pattern_type>Identify the cognitive pattern type</pattern_type>
    <hc_related>Related higher-order cognitive skill (or null if none)</hc_related>
    <explanation>Clear explanation of the insight</explanation>
    <micro_challenge_prompt>A specific, actionable challenge</micro_challenge_prompt>
    <highlight_suggestion_css_selector>CSS selector for relevant text (or null)</highlight_suggestion_css_selector>
    <original_text_segment>The analyzed text segment</original_text_segment>
  </output_format>
  <guidelines>
    - Focus on cognitive patterns and thinking strategies
    - Keep explanations clear and concise
    - Make challenges specific and immediately actionable
    - Align insights with the user's learning goal
    - Identify opportunities for cognitive skill development
  </guidelines>
</mindframe_analysis>`;
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  // CORS check
  const origin = request.headers.get('Origin');
  if (origin !== ALLOWED_EXTENSION_ID) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Method check
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { textSegment, userGoal } = await request.json<{
      textSegment: string;
      userGoal: string;
    }>();

    // Validation
    if (!textSegment || !userGoal) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (textSegment.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Text segment too long' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Construct prompt
    const prompt = constructPrompt(textSegment, userGoal);

    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mindframe.app/proxy',
      },
      body: JSON.stringify({
        model: 'google/gemini-pro',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.2,
      }),
    });

    if (!openRouterResponse.ok) {
      const error = await openRouterResponse.text();
      console.error('OpenRouter API error:', error);
      return new Response(
        JSON.stringify({ error: 'LLM service error' }),
        { 
          status: openRouterResponse.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': ALLOWED_EXTENSION_ID,
          }
        }
      );
    }

    const llmResponse = await openRouterResponse.json<LLMResponse>();
    const analysisXML = llmResponse.choices[0]?.message?.content;

    if (!analysisXML) {
      throw new Error('Invalid LLM response format');
    }

    // Return the XML response
    return new Response(analysisXML, {
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': ALLOWED_EXTENSION_ID,
      },
    });

  } catch (error) {
    console.error('Worker error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_EXTENSION_ID,
        }
      }
    );
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env);
  },
};
