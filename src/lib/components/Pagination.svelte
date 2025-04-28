<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
  export let totalItems: number;
  export let itemsPerPage: number;
  export let onPageChange: (page: number) => void;

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  $: startItem = (currentPage - 1) * itemsPerPage + 1;
  $: endItem = Math.min(currentPage * itemsPerPage, totalItems);
</script>

<nav class="pagination" aria-label="Pagination">
  <div class="pagination-info">
    Showing <span class="highlight">{startItem}-{endItem}</span> of <span class="highlight">{totalItems}</span> items
  </div>
  <div class="pagination-controls">
    <button 
      class="page-button nav-button"
      disabled={currentPage === 1}
      on:click={() => goToPage(1)}
      aria-label="First page"
    >
      <span class="icon" aria-hidden="true">«</span>
    </button>
    <button 
      class="page-button nav-button"
      disabled={currentPage === 1}
      on:click={() => goToPage(currentPage - 1)}
      aria-label="Previous page"
    >
      <span class="icon" aria-hidden="true">‹</span>
    </button>
    
    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      {#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
        <button 
          class="page-button number-button"
          class:active={page === currentPage}
          on:click={() => goToPage(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label="Page {page}"
        >
          {page}
        </button>
      {:else if page === currentPage - 2 || page === currentPage + 2}
        <span class="page-ellipsis">…</span>
      {/if}
    {/each}

    <button 
      class="page-button nav-button"
      disabled={currentPage === totalPages}
      on:click={() => goToPage(currentPage + 1)}
      aria-label="Next page"
    >
      <span class="icon" aria-hidden="true">›</span>
    </button>
    <button 
      class="page-button nav-button"
      disabled={currentPage === totalPages}
      on:click={() => goToPage(totalPages)}
      aria-label="Last page"
    >
      <span class="icon" aria-hidden="true">»</span>
    </button>
  </div>
</nav>

<style>
  .pagination {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
    user-select: none;
  }

  .pagination-info {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .highlight {
    color: var(--text-primary);
    font-weight: 500;
  }

  .pagination-controls {
    display: flex;
    gap: 0.375rem;
    align-items: center;
    background: var(--bg-primary);
    padding: 0.375rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
  }

  .page-button {
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    transition: all 0.2s ease;
    cursor: pointer;
    line-height: 1;
    position: relative;
  }

  .page-button:not(:disabled):hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
  }

  .page-button.number-button {
    font-weight: 500;
    line-height: 0;
  }

  .page-button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    background: transparent;
    border-color: transparent;
  }

  .page-button.active {
    background: var(--theme-color);
    border-color: var(--theme-color);
    color: white;
    font-weight: 600;
  }

  .page-ellipsis {
    color: var(--text-secondary);
    padding: 0 0.25rem;
    user-select: none;
    min-width: 2rem;
    text-align: center;
  }

  .page-button.nav-button {
    font-weight: 600;
  }

  .page-button.nav-button .icon {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    height: auto;
    width: auto;
  }

  .icon {
    line-height: 0;
  }

  @media (max-width: 768px) {
    .pagination {
      padding: 1rem;
      gap: 1rem;
    }

    .pagination-controls {
      padding: 0.25rem;
      gap: 0.25rem;
    }

    .page-button {
      min-width: 2.25rem;
      height: 2.25rem;
    }

    .page-button.nav-button .icon {
      font-size: 1.25rem;
    }
  }
</style> 