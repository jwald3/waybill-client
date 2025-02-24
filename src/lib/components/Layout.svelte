<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  import { sidebarExpanded } from '$lib/stores/sidebar';
</script>

<div class="layout" class:sidebar-expanded={$sidebarExpanded}>
  <Sidebar />
  
  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  main {
    flex: 1;
    background: var(--bg-primary);
    margin-left: 80px;
    width: calc(100% - 80px);
    transition: margin-left 0.3s ease, width 0.3s ease;
  }

  .layout.sidebar-expanded main {
    margin-left: 280px;
    width: calc(100% - 280px);
  }

  @media (max-width: 768px) {
    main {
      margin-left: 0;
      width: 100%;
      padding-bottom: 64px;
    }

    .layout.sidebar-expanded main {
      margin-left: 0;
      width: 100%;
    }
  }
</style> 