<script lang="ts">
  import { goto } from '$app/navigation';
  import { login } from '$lib/api/auth';
  import { isAuthenticated } from '$lib/stores/auth';
  
  let loading = false;
  let error: string | null = null;
  let email = '';
  let password = '';
  
  async function handleSubmit() {
    loading = true;
    error = null;
    
    const response = await login({ email, password });
    
    if (response.error) {
      error = response.error;
    } else if (response.token) {
      isAuthenticated.login(response.token);
      await goto('/');
    }
    
    loading = false;
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <div class="auth-header">
      <img src="/waybill_logo_cropped.png" alt="Waybill Logo" class="auth-logo" />
      <h2 class="auth-title">Welcome Back</h2>
      <p class="auth-subtitle">Sign in to your account</p>
    </div>
    
    <form class="auth-form" on:submit|preventDefault={handleSubmit}>
      {#if error}
        <div class="auth-error">
          {error}
        </div>
      {/if}
      
      <div class="auth-input-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          class="auth-input"
          bind:value={email}
          required 
          autocomplete="email"
        />
      </div>
      
      <div class="auth-input-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          class="auth-input"
          bind:value={password}
          required 
          autocomplete="current-password"
        />
      </div>
      
      <button 
        type="submit" 
        class="auth-button" 
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      
      <div class="auth-divider">or</div>
      
      <div class="social-auth-buttons">
        <button type="button" class="social-auth-button">
          <img src="/google-icon.svg" alt="" width="20" height="20" />
          Continue with Google
        </button>
      </div>
    </form>
    
    <div class="auth-footer">
      <span>Don't have an account? </span>
      <a href="/register" class="auth-link">Sign up</a>
    </div>
  </div>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    background-color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .auth-container {
    background-color: rgba(30, 41, 59, 0.5);
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .auth-logo {
    width: 180px;
    height: 80px;
    margin-bottom: 2rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
    object-fit: contain;
  }

  .auth-title {
    color: white;
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0.75rem 0;
  }

  .auth-subtitle {
    color: #94a3b8;
    font-size: 0.875rem;
  }

  .auth-input-group {
    margin-bottom: 1rem;
  }

  .auth-input-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #94a3b8;
  }

  .auth-input {
    width: 100%;
    padding: 0.75rem;
    background-color: #1e293b;
    border: none;
    border-radius: 4px;
    color: white;
  }

  .auth-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #818cf8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-divider {
    text-align: center;
    color: #94a3b8;
    margin: 1rem 0;
  }

  .social-auth-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #1e293b;
    color: white;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .auth-footer {
    text-align: center;
    margin-top: 1rem;
    color: #94a3b8;
  }

  .auth-link {
    color: #818cf8;
    text-decoration: none;
  }
</style> 