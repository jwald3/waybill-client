<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  let loading = false;
  let error: string | null = null;
  
  async function handleSubmit(event: SubmitEvent) {
    loading = true;
    error = null;
    
    // TODO: Implement actual registration logic here
    // This is a placeholder for demonstration
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await goto('/dashboard');
    } catch (e) {
      error = 'Registration failed. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <div class="auth-header">
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-subtitle">Get started with your account</p>
    </div>
    
    <form class="auth-form" on:submit|preventDefault={handleSubmit}>
      {#if error}
        <div class="auth-error">
          {error}
        </div>
      {/if}
      
      <div class="auth-input-group">
        <label for="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          class="auth-input" 
          required 
          autocomplete="name"
        />
      </div>
      
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
          autocomplete="new-password"
          minlength="8"
        />
      </div>
      
      <div class="auth-input-group">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          class="auth-input" 
          required 
          autocomplete="new-password"
          minlength="8"
        />
      </div>
      
      <button 
        type="submit" 
        class="auth-button" 
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create Account'}
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
      <span>Already have an account? </span>
      <a href="/login" class="auth-link">Sign in</a>
    </div>
  </div>
</div> 