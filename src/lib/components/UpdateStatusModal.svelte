<script lang="ts">
  import Modal from './Modal.svelte';

  export let isOpen = false;
  export let onClose: () => void;
  export let onSubmit: (action: string, datetime?: string) => Promise<void>;
  export let availableActions: Array<{ value: string, label: string }>;

  let selectedAction: string = '';
  let datetime = new Date().toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  let isSubmitting = false;
  let error: string | null = null;

  async function handleSubmit() {
    if (!selectedAction) {
      error = 'Please select an action';
      return;
    }

    try {
      isSubmitting = true;
      error = null;
      
      if (selectedAction === 'cancel') {
        await onSubmit(selectedAction);
      } else {
        await onSubmit(selectedAction, datetime);
      }
      
      onClose();
    } catch (err) {
      error = 'Failed to update status. Please try again.';
      console.error('Failed to update status:', err);
    } finally {
      isSubmitting = false;
    }
  }

  // Reset state when modal closes
  $: if (!isOpen) {
    selectedAction = '';
    datetime = new Date().toISOString().slice(0, 16);
    error = null;
    isSubmitting = false;
  }
</script>

<Modal {isOpen} title="Update Trip Status" {onClose}>
  {#if error}
    <div class="error-message">
      <p>{error}</p>
    </div>
  {/if}

  <div class="form-group">
    <label for="status-action">Action</label>
    <select 
      id="status-action"
      bind:value={selectedAction}
      class="form-select"
      disabled={isSubmitting}
    >
      <option value="">Select an action...</option>
      {#each availableActions as action}
        <option value={action.value}>{action.label}</option>
      {/each}
    </select>
  </div>

  {#if selectedAction && selectedAction !== 'cancel'}
    <div class="form-group">
      <label for="datetime">
        {selectedAction === 'begin' ? 'Departure' : 'Arrival'} Time
      </label>
      <input
        type="datetime-local"
        id="datetime"
        bind:value={datetime}
        class="form-input"
        disabled={isSubmitting}
      />
    </div>
  {/if}

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
      disabled={isSubmitting || !selectedAction}
    >
      {isSubmitting ? 'Updating...' : 'Update Status'}
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

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    font-weight: 500;
  }

  .form-select,
  .form-input {
    width: 100%;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }

  .form-select:focus,
  .form-input:focus {
    outline: none;
    border-color: var(--theme-color);
  }

  .form-select:disabled,
  .form-input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 