<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  let loading = false;
  let error: string | null = null;
  
  async function handleSubmit(event: SubmitEvent) {
    loading = true;
    error = null;
    
    // TODO: Implement actual login logic here
    // This is a placeholder for demonstration
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await goto('/dashboard');
    } catch (e) {
      error = 'Invalid email or password';
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <div class="auth-header">
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