<script lang="ts">
  export let title: string;
  export let icon: string;
</script>

<div class="card">
  <div class="card-header">
    <div class="header-content">
      <div class="icon-wrapper">
        <div class="icon">
          {@html icon}
        </div>
      </div>
      <h2>{title}</h2>
    </div>
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
    height: 64px;
    border-bottom: 1px solid var(--border-color);
    padding: 0 1.25rem;
  }

  .header-content {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--theme-color) 15%, transparent);
    flex-shrink: 0;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .icon :global(svg) {
    width: 100%;
    height: 100%;
    color: var(--theme-color);
  }

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
  }

  @media (max-width: 768px) {
    .card-header {
      height: 56px;
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