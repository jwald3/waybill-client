<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import { icons } from '$lib/icons';
  import { page } from '$app/stores';

  // Add type for the error messages object
  const errorMessages: Record<number | 'default', string[]> = {
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
      <div class="error-visual">
        <div class="error-icon">
          {@html icons.truck}
          <div class="error-code">{$page.status}</div>
        </div>
        <div class="road">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
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
        <div class="button-wrapper">
          <a href="/" class="primary-button">
            <span class="icon">{@html icons.dashboard}</span>
            Home
          </a>
        </div>
        <div class="button-wrapper">
          <button 
            class="secondary-button"
            on:click={() => history.back()}
          >
            <span class="icon">{@html icons.back}</span>
            Go Back
          </button>
        </div>
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
    background: linear-gradient(180deg, 
      var(--bg-primary) 0%,
      color-mix(in srgb, var(--bg-primary) 97%, var(--theme-color)) 100%
    );
  }

  .error-content {
    max-width: 600px;
    animation: fadeIn 0.5s ease-out;
    padding: var(--spacing-2xl);
    background: var(--bg-secondary);
    border-radius: var(--radius-2xl);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border-color);
  }

  .error-visual {
    position: relative;
    margin-bottom: var(--spacing-2xl);
  }

  .error-icon {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto;
    color: var(--theme-color);
    opacity: 0.9;
    animation: driveAndBounce 3s infinite;
    z-index: 2;
  }

  .error-code {
    position: absolute;
    top: -20px;
    right: -20px;
    background: var(--theme-color);
    color: white;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: var(--font-size-2xl);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 4px solid var(--bg-secondary);
  }

  .road {
    position: relative;
    height: 6px;
    background: var(--border-color);
    margin-top: -30px;
    border-radius: 3px;
    overflow: hidden;
  }

  .line {
    position: absolute;
    top: 50%;
    height: 2px;
    width: 40px;
    background: var(--theme-color);
    animation: moveLine 1s linear infinite;
  }

  .line:nth-child(1) { left: 25%; animation-delay: 0s; }
  .line:nth-child(2) { left: 50%; animation-delay: 0.33s; }
  .line:nth-child(3) { left: 75%; animation-delay: 0.66s; }

  h1 {
    font-size: var(--font-size-3xl);
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
    font-weight: 800;
    line-height: 1.2;
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

  .button-wrapper {
    flex: 1;
    max-width: 200px;
  }

  .primary-button,
  .secondary-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-lg);
    font-weight: 500;
    transition: var(--transition-all);
    text-decoration: none;
    width: 100%;
    justify-content: center;
    cursor: pointer;
  }

  .primary-button {
    background: var(--theme-color);
    color: white;
    border: none;
  }

  .primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-color) 40%, transparent);
  }

  .secondary-button {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-secondary));
    color: var(--theme-color);
    border: 1px solid color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
  }

  .secondary-button:hover {
    background: color-mix(in srgb, var(--theme-color) 15%, var(--bg-secondary));
    transform: translateY(-2px);
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
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  @keyframes driveAndBounce {
    0%, 100% {
      transform: translateY(0) translateX(-5px);
    }
    50% {
      transform: translateY(-15px) translateX(5px);
    }
  }

  @keyframes moveLine {
    0% {
      transform: translateX(0);
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: translateX(100px);
      opacity: 0;
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

    .error-content {
      padding: var(--spacing-xl);
    }

    .error-icon {
      width: 120px;
      height: 120px;
    }

    .error-code {
      width: 48px;
      height: 48px;
      font-size: var(--font-size-xl);
      top: -12px;
      right: -12px;
    }

    h1 {
      font-size: var(--font-size-2xl);
    }

    .error-description {
      font-size: var(--font-size-md);
    }

    .button-wrapper {
      max-width: none;
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

  .number {
    font-size: 4rem;
    font-weight: 800;
    margin: 0.75rem 0;
    background: var(--theme-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
  }
</style> 