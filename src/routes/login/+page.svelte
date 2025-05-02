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

<svelte:head>
  <title>Sign In | Waybill</title>
  <meta name="description" content="Sign in to your Waybill account" />
</svelte:head>

<div class="page-container-component">
  <div class="image-section-component">
    <div class="overlay-component">
      <div class="image-content-component">
        <div class="brand-component">
          <img src="/waybill_logo_white.png" alt="Waybill" class="brand-logo-component" />
        </div>
        <div class="hero-text-component">
          <h2>Welcome Back to Waybill</h2>
          <p>Sign in to access your fleet management dashboard and continue managing your operations</p>
        </div>
        <div class="feature-list-component">
          <div class="feature-item-component">
            <span class="feature-icon-component">📍</span>
            <span>Real-time fleet tracking</span>
          </div>
          <div class="feature-item-component">
            <span class="feature-icon-component">📊</span>
            <span>Advanced analytics</span>
          </div>
          <div class="feature-item-component">
            <span class="feature-icon-component">🔧</span>
            <span>Maintenance management</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="form-section-component">
    <div class="auth-container-component">
      <div class="brand-container">
        <img src="/waybill_logo_cropped.png" alt="Waybill" class="form-logo" />
      </div>
      
      <div class="auth-header-component">
        <h1>Sign in to your account</h1>
        <p>Welcome back! Please enter your details</p>
      </div>
      
      <form class="auth-form-component" on:submit|preventDefault={handleSubmit}>
        {#if error}
          <div class="auth-error-component">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
            {error}
          </div>
        {/if}
        
        <div class="auth-input-group-component">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            class="auth-input-component"
            bind:value={email}
            required 
            autocomplete="email"
            placeholder="Enter your email address"
          />
        </div>
        
        <div class="auth-input-group-component">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            class="auth-input-component"
            bind:value={password}
            required 
            autocomplete="current-password"
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          class="auth-button-component" 
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div class="auth-footer-component">
        <span>Don't have an account?</span>
        <a href="/register" class="auth-link-component">Sign up →</a>
      </div>
    </div>
  </div>
</div>

<style>
  .page-container-component {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .image-section-component {
    display: none;
    background-image: linear-gradient(45deg, #517DF1, #6B90F3);
    position: relative;
    overflow: hidden;
  }

  .image-section-component::before {
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

  .overlay-component {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(45deg, 
      rgba(81, 125, 241, 0.75), 
      rgba(107, 144, 243, 0.75)
    );
    backdrop-filter: blur(1px);
  }

  .image-content-component {
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

  .brand-component {
    margin-bottom: 0;
  }

  .brand-logo-component {
    height: 120px;
    width: auto;
    filter: brightness(0) invert(1);
  }

  .hero-text-component {
    margin-bottom: 0;
  }

  .hero-text-component h2 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: white;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-text-component p {
    font-size: 1.25rem;
    line-height: 1.6;
    opacity: 0.9;
    max-width: 500px;
  }

  .feature-list-component {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .feature-item-component {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.125rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    backdrop-filter: blur(8px);
  }

  .feature-icon-component {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
  }

  .form-section-component {
    flex: 1;
    background: var(--background-color);
    display: flex;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0 !important;
  }

  .auth-container-component {
    width: 100%;
    max-width: 420px;
    margin: auto;
    padding: 0.75rem;
  }

  .auth-header-component {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .auth-header-component h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #517DF1, #6B90F3);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  .auth-header-component p {
    color: var(--text-secondary);
  }

  .auth-error-component {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    background: #fee2e2;
    color: #991b1b;
    margin-bottom: 1.5rem;
  }

  :global(.auth-input-group-component) {
    margin-bottom: 0.875rem;
  }

  :global(.auth-input-group-component label) {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-color);
  }

  :global(.auth-input-component) {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--input-background);
    transition: all 0.2s;
  }

  :global(.auth-input-component:focus) {
    border-color: #3949ab;
    box-shadow: 0 0 0 3px rgba(57, 73, 171, 0.1);
    outline: none;
  }

  :global(.auth-button-component) {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    background: linear-gradient(to right, #517DF1, #6B90F3);
    color: white;
    font-weight: 600;
    transition: opacity 0.2s;
  }

  :global(.auth-button-component:hover) {
    opacity: 0.9;
  }

  :global(.auth-button-component:disabled) {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-footer-component {
    margin-top: 1rem;
    text-align: center;
    color: var(--text-secondary);
  }

  .auth-link-component {
    color: #517DF1;
    font-weight: 500;
    margin-left: 0.5rem;
    text-decoration: none;
  }

  .auth-link-component:hover {
    text-decoration: underline;
  }

  .brand-container {
    text-align: center;
    margin-bottom: 2rem;
  }

  .form-logo {
    width: 140px;
    height: auto;
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    .image-section-component {
      display: block;
      flex: 1.1;
    }

    .form-section-component {
      flex: 0.9;
    }

    .overlay-component {
      padding: 4rem;
    }

    .image-content-component {
      gap: 3.5rem;
    }
  }
</style> 