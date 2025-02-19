<script lang="ts">
  export let title: string;
  export let icon: string;
</script>

<div class="card">
  <div class="card-header">
    <div class="icon-wrapper">
      {@html icon}
    </div>
    <h2>{title}</h2>
  </div>
  <div class="card-content">
    <slot />
  </div>
</div>

<style>
  .card {
    background: var(--bg-secondary);
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02),
                0 12px 16px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 1.5rem 0;
    flex-shrink: 0;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--theme-color) 15%, transparent);
  }

  .icon-wrapper :global(svg) {
    width: 24px;
    height: 24px;
    color: var(--theme-color);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  @media (max-width: 768px) {
    .card-header {
      padding: 1.25rem 1.25rem 0;
    }

    .card-content {
      padding: 1.25rem;
    }
  }

  [data-color-mode="dark"] .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                0 12px 16px rgba(0, 0, 0, 0.1);
  }
</style> 