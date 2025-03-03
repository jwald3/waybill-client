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
  <div class="controls-left">
    <div class="controls-section search-section">
      <label class="section-header">Search</label>
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
    </div>

    <div class="controls-section filter-section">
      <label class="section-header">Filter & Sort</label>
      <div class="filter-group">
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
      </div>
    </div>
  </div>

  <div class="controls-section actions-section">
    <label class="section-header">Actions</label>
    <a href={addNewHref} class="primary-action-button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span>{addNewLabel}</span>
    </a>
  </div>
</div>

<style>
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
  }

  .controls-left {
    display: flex;
    gap: var(--spacing-xl);
    flex: 1;
    min-width: 0;
    flex-wrap: wrap;
  }

  .controls-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .section-header {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-left: var(--spacing-xs);
  }

  .search-section {
    flex: 1;
    min-width: 300px;
  }

  .filter-section {
    min-width: 320px;
  }

  .search-box {
    position: relative;
    width: 100%;
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
    height: 40px;
    padding: 0 var(--spacing-md) 0 2.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
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
    box-shadow: 0 0 0 1px var(--theme-color);
  }

  .filter-group {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-select {
    height: 40px;
    padding: 0 var(--spacing-xl) 0 var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    min-width: 140px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-sm) center;
    background-size: 16px;
    transition: var(--transition-all);
  }

  .filter-select:hover {
    border-color: color-mix(in srgb, var(--theme-color) 30%, var(--border-color));
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--theme-color);
    box-shadow: 0 0 0 1px var(--theme-color);
  }

  .sort-buttons {
    display: flex;
    gap: var(--spacing-xs);
  }

  .sort-button {
    height: 40px;
    padding: 0 var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-all);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .sort-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 2%, var(--bg-secondary));
  }

  .sort-button.active {
    background: color-mix(in srgb, var(--theme-color) 8%, var(--bg-secondary));
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .sort-icon {
    display: inline-flex;
    align-items: center;
    font-size: 0.85em;
    margin-top: -1px;
  }

  .actions-section {
    align-items: flex-start;
  }

  .primary-action-button {
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: 0 var(--spacing-lg);
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-all);
    text-decoration: none;
    white-space: nowrap;
  }

  .primary-action-button:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .controls {
      padding: var(--spacing-md);
      gap: var(--spacing-md);
    }

    .controls-left {
      width: 100%;
      gap: var(--spacing-md);
    }

    .controls-section {
      width: 100%;
    }

    .search-section,
    .filter-section {
      min-width: 100%;
    }

    .filter-group {
      width: 100%;
      gap: var(--spacing-sm);
    }

    .filter-select {
      flex: 1;
    }

    .sort-buttons {
      width: 100%;
      flex-wrap: wrap;
    }

    .sort-button {
      flex: 1;
      justify-content: center;
    }

    .primary-action-button {
      width: 100%;
      justify-content: center;
    }
  }
</style> 