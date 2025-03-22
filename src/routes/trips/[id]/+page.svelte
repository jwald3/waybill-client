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
    addTripNote
  } from '$lib/api/trips';
  import UpdateStatusModal from '$lib/components/UpdateStatusModal.svelte';
  import AddNoteModal from '$lib/components/AddNoteModal.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  
  let isNavExpanded = true;
  
  export let data;
  let trip: Trip = data.trip;

  let isUpdateStatusModalOpen = false;
  let currentTripForUpdate: {
    id: string;
    status: TripStatus;
  } | null = null;

  let isAddNoteModalOpen = false;

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
    currentTripForUpdate = {
      id: trip.id,
      status: trip.status as TripStatus
    };
    isUpdateStatusModalOpen = true;
  }

  function closeUpdateStatus() {
    currentTripForUpdate = null;
    isUpdateStatusModalOpen = false;
  }

  async function handleUpdateStatus(action: string, datetime?: string) {
    if (!currentTripForUpdate?.id) return;
    if (action !== 'cancel' && !datetime) return;

    const formattedDatetime = datetime ? new Date(datetime).toISOString() : undefined;

    try {
      let updatedTrip: Trip;

      switch (action) {
        case 'begin':
          updatedTrip = await beginTrip(currentTripForUpdate.id, {
            departure_time: formattedDatetime!
          });
          break;
        case 'complete':
        case 'fail':
          updatedTrip = await (action === 'complete' ? finishTripSuccess : finishTripFailure)(currentTripForUpdate.id, {
            arrival_time: formattedDatetime!
          });
          break;
        case 'cancel':
          updatedTrip = await cancelTrip(currentTripForUpdate.id);
          break;
        default:
          throw new Error('Invalid action');
      }

      trip = updatedTrip;
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    }
  }

  function openAddNote() {
    isAddNoteModalOpen = true;
  }

  function closeAddNote() {
    isAddNoteModalOpen = false;
  }

  async function handleAddNote(noteContent: string) {
    const updatedTrip = await addTripNote(trip.id, {
      content: noteContent.trim()
    });

    trip = updatedTrip;
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
        <div class="resource-page-header-content">
          <a href="/trips" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Trip Management
          </a>
          <div class="title-section">
            <div class="resource-page-header">
              <div class="resource-page-title-info">
                <h1 class="page-title">Trip #{trip.trip_number}</h1>
                <span class="trip-cargo">{trip.cargo.description}</span>
              </div>
              <StatusBadge status={trip.status} type="trip" />
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

      <div class="resource-page-details-grid">
        <Card title="Schedule Information" icon={icons.calendar}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Departure (Scheduled)</span>
                <span class="resource-page-detail-value">{formatDate(trip.departure_time.scheduled)}</span>
                {#if trip.departure_time.actual}
                  <span class="sub-value">Actual: {formatDate(trip.departure_time.actual)}</span>
                {/if}
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Arrival (Scheduled)</span>
                <span class="resource-page-detail-value">{formatDate(trip.arrival_time.scheduled)}</span>
                {#if trip.arrival_time.actual}
                  <span class="sub-value">Actual: {formatDate(trip.arrival_time.actual)}</span>
                {/if}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Cargo Details" icon={icons.box}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Description</span>
                <span class="resource-page-detail-value">{trip.cargo.description}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Weight</span>
                <span class="resource-page-detail-value">{formatNumber(trip.cargo.weight)} lbs</span>
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
          <div class="resource-page-detail-group">
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
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Created</span>
                <span class="resource-page-detail-value">{formatDate(trip.created_at)}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Last Updated</span>
                <span class="resource-page-detail-value">{formatDate(trip.updated_at)}</span>
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
      </div>
    {/if}
  </div>

  <UpdateStatusModal
    isOpen={isUpdateStatusModalOpen}
    onClose={closeUpdateStatus}
    onSubmit={handleUpdateStatus}
    availableActions={currentTripForUpdate ? getAvailableActions(currentTripForUpdate.status) : []}
  />

  <AddNoteModal
    isOpen={isAddNoteModalOpen}
    onClose={closeAddNote}
    onSubmit={handleAddNote}
  />
</Layout>

<style>
  .trip-cargo {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
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

  @media (max-width: 768px) {
    .trip-metrics {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .metric {
      align-items: flex-start;
    }
  }
</style> 