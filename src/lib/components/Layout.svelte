<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  let isNavExpanded = true;
</script>

<div class="layout">
  <Sidebar isExpanded={isNavExpanded} />
  
  <main class:nav-expanded={isNavExpanded}>
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
    padding-left: 80px;
    transition: padding-left 0.3s ease;
    width: 100%;
  }

  main.nav-expanded {
    padding-left: 280px;
  }

  @media (max-width: 768px) {
    main {
      padding-left: 0;
      padding-bottom: 64px;
    }

    main.nav-expanded {
      padding-left: 0;
    }
  }
</style> 