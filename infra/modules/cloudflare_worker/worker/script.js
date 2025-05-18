
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  // Verify API key
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || authHeader !== API_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Main request handling logic here
    return new Response('MINDFRAME OS Worker', {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    })
  }
}
