import { API_BASE_URL } from './client';

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  error?: string;
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Login failed' };
  }
}

export async function register(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }
} 