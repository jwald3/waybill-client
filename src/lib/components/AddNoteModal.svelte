<script lang="ts">
  import Modal from './Modal.svelte';

  export let isOpen = false;
  export let onClose: () => void;
  export let onSubmit: (note: string) => Promise<void>;

  let noteText = '';
  let isSubmitting = false;
  let error: string | null = null;

  async function handleSubmit() {
    if (!noteText.trim()) {
      error = 'Please enter a note';
      return;
    }

    try {
      isSubmitting = true;
      error = null;
      await onSubmit(noteText);
      noteText = '';
      onClose();
    } catch (err) {
      error = 'Failed to add note. Please try again.';
      console.error('Failed to add note:', err);
    } finally {
      isSubmitting = false;
    }
  }

  // Reset state when modal closes
  $: if (!isOpen) {
    noteText = '';
    error = null;
    isSubmitting = false;
  }
</script>

<Modal {isOpen} title="Add Note" {onClose}>
  <div class="modal-content">
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {/if}

    <div class="form-group">
      <label for="note-text" class="form-label">Note</label>
      <textarea
        id="note-text"
        bind:value={noteText}
        placeholder="Enter your note here..."
        rows="4"
        class="form-input"
        disabled={isSubmitting}
      ></textarea>
    </div>
  </div>

  <div slot="footer" class="modal-footer">
    <button 
      class="form-cancel" 
      on:click={onClose}
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button 
      class="form-submit"
      on:click={handleSubmit}
      disabled={isSubmitting || !noteText.trim()}
    >
      {isSubmitting ? 'Adding...' : 'Add Note'}
    </button>
  </div>
</Modal>

<style>
  .modal-content {
    padding: var(--spacing-lg);
  }

  .modal-footer {
    padding: var(--spacing-md);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
  }

  .error-message {
    padding: 0 0 var(--spacing-md);
  }

  .error-message p {
    color: var(--error-color, #dc2626);
    margin: 0;
    font-size: var(--font-size-sm);
  }

  :global(.form-input) {
    width: 100%;
    min-height: 120px;
    resize: vertical;
  }

  :global(.form-cancel),
  :global(.form-submit) {
    min-width: 100px;
  }
</style> 