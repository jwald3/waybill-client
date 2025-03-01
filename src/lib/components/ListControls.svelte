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
    <input
      type="text"
      class="search-input"
      placeholder={searchPlaceholder}
      bind:value={searchQuery}
      on:input={(e) => onSearch(e.currentTarget.value)}
    />
    <span class="search-icon">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </span>
  </div>

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
          {button.label} {button.active ? (button.direction === 'asc' ? '↑' : '↓') : ''}
        </button>
      {/each}
    </div>
  </div>

  <a href={addNewHref} class="primary-action-button">
    {addNewLabel}
  </a>
</div>

<style>
  /* The controls styles can be removed from here since they're in shared.css */
</style> 