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
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed');
    }

    // If registration is successful (201), proceed to login
    if (response.status === 201) {
      return login(credentials);
    }

    throw new Error('Unexpected response from server');
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed' };
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear local storage regardless of server response
    localStorage.removeItem('auth_token');
  } catch (error) {
    // Still clear local storage even if the API call fails
    localStorage.removeItem('auth_token');
    console.error('Logout error:', error);
  }
} 