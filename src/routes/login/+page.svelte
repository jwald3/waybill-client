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
      <div class="auth-brand">Waybill</div>
      <h1 class="auth-title">Welcome Back</h1>
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
      
      <!-- <div class="social-auth-buttons">
        <button type="button" class="social-auth-button">
          <img src="/google-icon.svg" alt="" width="20" height="20" />
          Continue with Google
        </button>
      </div> -->
    </form>
    
    <div class="auth-footer">
      <span>Don't have an account? </span>
      <a href="/register" class="auth-link">Sign up</a>
    </div>
  </div>
</div> 