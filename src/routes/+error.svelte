<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import { icons } from '$lib/icons';
  import { page } from '$app/stores';

  // Random fun messages for different status codes
  const errorMessages = {
    404: [
      "Looks like this truck took a wrong turn!",
      "This route isn't on our delivery schedule.",
      "Whoops! This destination is off the map.",
      "Our GPS can't locate this page.",
      "This load seems to have been misplaced."
    ],
    // Add other status messages as needed
    default: ["Something's stalled on the highway."]
  };

  // Get a random message based on status code
  $: message = errorMessages[$page.status] 
    ? errorMessages[$page.status][Math.floor(Math.random() * errorMessages[$page.status].length)]
    : errorMessages.default[0];
</script>

<Layout>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        {@html icons.truck}
        <div class="error-code">{$page.status}</div>
      </div>
      
      <h1>{message}</h1>
      <p class="error-description">
        {#if $page.status === 404}
          The page you're looking for has been moved, deleted, or never existed.
        {:else}
          We've encountered an unexpected issue while processing your request.
        {/if}
      </p>

      <div class="action-buttons">
        <a href="/" class="primary-button">
          <span class="icon">{@html icons.dashboard}</span>
          Return to Dashboard
        </a>
        <button 
          class="secondary-button"
          on:click={() => history.back()}
        >
          <span class="icon">{@html icons.back}</span>
          Go Back
        </button>
      </div>

      {#if $page.error?.message}
        <div class="error-details">
          <p>{$page.error.message}</p>
        </div>
      {/if}
    </div>
  </div>
</Layout>

<style>
  .error-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    text-align: center;
  }

  .error-content {
    max-width: 600px;
    animation: fadeIn 0.5s ease-out;
  }

  .error-icon {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto var(--spacing-xl);
    color: var(--theme-color);
    opacity: 0.9;
    animation: bounce 2s infinite;
  }

  .error-code {
    position: absolute;
    top: -15px;
    right: -15px;
    background: var(--theme-color);
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: var(--font-size-xl);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: var(--font-size-3xl);
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
    font-weight: 800;
  }

  .error-description {
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-2xl);
    line-height: 1.6;
  }

  .action-buttons {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-bottom: var(--spacing-xl);
  }

  .primary-button,
  .secondary-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: var(--transition-all);
    text-decoration: none;
  }

  .primary-button {
    background: var(--theme-color);
    color: white;
    border: none;
  }

  .primary-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .secondary-button {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-secondary));
    color: var(--theme-color);
    border: 1px solid color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
  }

  .secondary-button:hover {
    background: color-mix(in srgb, var(--theme-color) 15%, var(--bg-secondary));
    transform: translateY(-1px);
  }

  .icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .error-details {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .error-page {
      padding: var(--spacing-lg);
    }

    h1 {
      font-size: var(--font-size-2xl);
    }

    .error-description {
      font-size: var(--font-size-md);
    }

    .action-buttons {
      flex-direction: column;
    }

    .primary-button,
    .secondary-button {
      width: 100%;
      justify-content: center;
    }
  }
</style> 