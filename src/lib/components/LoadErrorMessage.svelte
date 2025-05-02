<script lang="ts">
  import Card from './Card.svelte';
  import { icons } from '$lib/icons';

  export let message: string;
  export let icon = icons.incidents;
  export let title = 'Something went wrong';
</script>

<div class="error-container">
  <div class="error-content">
    <div class="error-icon">
      {@html icon}
    </div>
    <h2>{title}</h2>
    <p class="error-message">
      {#if message.includes('API call failed')}
        We're having trouble connecting to our servers. Please try again in a moment.
      {:else}
        {message}
      {/if}
    </p>
    <button class="retry-button" on:click={() => window.location.reload()}>
      Try Again
    </button>
  </div>
</div>

<style>
  .error-container {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    padding: 3rem 2rem;
    text-align: center;
    max-width: 500px;
    margin: 2rem auto;
    box-shadow: var(--shadow-md);
  }

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .error-icon {
    color: var(--error-color);
    background: color-mix(in srgb, var(--error-color) 10%, transparent);
    padding: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-icon :global(svg) {
    width: 2.5rem;
    height: 2.5rem;
    fill: currentColor;
  }

  h2 {
    color: var(--text-primary);
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin: 0;
  }

  .error-message {
    color: var(--text-secondary);
    font-size: var(--font-size-md);
    line-height: 1.5;
    margin: 0;
    max-width: 400px;
  }

  .retry-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--theme-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-all);
  }

  .retry-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    .error-container {
      padding: 2rem 1rem;
      margin: 1rem;
    }

    .error-icon {
      padding: 1rem;
    }

    .error-icon :global(svg) {
      width: 2rem;
      height: 2rem;
    }

    h2 {
      font-size: var(--font-size-lg);
    }

    .error-message {
      font-size: var(--font-size-sm);
    }
  }
</style> 