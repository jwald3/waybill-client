<script lang="ts">
  export let title: string | undefined = undefined;
  export let icon: string | undefined = undefined;
  export let className: string = '';
</script>

<div class="card {className}">
  {#if title}
    <div class="card-header">
      {#if icon}
        <span class="icon">
          {@html icon}
        </span>
      {/if}
      <h2>{title}</h2>
    </div>
  {/if}
  <slot />
</div>

<style>
  .card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02),
                0 12px 16px rgba(0, 0, 0, 0.05),
                0 0 0 1px rgba(99, 102, 241, 0.08);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #6366f1, #818cf8);
  }

  .card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06),
                0 20px 30px rgba(0, 0, 0, 0.07),
                0 0 0 2px rgba(99, 102, 241, 0.1);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-header h2 {
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    padding: 1rem;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
    transform: rotate(-5deg);
  }
</style> 