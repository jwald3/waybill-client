<script lang="ts">
  export let searchPlaceholder = "Search...";
  export let searchQuery = "";
  export let selectedFilter = "ALL";
  export let filterOptions: string[] = [];
  export let formatFilterLabel: (filter: string) => string = (filter) => filter;
  export let sortButtons: Array<{
    field: string;
    label: string;
    active: boolean;
    direction?: 'asc' | 'desc'
  }> = [];
  export let addNewHref: string;
  export let addNewLabel: string;

  export let onSearch: (value: string) => void;
  export let onFilterChange: (value: string) => void;
  export let onSort: (field: string) => void;
</script>

<div class="controls">
  <div class="search-box">
    <span class="search-icon">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </span>
    <input
      type="text"
      class="search-input"
      placeholder={searchPlaceholder}
      bind:value={searchQuery}
      on:input={(e) => onSearch(e.currentTarget.value)}
    />
  </div>

  <select
    class="filter-select"
    bind:value={selectedFilter}
    on:change={(e) => onFilterChange(e.currentTarget.value)}
  >
    {#each filterOptions as option}
      <option value={option}>{formatFilterLabel(option)}</option>
    {/each}
  </select>

  <div class="sort-buttons">
    {#each sortButtons as button}
      <button
        class="sort-button"
        class:active={button.active}
        class:asc={button.direction === 'asc'}
        on:click={() => onSort(button.field)}
      >
        {button.label}
        {#if button.active}
          <span class="sort-icon">
            {button.direction === 'asc' ? '↑' : '↓'}
          </span>
        {/if}
      </button>
    {/each}
  </div>

  <a href={addNewHref} class="primary-action-button">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    <span>{addNewLabel}</span>
  </a>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    flex-wrap: wrap;
    box-shadow: var(--shadow-sm);
  }

  .search-box {
    position: relative;
    flex: 1;
    min-width: 260px;
  }

  .search-icon {
    position: absolute;
    left: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    pointer-events: none;
    opacity: 0.7;
  }

  .search-input {
    width: 100%;
    height: 42px;
    padding: 0 var(--spacing-md) 0 2.75rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    transition: var(--transition-all);
  }

  .search-input:hover {
    border-color: color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
    transform: translateY(-1px);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--theme-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-color) 20%, transparent);
  }

  .filter-select {
    height: 42px;
    padding: 0 2.5rem 0 var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    min-width: 160px;
    max-width: 200px;
    transition: var(--transition-all);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-sm) center;
    background-size: 16px;
  }

  .filter-select:hover {
    border-color: color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
    transform: translateY(-1px);
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--theme-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-color) 20%, transparent);
  }

  .sort-buttons {
    display: flex;
    gap: var(--spacing-xs);
  }

  .sort-button {
    height: 42px;
    padding: 0 var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    min-width: 110px;
    transition: var(--transition-all);
  }

  .sort-button:hover {
    border-color: color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
    transform: translateY(-1px);
  }

  .sort-button.active {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-secondary));
    border-color: var(--theme-color);
    color: var(--theme-color);
    font-weight: 600;
  }

  .sort-icon {
    display: inline-flex;
    align-items: center;
    font-size: 0.85em;
    margin-top: -1px;
  }

  .primary-action-button {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: 0 var(--spacing-xl);
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: var(--transition-all);
    box-shadow: var(--shadow-sm);
  }

  .primary-action-button:hover {
    opacity: 0.95;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
    }

    .search-box {
      width: 100%;
      min-width: 100%;
    }

    .filter-select {
      width: 100%;
      max-width: 100%;
    }

    .sort-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      width: 100%;
      gap: var(--spacing-xs);
    }

    .sort-button {
      width: 100%;
      min-width: 0;
      padding: 0 var(--spacing-sm);
    }

    .primary-action-button {
      width: 100%;
      margin-top: var(--spacing-xs);
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .controls {
      gap: var(--spacing-sm);
    }

    .search-box {
      min-width: 200px;
    }

    .filter-select {
      min-width: 140px;
    }

    .sort-button {
      min-width: 100px;
      padding: 0 var(--spacing-md);
    }
  }
</style> 