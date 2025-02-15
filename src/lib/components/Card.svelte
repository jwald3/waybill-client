<script lang="ts">
  export let className = '';
</script>

<div class="card {className}">
  <slot />
</div>

<style>
  .card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style> 