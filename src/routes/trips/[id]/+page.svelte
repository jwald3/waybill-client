<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import type { Trip } from '$lib/api/trips';
  import { 
    beginTrip, 
    finishTripSuccess, 
    finishTripFailure, 
    cancelTrip,
    type TripStatus,
    addTripNote,
    type AddTripNoteRequest
  } from '$lib/api/trips';
  
  let isNavExpanded = true;
  
  export let data;
  let trip: Trip = data.trip;

  interface TripNote {
    note_timestamp: string;
    content: string;
  }

  interface UpdateStatusModal {
    isOpen: boolean;
    currentStatus: TripStatus | null;
    selectedAction: string | null;
    datetime: string;
  }

  let updateStatusModal: UpdateStatusModal = {
    isOpen: false,
    currentStatus: null,
    selectedAction: null,
    datetime: new Date().toISOString().slice(0, 16)
  };

  let updateStatusError: string | null = null;

  interface AddNoteModal {
    isOpen: boolean;
    content: string;
  }

  let addNoteModal: AddNoteModal = {
    isOpen: false,
    content: ''
  };

  let addNoteError: string | null = null;

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }

  function formatStatusLabel(status: string): string {
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  function getAvailableActions(status: TripStatus): Array<{ value: string, label: string }> {
    switch (status) {
      case 'SCHEDULED':
        return [
          { value: 'begin', label: 'Begin Trip' },
          { value: 'cancel', label: 'Cancel Trip' }
        ];
      case 'IN_TRANSIT':
        return [
          { value: 'complete', label: 'Mark as Completed' },
          { value: 'fail', label: 'Mark as Failed' }
        ];
      default:
        return [];
    }
  }

  function openUpdateStatus() {
    updateStatusModal = {
      isOpen: true,
      currentStatus: trip.status as TripStatus,
      selectedAction: null,
      datetime: new Date().toISOString().slice(0, 16)
    };
    updateStatusError = null;
  }

  function closeUpdateStatus() {
    updateStatusModal = {
      isOpen: false,
      currentStatus: null,
      selectedAction: null,
      datetime: new Date().toISOString().slice(0, 16)
    };
    updateStatusError = null;
  }

  async function handleUpdateStatus() {
    if (!updateStatusModal.selectedAction) return;

    try {
      updateStatusError = null;
      let updatedTrip: Trip;

      switch (updateStatusModal.selectedAction) {
        case 'begin':
          updatedTrip = await beginTrip(trip.id, {
            departure_time: new Date(updateStatusModal.datetime).toISOString()
          });
          break;
        case 'complete':
          updatedTrip = await finishTripSuccess(trip.id, {
            arrival_time: new Date(updateStatusModal.datetime).toISOString()
          });
          break;
        case 'fail':
          updatedTrip = await finishTripFailure(trip.id, {
            arrival_time: new Date(updateStatusModal.datetime).toISOString()
          });
          break;
        case 'cancel':
          updatedTrip = await cancelTrip(trip.id);
          break;
        default:
          throw new Error('Invalid action');
      }

      trip = updatedTrip;
      closeUpdateStatus();
    } catch (error) {
      console.error('Failed to update status:', error);
      updateStatusError = 'Failed to update trip status. Please try again.';
    }
  }

  function openAddNote() {
    addNoteModal = {
      isOpen: true,
      content: ''
    };
    addNoteError = null;
  }

  function closeAddNote() {
    addNoteModal = {
      isOpen: false,
      content: ''
    };
    addNoteError = null;
  }

  async function handleAddNote() {
    if (!addNoteModal.content.trim()) return;

    try {
      addNoteError = null;
      
      const updatedTrip = await addTripNote(trip.id, {
        content: addNoteModal.content.trim()
      });

      trip = updatedTrip;
      closeAddNote();
    } catch (error) {
      console.error('Failed to add note:', error);
      addNoteError = 'Failed to add note. Please try again.';
    }
  }
</script>

<svelte:head>
  <title>
    {trip?.trip_number 
      ? `Trip #${trip.trip_number} Details`
      : 'Trip Details'} | Waybill
  </title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    {#if !trip}
      <div class="loading">Loading trip details...</div>
    {:else}
      <div class="page-header">
        <div class="header-content">
          <a href="/trips" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Trip Management
          </a>
          <div class="title-section">
            <div class="trip-header">
              <div class="title-info">
                <h1 class="page-title">Trip #{trip.trip_number}</h1>
                <span class="trip-cargo">{trip.cargo.description}</span>
              </div>
              <span class="status-badge {trip.status.toLowerCase()}">
                {formatStatusLabel(trip.status)}
              </span>
            </div>
            <div class="trip-metrics">
              <div class="metric">
                <span class="metric-label">Distance</span>
                <span class="metric-value">{formatNumber(trip.distance_miles)} mi</span>
              </div>
              <div class="metric">
                <span class="metric-label">Fuel Usage</span>
                <span class="metric-value">{formatNumber(trip.fuel_usage_gallons)} gal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <Card title="Schedule Information" icon={icons.calendar}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Departure (Scheduled)</span>
                <span class="value">{formatDate(trip.departure_time.scheduled)}</span>
                {#if trip.departure_time.actual}
                  <span class="sub-value">Actual: {formatDate(trip.departure_time.actual)}</span>
                {/if}
              </div>
              <div class="detail-item">
                <span class="label">Arrival (Scheduled)</span>
                <span class="value">{formatDate(trip.arrival_time.scheduled)}</span>
                {#if trip.arrival_time.actual}
                  <span class="sub-value">Actual: {formatDate(trip.arrival_time.actual)}</span>
                {/if}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Cargo Details" icon={icons.box}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Description</span>
                <span class="value">{trip.cargo.description}</span>
              </div>
              <div class="detail-item">
                <span class="label">Weight</span>
                <span class="value">{formatNumber(trip.cargo.weight)} lbs</span>
              </div>
            </div>
            {#if trip.cargo.hazmat}
              <div class="hazmat-warning">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2"/>
                </svg>
                Hazardous Materials
              </div>
            {/if}
          </div>
        </Card>

        <Card title="Trip Notes" icon={icons.notes}>
          <div class="detail-group">
            <div class="notes-list">
              {#each trip.notes as note}
                <div class="note">
                  <div class="note-content">
                    <span class="note-time">{formatDate(note.note_timestamp)}</span>
                    <p>{note.content}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </Card>

        <Card title="Record Details" icon={icons.chart}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Created</span>
                <span class="value">{formatDate(trip.created_at)}</span>
              </div>
              <div class="detail-item">
                <span class="label">Last Updated</span>
                <span class="value">{formatDate(trip.updated_at)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div class="action-buttons">
        {#if ['SCHEDULED', 'IN_TRANSIT'].includes(trip.status)}
          <button class="action-button primary" on:click={openUpdateStatus}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Update Status
          </button>
        {/if}
        <button class="action-button" on:click={openAddNote}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Add Note
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
          </svg>
          View Analytics
        </button>
      </div>
    {/if}
  </div>

  {#if updateStatusModal.isOpen}
    <div class="modal-backdrop" on:click={closeUpdateStatus}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Update Trip Status</h3>
          <button class="modal-close" on:click={closeUpdateStatus}>×</button>
        </div>
        <div class="modal-body">
          {#if updateStatusError}
            <div class="error-message">
              {updateStatusError}
            </div>
          {/if}

          <div class="form-group">
            <label for="status-action">Action</label>
            <select 
              id="status-action"
              bind:value={updateStatusModal.selectedAction}
              class="form-select"
            >
              <option value="">Select an action...</option>
              {#each getAvailableActions(updateStatusModal.currentStatus) as action}
                <option value={action.value}>{action.label}</option>
              {/each}
            </select>
          </div>

          {#if updateStatusModal.selectedAction && updateStatusModal.selectedAction !== 'cancel'}
            <div class="form-group">
              <label for="status-datetime">
                {updateStatusModal.selectedAction === 'begin' ? 'Departure' : 'Arrival'} Time
              </label>
              <input
                type="datetime-local"
                id="status-datetime"
                bind:value={updateStatusModal.datetime}
                class="form-input"
              />
            </div>
          {/if}
        </div>
        <div class="modal-footer">
          <button class="action-button" on:click={closeUpdateStatus}>Cancel</button>
          <button 
            class="action-button primary"
            on:click={handleUpdateStatus}
            disabled={!updateStatusModal.selectedAction}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if addNoteModal.isOpen}
    <div class="modal-backdrop" on:click={closeAddNote}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Add Note</h3>
          <button class="modal-close" on:click={closeAddNote}>×</button>
        </div>
        <div class="modal-body">
          {#if addNoteError}
            <div class="error-message">
              {addNoteError}
            </div>
          {/if}
          <textarea
            bind:value={addNoteModal.content}
            placeholder="Enter note content..."
            rows="4"
            class="form-input"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="action-button" on:click={closeAddNote}>Cancel</button>
          <button 
            class="action-button primary"
            on:click={handleAddNote}
            disabled={!addNoteModal.content.trim()}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  {/if}
</Layout>

<style>
  .page-header {
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
  }

  .back-link:hover {
    color: var(--theme-color);
  }

  .title-section {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .trip-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .title-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .trip-cargo {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.scheduled {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .status-badge.in_progress {
    background: #dcfce7;
    color: #15803d;
  }

  .status-badge.completed {
    background: #f3f4f6;
    color: #4b5563;
  }

  .status-badge.canceled {
    background: #fee2e2;
    color: #dc2626;
  }

  .trip-metrics {
    display: flex;
    gap: 2rem;
  }

  .metric {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .metric-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .metric-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--theme-color);
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .detail-group {
    padding: 1.5rem;
  }

  .detail-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .detail-row:last-child {
    margin-bottom: 0;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .value {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .sub-value {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .hazmat-warning {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 8px;
    font-weight: 600;
    margin-top: 1rem;
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .note {
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
  }

  .note-time {
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 0.25rem;
  }

  .note p {
    margin: 0;
    color: var(--text-primary);
    line-height: 1.5;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: white;
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .action-button.primary {
    background: var(--theme-color);
    color: white;
    border-color: var(--theme-color);
  }

  .action-button.primary:hover {
    background: var(--theme-color-dark);
    border-color: var(--theme-color-dark);
    color: white;
  }

  @media (max-width: 768px) {
    .trip-metrics {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .metric {
      align-items: flex-start;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .trip-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
      justify-content: center;
    }
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 500px;
    box-shadow: var(--shadow-lg);
  }

  .modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
  }

  .modal-close:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
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

  .error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
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
</style> 