<script lang="ts">
  import Modal from './Modal.svelte';
  import type { EmploymentStatus } from '$lib/api/drivers';

  export let isOpen = false;
  export let onClose: () => void;
  export let onSubmit: (status: EmploymentStatus) => Promise<void>;
  export let availableStatuses: Array<{ value: EmploymentStatus, label: string }>;

  let selectedStatus: EmploymentStatus | null = null;
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

<Modal {isOpen} title="Update Driver Status" {onClose}>
  <div class="modal-content">
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {/if}

    <div class="form-group">
      <label for="status-select" class="form-label">New Status</label>
      <select 
        id="status-select"
        bind:value={selectedStatus}
        class="form-input"
        disabled={isSubmitting}
      >
        <option value={null}>Select a new status...</option>
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

  :global(.form-input) {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    height: 42px;
  }

  :global(select.form-input) {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-sm) center;
    padding-right: var(--spacing-xl);
  }

  :global(.form-cancel),
  :global(.form-submit) {
    min-width: 100px;
  }
</style> 