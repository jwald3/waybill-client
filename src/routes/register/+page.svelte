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

<div class="page-container">
  <div class="image-section">
    <div class="overlay">
      <div class="image-content">
        <div class="brand">
          <img src="/waybill_logo_white.png" alt="Waybill" class="brand-logo" />
        </div>
        <div class="hero-text">
          <h2>Streamline Your Fleet Operations</h2>
          <p>Join thousands of companies using Waybill to manage their fleet operations more efficiently</p>
        </div>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">📍</span>
            <span>Real-time fleet tracking</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span>Advanced analytics</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔧</span>
            <span>Maintenance management</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="form-section">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Create your account</h1>
        <p>Get started with a free account</p>
      </div>
      
      <form class="auth-form" on:submit|preventDefault={handleSubmit}>
        {#if error}
          <div class="auth-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
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
            <img src="/google-icon.png" alt="" width="18" height="18" />
            <span>Continue with Google</span>
          </button>
        </div>
      </form>
      
      <div class="auth-footer">
        <span>Already have an account?</span>
        <a href="/login" class="auth-link">Sign in →</a>
      </div>
    </div>
  </div>
</div>

<style>
  .page-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .image-section {
    display: none;
    background-image: linear-gradient(45deg, #6366f1, #818cf8);
    position: relative;
    overflow: hidden;
  }

  .image-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/truck-landscape.png');
    background-size: cover;
    background-position: center;
    opacity: 1.0;
    mix-blend-mode: soft-light;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(45deg, 
      rgba(99, 102, 241, 0.75), 
      rgba(129, 140, 248, 0.75)
    );
    backdrop-filter: blur(1px);
  }

  .image-content {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2.5rem;
  }

  .brand {
    margin-bottom: 0;
  }

  .brand-logo {
    height: 120px;
    width: auto;
    filter: brightness(0) invert(1);
  }

  .hero-text {
    margin-bottom: 0;
  }

  .hero-text h2 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: white;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-text p {
    font-size: 1.25rem;
    line-height: 1.6;
    opacity: 0.9;
    max-width: 500px;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.125rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    backdrop-filter: blur(8px);
  }

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
  }

  .form-section {
    flex: 1;
    background: var(--background-color);
    display: flex;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0 !important;
  }

  .auth-container {
    width: 100%;
    max-width: 420px;
    margin: auto;
    padding: 0.75rem;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .auth-header h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #6366f1, #818cf8);
    -webkit-background-clip: text;
    color: transparent;
  }

  .auth-header p {
    color: var(--text-secondary);
  }

  .auth-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    background: #fee2e2;
    color: #991b1b;
    margin-bottom: 1.5rem;
  }

  :global(.auth-input-group) {
    margin-bottom: 0.875rem;
  }

  :global(.auth-input-group label) {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-color);
  }

  :global(.auth-input) {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--input-background);
    transition: all 0.2s;
  }

  :global(.auth-input:focus) {
    border-color: #3949ab;
    box-shadow: 0 0 0 3px rgba(57, 73, 171, 0.1);
    outline: none;
  }

  :global(.auth-button) {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    background: linear-gradient(to right, #6366f1, #818cf8);
    color: white;
    font-weight: 600;
    transition: opacity 0.2s;
  }

  :global(.auth-button:hover) {
    opacity: 0.9;
  }

  :global(.auth-button:disabled) {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-divider {
    text-align: center;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--text-secondary);
  }

  .auth-divider::before,
  .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  :global(.social-auth-button) {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-weight: 500;
    color: #1a1a1a;
    transition: all 0.2s;
    height: 42px;
  }

  :global(.social-auth-button img) {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }

  :global(.social-auth-button:hover) {
    background: #f8fafc;
    border-color: #cbd5e1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  :global(.social-auth-button:active) {
    background: #f1f5f9;
  }

  .auth-footer {
    margin-top: 1rem;
    text-align: center;
    color: var(--text-secondary);
  }

  .auth-link {
    color: #818cf8;
    font-weight: 500;
    margin-left: 0.5rem;
    text-decoration: none;
  }

  .auth-link:hover {
    text-decoration: underline;
  }

  @media (min-width: 1024px) {
    .image-section {
      display: block;
      flex: 1.1;
    }

    .form-section {
      flex: 0.9;
    }

    .overlay {
      padding: 4rem;
    }

    .image-content {
      gap: 3.5rem;
    }
  }
</style>