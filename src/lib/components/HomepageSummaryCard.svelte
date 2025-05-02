<script lang="ts">
  export let icon: string;
  export let title: string;
  export let value: string | number;
  export let subtitle: string;
</script>

<div class="stat-card">
  <div class="card-header">
    <span class="icon">
      {@html icon}
    </span>
    <h2>{title}</h2>
  </div>
  <p class="number">{value}</p>
  <p class="subtitle">{subtitle}</p>
</div>

<style>
  .stat-card {
    background: var(--surface-color);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px color-mix(in srgb, var(--theme-color) 8%, transparent);
    border-color: color-mix(in srgb, var(--theme-color) 50%, var(--border-color));
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--theme-gradient);
    border-radius: 12px;
    color: white;
  }

  .icon :global(svg) {
    width: 24px;
    height: 24px;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0;
  }

  .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    letter-spacing: -1px;
  }

  .subtitle {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 500;
  }
</style>
