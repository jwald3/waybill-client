<script lang="ts">
  import Modal from './Modal.svelte';
  import type { TruckStatus } from '$lib/api/trucks';

  export let isOpen = false;
  export let onClose: () => void;
  export let onSubmit: (status: TruckStatus) => Promise<void>;
  export let availableStatuses: Array<{ value: TruckStatus, label: string }>;

  let selectedStatus: TruckStatus | null = null;
  let isSubmitting = false;
  let error: string | null = null;

  async function handleSubmit() {
    if (!selectedStatus) {
      error = 'Please select a status';
      return;
    }

    try {
      isSubmitting = true;
      error = null;
      await onSubmit(selectedStatus);
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
    selectedStatus = null;
    error = null;
    isSubmitting = false;
  }
</script>

<Modal {isOpen} title="Update Truck Status" {onClose}>
  <div class="modal-content">
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {/if}

    <div class="form-group">
      <label for="status-select" class="form-label">Action</label>
      <select 
        id="status-select"
        bind:value={selectedStatus}
        class="form-select"
        disabled={isSubmitting}
      >
        <option value={null}>Select an action...</option>
        {#each availableStatuses as status}
          <option value={status.value}>{status.label}</option>
        {/each}
      </select>
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
      disabled={isSubmitting || !selectedStatus}
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

  :global(.form-select) {
    width: 100%;
    padding: 8px 12px;
    height: 40px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  :global(.form-select:focus) {
    outline: none;
    border-color: var(--theme-color);
  }

  :global(.form-select:disabled) {
    opacity: 0.7;
    cursor: not-allowed;
  }

  :global(.form-cancel),
  :global(.form-submit) {
    min-width: 100px;
  }

  :global(.form-label) {
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    display: block;
  }
</style> 