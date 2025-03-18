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
  <div class="card-header">
    <div class="header-content">
      {#if icon}
        <div class="icon-wrapper">
          {@html icon}
        </div>
      {/if}
      <h3>{title}</h3>
    </div>
  </div>
  <div class="card-content">
    <div class="metric-info">
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

  .card-content {
    flex: 1;
    padding: 2rem 1.25rem;
    min-height: 160px;
    display: flex;
  }

  .metric-info {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }

  .metric-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: color-mix(in srgb, var(--theme-color) 15%, transparent);
    border-radius: 8px;
    color: var(--theme-color);
    flex-shrink: 0;
  }

  .icon-wrapper :global(svg) {
    width: 20px;
    height: 20px;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;  
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .value {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--theme-color);
    line-height: 1;
    margin: 0;
  }

  .trend {
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  .trend.positive {
    color: #10b981;
  }

  .trend.negative {
    color: #ef4444;
  }

  @media (max-width: 768px) {
    .card-header {
      height: 56px;
    }

    .card-content {
      padding: 1.5rem 1.25rem;
      min-height: 140px;
    }

    .value {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    .card-content {
      padding: 1.25rem;
      min-height: 120px;
    }
    .icon-wrapper {
      width: 28px;
      height: 28px;
    }

    .icon-wrapper :global(svg) {
      width: 16px;
      height: 16px;
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
  }
</style> 