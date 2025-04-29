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

  console.log(trip);

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
      <a href="/trips" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Trip Management
      </a>

      <div class="incident-header">
        <div class="header-top">
          <div class="incident-id">
            <h1>Trip Details</h1>
            <div class="id-number">#{trip.trip_number}</div>
          </div>
          
          <div class="header-controls">
            {#if ['SCHEDULED', 'IN_TRANSIT'].includes(trip.status)}
              <button class="action-button primary" on:click={openUpdateStatus}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Update Status
              </button>
            {/if}
            <button class="action-button primary" on:click={openAddNote}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Add Note
            </button>
          </div>
        </div>

        <div class="incident-meta">
          <StatusBadge status={trip.status} type="trip" />
          <div class="meta-divider"></div>
          <div class="date-reported">
            <span class="label">DEPARTURE</span>
            <span class="value">{formatDate(trip.departure_time.scheduled)}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="damage-estimate">
            <span class="label">ARRIVAL</span>
            <span class="value">{formatDate(trip.arrival_time.scheduled)}</span>
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

        <Card title="Trip Resources" icon={icons.truck}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Driver</span>
                {#if trip.driver}
                  <a 
                    href="/drivers/{trip.driver.id}" 
                    class="resource-page-detail-value link"
                  >
                    {trip.driver.first_name} {trip.driver.last_name}
                  </a>
                  <span class="sub-value">Employee #{trip.driver.id}</span>
                {:else}
                  <span class="resource-page-detail-value">No driver assigned</span>
                {/if}
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Truck</span>
                {#if trip.truck}
                  <a 
                    href="/trucks/{trip.truck.id}" 
                    class="resource-page-detail-value link"
                  >
                    Unit #{trip.truck.id}
                  </a>
                  <span class="sub-value">{trip.truck.make} {trip.truck.model}</span>
                {:else}
                  <span class="resource-page-detail-value">No truck assigned</span>
                {/if}
              </div>
            </div>

            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Origin Facility</span>
                {#if trip.start_facility}
                  <a 
                    href="/facilities/{trip.start_facility.id}" 
                    class="resource-page-detail-value link"
                  >
                    {trip.start_facility.name}
                  </a>
                  <span class="sub-value">{trip.start_facility.address.city}, {trip.start_facility.address.state}</span>
                {:else}
                  <span class="resource-page-detail-value">No origin facility specified</span>
                {/if}
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Destination Facility</span>
                {#if trip.end_facility}
                  <a 
                    href="/facilities/{trip.end_facility.id}" 
                    class="resource-page-detail-value link"
                  >
                    {trip.end_facility.name}
                  </a>
                  <span class="sub-value">{trip.end_facility.address.city}, {trip.end_facility.address.state}</span>
                {:else}
                  <span class="resource-page-detail-value">No destination facility specified</span>
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
  .incident-header {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin: var(--spacing-lg) 0 var(--spacing-2xl);
    max-width: 100%;
    overflow: hidden;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
    gap: var(--spacing-lg);
  }

  .incident-id {
    flex: 1;
    min-width: 280px;
  }

  .incident-id h1 {
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    font-weight: 500;
    margin: 0 0 var(--spacing-xs);
  }

  .id-number {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-primary);
    font-family: var(--font-mono);
    letter-spacing: -0.5px;
  }

  .incident-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
  }

  .meta-divider {
    width: 1px;
    height: 24px;
    background: var(--border-color);
  }

  .date-reported,
  .damage-estimate {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: var(--font-size-md);
    color: var(--text-primary);
    font-weight: 500;
  }

  .header-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: white;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    white-space: nowrap;
  }

  .action-button.primary {
    background: rgb(99, 102, 241);
    color: white;
    border: none;
  }

  .action-button.primary:hover {
    background: rgb(79, 82, 231);
  }

  @media (max-width: 480px) {
    .header-controls {
      flex-direction: column;
      width: 100%;
    }

    .header-controls button {
      width: 100%;
      justify-content: center;
    }
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

  .link {
    color: rgb(99, 102, 241);
    text-decoration: none;
  }

  .link:hover {
    text-decoration: underline;
  }
</style> 