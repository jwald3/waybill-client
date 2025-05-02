<script lang="ts">
  import { goto } from '$app/navigation';
  import { register } from '$lib/api/auth';
  import { isAuthenticated } from '$lib/stores/auth';
  
  let loading = false;
  let error: string | null = null;
  let email = '';
  let password = '';
  let confirmPassword = '';
  
  async function handleSubmit(event: SubmitEvent) {
    loading = true;
    error = null;
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      loading = false;
      return;
    }
    
    const response = await register({ email, password });
    
    if (response.error) {
      error = response.error;
    } else if (response.token) {
      isAuthenticated.login(response.token);
      await goto('/');
    }
    
    loading = false;
  }
</script>

<svelte:head>
  <title>Create Account | Waybill</title>
  <meta name="description" content="Create your Waybill account to get started" />
</svelte:head>

<div class="auth-page">
  <div class="auth-container">
    <div class="auth-header">
      <img src="/waybill_logo_cropped.png" alt="Waybill Logo" class="auth-logo" />
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
          bind:value={confirmPassword}
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
          <img src="/google-icon.png" alt="" width="20" height="20" />
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

<style>
  .auth-logo {
    width: 180px;
    height: 80px;
    margin-bottom: 2rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
    object-fit: contain;
  }
</style> 