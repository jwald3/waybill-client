<script lang="ts">
  export let tabs: { id: string; label: string; icon?: string }[] = [];
  export let activeTab: string = tabs[0]?.id;

  function setActiveTab(tabId: string) {
    activeTab = tabId;
  }
</script>

<div class="tab-container">
  <div class="tab-list" role="tablist">
    {#each tabs as tab}
      <button
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls={`panel-${tab.id}`}
        class="tab-button"
        class:active={activeTab === tab.id}
        on:click={() => setActiveTab(tab.id)}
      >
        {#if tab.icon}
          {@html tab.icon}
        {/if}
        {tab.label}
      </button>
    {/each}
  </div>

  <div class="tab-content">
    <slot {activeTab} />
  </div>
</div>

<style>
  .tab-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .tab-list {
    display: flex;
    gap: var(--spacing-xs);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tab-list::-webkit-scrollbar {
    display: none;
  }

  .tab-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    background: none;
    border: none;
    color: var(--text-secondary);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-all);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
  }

  .tab-button:hover {
    color: var(--theme-color);
  }

  .tab-button.active {
    color: var(--theme-color);
    border-bottom-color: var(--theme-color);
  }

  .tab-content {
    min-height: 200px;
  }

  .tab-button :global(svg) {
    width: 18px;
    height: 18px;
  }
</style> 