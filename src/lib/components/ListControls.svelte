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
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    border: 1px solid var(--border-color);
  }

  .controls-main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .search-and-filter {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
  }

  .search-box {
    flex: 2;
    min-width: 300px;
    position: relative;
  }

  .search-icon,
  .filter-icon {
    position: absolute;
    left: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    opacity: 0.6;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    height: 44px;
    padding: 0 var(--spacing-md) 0 2.75rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--font-size-md);
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
    min-width: 200px;
    position: relative;
  }

  .filter-select {
    width: 100%;
    height: 44px;
    padding: 0 2.75rem 0 2.75rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--font-size-md);
    appearance: none;
    cursor: pointer;
    transition: var(--transition-all);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-md) center;
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
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .sort-buttons {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .sort-button {
    height: 44px;
    padding: 0 var(--spacing-xl);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-secondary);
    font-size: var(--font-size-md);
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .sort-button:hover {
    border-color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 2%, var(--bg-primary));
    color: var(--theme-color);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .sort-button.active {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-primary));
    border-color: var(--theme-color);
    color: var(--theme-color);
    font-weight: 600;
    box-shadow: 0 1px 3px color-mix(in srgb, var(--theme-color) 20%, transparent);
  }

  .sort-icon {
    opacity: 0.8;
    font-size: 0.85em;
    margin-left: var(--spacing-xs);
  }

  .add-button {
    height: 44px;
    padding: 0 var(--spacing-xl);
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-md);
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 2px 4px color-mix(in srgb, var(--theme-color) 25%, transparent),
                0 1px 2px color-mix(in srgb, var(--theme-color) 15%, transparent);
  }

  .add-button:hover {
    transform: translateY(-1px);
    background: color-mix(in srgb, white 5%, var(--theme-color));
    box-shadow: 0 4px 8px color-mix(in srgb, var(--theme-color) 30%, transparent),
                0 2px 4px color-mix(in srgb, var(--theme-color) 20%, transparent);
  }

  .add-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px color-mix(in srgb, var(--theme-color) 25%, transparent);
  }

  @media (max-width: 768px) {
    .controls-wrapper {
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .controls-main {
      gap: var(--spacing-lg);
    }

    .search-and-filter {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .search-box,
    .filter-box {
      width: 100%;
      min-width: 100%;
    }

    .controls-actions {
      flex-direction: column-reverse;
      gap: var(--spacing-md);
    }

    .sort-buttons {
      order: 1;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--spacing-md);
    }

    .sort-button {
      justify-content: center;
      width: 100%;
      padding: 0 var(--spacing-md);
    }

    .add-button {
      order: 0;
      width: 100%;
      justify-content: center;
      margin-bottom: var(--spacing-sm);
    }
  }
</style> 