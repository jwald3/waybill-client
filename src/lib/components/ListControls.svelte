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

<div class="controls-wrapper">
  <div class="controls-main">
    <div class="search-and-filter">
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

      <div class="filter-box">
        <span class="filter-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
          </svg>
        </span>
        <select
          class="filter-select"
          bind:value={selectedFilter}
          on:change={(e) => onFilterChange(e.currentTarget.value)}
        >
          {#each filterOptions as option}
            <option value={option}>{formatFilterLabel(option)}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="controls-actions">
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

      <a href={addNewHref} class="add-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>{addNewLabel}</span>
      </a>
    </div>
  </div>
</div>

<style>
  .controls-wrapper {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    border: 1px solid var(--border-color);
  }

  .controls-main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .search-and-filter {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .search-box {
    flex: 2;
    min-width: 240px;
    position: relative;
  }

  .search-icon,
  .filter-icon {
    position: absolute;
    left: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    opacity: 0.7;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    height: 42px;
    padding: 0 var(--spacing-md) 0 2.75rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    transition: var(--transition-all);
  }

  .search-input:hover {
    border-color: color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
  }

  .search-input:focus {
    outline: none;
    border-color: var(--theme-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-color) 20%, transparent);
  }

  .filter-box {
    flex: 1;
    min-width: 180px;
    position: relative;
  }

  .filter-select {
    width: 100%;
    height: 42px;
    padding: 0 2.5rem 0 2.75rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    appearance: none;
    cursor: pointer;
    transition: var(--transition-all);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-sm) center;
    background-size: 16px;
  }

  .filter-select:hover {
    border-color: color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--theme-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-color) 20%, transparent);
  }

  .controls-actions {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .sort-buttons {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }

  .sort-button {
    height: 42px;
    padding: 0 var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    transition: var(--transition-all);
    white-space: nowrap;
  }

  .sort-button:hover {
    border-color: color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-primary));
  }

  .sort-button.active {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-primary));
    border-color: var(--theme-color);
    color: var(--theme-color);
    font-weight: 600;
  }

  .add-button {
    height: 42px;
    padding: 0 var(--spacing-xl);
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: var(--transition-all);
    white-space: nowrap;
  }

  .add-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .controls-wrapper {
      padding: var(--spacing-md);
    }

    .controls-main {
      gap: var(--spacing-md);
    }

    .search-and-filter {
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .search-box,
    .filter-box {
      width: 100%;
      min-width: 100%;
    }

    .controls-actions {
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .sort-buttons {
      order: 1;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }

    .add-button {
      order: 0;
      justify-content: center;
    }

    .sort-button {
      justify-content: center;
    }
  }
</style> 