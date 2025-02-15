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
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    padding: 1.5rem;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
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
    color: #1e293b;
  }
</style> 