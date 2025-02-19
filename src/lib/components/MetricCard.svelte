<script lang="ts">
  export let title: string;
  export let value: string;
  export let trend: {
    value: string;
    positive: boolean;
  };
  export let icon: string = '';
</script>

<div class="metric-card">
  <div class="card-content">
    {#if icon}
      <div class="icon-wrapper">
        {@html icon}
      </div>
    {/if}
    <div class="metric-info">
      <h3>{title}</h3>
      <div class="metric-details">
        <p class="value">{value}</p>
        <p class="trend" class:positive={trend.positive} class:negative={!trend.positive}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .metric-card {
    background: var(--bg-secondary);
    border-radius: 16px;
    padding: 1.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02),
                0 12px 16px rgba(0, 0, 0, 0.05),
                0 0 0 1px var(--border-color);
    transition: all 0.3s ease;
    height: 100%;
  }

  .card-content {
    display: flex;
    gap: 1.25rem;
    height: 100%;
  }

  .metric-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .metric-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--theme-color) 10%, transparent);
    border-radius: 12px;
    color: var(--theme-color);
  }

  .icon-wrapper :global(svg) {
    width: 24px;
    height: 24px;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .value {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--theme-color);
    line-height: 1;
  }

  .trend {
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .trend.positive {
    color: #10b981;
  }

  .trend.negative {
    color: #ef4444;
  }

  @media (max-width: 768px) {
    .metric-card {
      padding: 1.5rem;
    }

    .card-content {
      gap: 1rem;
    }

    .value {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    .metric-card {
      padding: 1.25rem;
    }

    .card-content {
      gap: 0.875rem;
    }

    .icon-wrapper {
      width: 40px;
      height: 40px;
    }

    .icon-wrapper :global(svg) {
      width: 20px;
      height: 20px;
    }

    h3 {
      font-size: 1rem;
    }

    .value {
      font-size: 1.75rem;
    }

    .trend {
      font-size: 0.85rem;
    }

    .metric-info {
      gap: 0.5rem;
    }
  }

  [data-color-mode="dark"] .metric-card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                0 12px 16px rgba(0, 0, 0, 0.1),
                0 0 0 1px var(--border-color);
  }
</style> 