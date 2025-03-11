<script lang="ts">
  export let variant: 'success' | 'info' | 'warning' | 'error' | 'default' = 'default';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let icon: string | undefined = undefined;
</script>

<span class="chip {variant} {size}">
  {#if icon}
    <span class="icon">{@html icon}</span>
  {/if}
  <slot />
</span>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    white-space: nowrap;
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .chip:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Size variants */
  .small {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .medium {
    padding: 0.7rem 1.4rem;
    font-size: 0.9rem;
  }

  .large {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }

  /* Color variants */
  .success {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
  }

  .info {
    background: var(--theme-gradient);
    color: white;
  }

  .warning {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    color: white;
  }

  .error {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
  }

  .default {
    background: var(--surface-color);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Dark mode adjustments */
  [data-color-mode="dark"] .default {
    background: color-mix(in srgb, var(--surface-color) 80%, white);
  }
</style> 