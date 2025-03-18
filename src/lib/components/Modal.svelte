<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let isOpen = false;
  export let title: string;
  export let onClose: () => void;

  let dialog: HTMLDialogElement;
  let previousActiveElement: HTMLElement | null = null;

  // Handle keyboard events
  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'Tab') {
      // Get all focusable elements
      const focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusable[0] as HTMLElement;
      const lastFocusable = focusable[focusable.length - 1] as HTMLElement;

      // If shift+tab and first element is focused, move to last
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
      // If tab and last element is focused, move to first
      else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    // Only close if clicking the backdrop (dialog element itself)
    if (event.target === dialog) {
      onClose();
    }
  }

  $: if (isOpen) {
    // Store the current active element to restore focus later
    previousActiveElement = document.activeElement as HTMLElement;
    // Next tick to ensure dialog is rendered
    setTimeout(() => {
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
      dialog?.focus();
    });
  } else {
    if (dialog?.open) {
      dialog.close();
    }
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  onMount(() => {
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<dialog
  bind:this={dialog}
  class="modal"
  on:close={onClose}
>
  <div 
    class="modal-container"
    on:click={handleBackdropClick}
    role="presentation"
  >
    <div 
      class="modal-content"
      transition:fade={{ duration: 200 }}
    >
      <div class="modal-header">
        <h2 id="modal-title">{title}</h2>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</dialog>

<style>
  .modal {
    padding: 0;
    border: none;
    background: transparent;
    max-height: 100vh;
    max-width: 100vw;
  }

  .modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  /* Remove default focus outline and add our own styling */
  .modal:focus {
    outline: none;
  }

  .modal-container {
    width: 100%;
    height: 100%;
  }

  .modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    width: 90vw;
    max-width: 500px;
    box-shadow: var(--shadow-lg);
    outline: none;
  }

  .modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
  }

  /* Ensure dialog is centered */
  @media (max-width: 640px) {
    .modal-content {
      width: 95vw;
      margin: 1rem;
    }
  }
</style> 