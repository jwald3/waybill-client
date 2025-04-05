import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
  // Create a new headers object instead of modifying the existing one
  const headers = new Headers(event.request.headers);
  const token = event.cookies.get('auth_token');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Create a new request with the modified headers
  const request = new Request(event.request.url, {
    method: event.request.method,
    headers,
    body: event.request.body
  });

  event.request = request;
  return resolve(event);
};

export const handle = sequence(authHandle); 