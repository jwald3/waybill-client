import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const auth: Handle = async ({ event, resolve }) => {
  // Get token from Authorization header
  const authHeader = event.request.headers.get('Authorization');
  const token = authHeader?.split('Bearer ')[1];
  
  if (token) {
    // Forward the auth token to any fetch requests made in load functions
    const response = await resolve(event, {
      transformPageChunk: ({ html }) => html
    });
    
    // Add the auth header to any subsequent fetch requests
    response.headers.append('Authorization', `Bearer ${token}`);
    return response;
  }

  return resolve(event);
};

export const handle = sequence(auth); 