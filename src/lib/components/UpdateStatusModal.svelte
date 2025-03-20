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
  <div class="modal-content">
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {/if}

    <div class="form-group">
      <label for="status-action" class="form-label">Action</label>
      <select 
        id="status-action"
        bind:value={selectedAction}
        class="form-input"
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
        <label for="datetime" class="form-label">
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
      disabled={isSubmitting || !selectedAction}
    >
      {isSubmitting ? 'Updating...' : 'Update Status'}
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

  .form-group {
    margin-bottom: var(--spacing-md);
  }

  :global(.form-input) {
    width: 100%;
    padding: 6px var(--spacing-md);
    height: 32px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
  }

  :global(select.form-input) {
    appearance: none;
    cursor: pointer;
    padding-right: 32px;
    background-color: var(--bg-secondary);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23858585' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }

  :global(.form-label) {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    margin-bottom: 4px;
    display: block;
  }

  :global(.form-cancel),
  :global(.form-submit) {
    min-width: 100px;
  }
</style> 