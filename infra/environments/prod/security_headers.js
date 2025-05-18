
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  
  // Clone the response so that we can modify headers
  const newResponse = new Response(response.body, response)

  // Add strict security headers
  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; connect-src 'self'")
  
  // Strict CORS settings for production
  const origin = request.headers.get('Origin')
  if (ALLOWED_ORIGINS.includes(origin)) {
    newResponse.headers.set('Access-Control-Allow-Origin', origin)
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    newResponse.headers.set('Access-Control-Max-Age', '86400')
  }

  return newResponse
}
