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
  {#if error}
    <div class="error-message">
      <p>{error}</p>
    </div>
  {/if}

  <div class="form-group">
    <label for="note-text">Note</label>
    <textarea
      id="note-text"
      bind:value={noteText}
      placeholder="Enter your note here..."
      rows="4"
      class="form-textarea"
      disabled={isSubmitting}
    ></textarea>
  </div>

  <div slot="footer">
    <button 
      class="action-button" 
      on:click={onClose}
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button 
      class="action-button primary"
      on:click={handleSubmit}
      disabled={isSubmitting || !noteText.trim()}
    >
      {isSubmitting ? 'Adding...' : 'Add Note'}
    </button>
  </div>
</Modal>

<style>
  .error-message {
    padding: 0 0 var(--spacing-md);
  }

  .error-message p {
    color: var(--error-color, #dc2626);
    margin: 0;
    font-size: var(--font-size-sm);
  }

  .form-textarea {
    width: 100%;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--font-size-md);
    resize: vertical;
    min-height: 100px;
  }

  .form-textarea:focus {
    outline: none;
    border-color: var(--theme-color);
  }

  .form-textarea:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 