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
  {#if error}
    <div class="error-message">
      <p>{error}</p>
    </div>
  {/if}

  <div class="form-group">
    <label for="status-select">New Status</label>
    <select 
      id="status-select"
      bind:value={selectedStatus}
      class="form-select"
      disabled={isSubmitting}
    >
      <option value={null}>Select a new status...</option>
      {#each availableStatuses as status}
        <option value={status.value}>{status.label}</option>
      {/each}
    </select>
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
      disabled={isSubmitting || !selectedStatus}
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

  .form-select {
    width: 100%;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }

  .form-select:focus {
    outline: none;
    border-color: var(--theme-color);
  }

  .form-select:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style> 