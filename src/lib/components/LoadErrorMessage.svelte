<script lang="ts">
  import Card from './Card.svelte';
  import { icons } from '$lib/icons';

  export let message: string;
  export let icon = icons.incidents;
  export let title = 'Error';
</script>

<Card {title} {icon}>
  <div class="error-message">
    <p>{message}</p>
    <button class="action-button" on:click={() => window.location.reload()}>
      Retry
    </button>
  </div>
</Card>

<style>
  .error-message {
    text-align: center;
    padding: 2rem;
  }

  .error-message p {
    color: var(--error-color, #dc2626);
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
</style> 