<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import LoadErrorMessage from '$lib/components/LoadErrorMessage.svelte';
  import { icons } from '$lib/icons';
  import type { Trip, TripNote } from '$lib/api/trips';
  import { getTrips, addTripNote, beginTrip, finishTripSuccess, finishTripFailure, cancelTrip, type TripStatus } from '$lib/api/trips';
  import AddNoteModal from '$lib/components/AddNoteModal.svelte';
  import UpdateStatusModal from '$lib/components/UpdateStatusModal.svelte';
  
  let isNavExpanded = true;

  export let data;
  let trips: Trip[] = data.trips || [];
  let error = data.error;

  // Make stats calculation reactive based on trips data
  $: stats = trips ? {
    active: trips.filter(t => t.status === 'IN_PROGRESS').length,
    scheduled: trips.filter(t => t.status === 'SCHEDULED').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
    totalMiles: trips.reduce((sum, trip) => sum + trip.distance_miles, 0),
    totalFuel: trips.reduce((sum, trip) => sum + trip.fuel_usage_gallons, 0)
  } : {
    active: 0,
    scheduled: 0,
    completed: 0,
    totalMiles: 0,
    totalFuel: 0
  };

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedStatus: string = 'ALL';
  let sortField: 'departure_time' | 'arrival_time' | 'trip_number' = 'departure_time';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Status options
  const rawStatusTypes = ['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];
  const statusTypes = rawStatusTypes.map(status => ({
    value: status,
    label: formatStatusLabel(status)
  }));

  function formatStatusLabel(status: string): string {
    if (status === 'ALL') return 'All Statuses';
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Filtered and sorted records
  $: filteredRecords = trips
    .filter(trip => {
      const matchesSearch = searchQuery === '' || 
        trip.trip_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.cargo.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || 
        trip.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'departure_time':
          comparison = new Date(b.departure_time.scheduled).getTime() - new Date(a.departure_time.scheduled).getTime();
          break;
        case 'arrival_time':
          comparison = new Date(b.arrival_time.scheduled).getTime() - new Date(a.arrival_time.scheduled).getTime();
          break;
        case 'trip_number':
          comparison = a.trip_number.localeCompare(b.trip_number);
          break;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });

  // Update filtered records to include pagination
  $: paginatedRecords = filteredRecords
    .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  $: totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Reset to first page when filters change
  $: if (searchQuery || selectedStatus) {
    currentPage = 1;
  }

  function handleSort(field: string) {
    if (field === 'departure_time' || field === 'arrival_time' || field === 'trip_number') {
      if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortDirection = 'desc';
      }
    }
  }

  // Add this to track expanded state for each trip
  let expandedNotes: { [key: string]: boolean } = {};

  function toggleNotes(tripId: string) {
    expandedNotes[tripId] = !expandedNotes[tripId];
  }

  // Remove the AddNoteModal interface and simplify the state
  let isAddNoteModalOpen = false;
  let currentTripId: string | null = null;

  // Simplify the open/close functions
  function openAddNote(tripId: string) {
    currentTripId = tripId;
    isAddNoteModalOpen = true;
  }

  function closeAddNote() {
    currentTripId = null;
    isAddNoteModalOpen = false;
  }

  // Modify handleAddNote to work with the new component
  async function handleAddNote(noteContent: string) {
    if (!currentTripId) return;

    // Now updatedTrip contains the full updated trip data
    const updatedTrip = await addTripNote(currentTripId, {
      content: noteContent.trim()
    });

    // Update the trips array with the complete updated trip
    trips = trips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    );

    // Auto-expand notes for the trip that just got a new note
    expandedNotes[currentTripId] = true;
  }

  // Add error handling state
  let addNoteError: string | null = null;

  // Add this reactive statement to update sort buttons when sort state changes
  $: sortButtons = [
    {
      field: 'departure_time',
      label: 'Departure',
      active: sortField === 'departure_time',
      direction: sortField === 'departure_time' ? sortDirection : undefined
    },
    {
      field: 'arrival_time',
      label: 'Arrival',
      active: sortField === 'arrival_time',
      direction: sortField === 'arrival_time' ? sortDirection : undefined
    },
    {
      field: 'trip_number',
      label: 'Trip #',
      active: sortField === 'trip_number',
      direction: sortField === 'trip_number' ? sortDirection : undefined
    }
  ];

  // Replace the UpdateStatusModal interface and state with:
  let isUpdateStatusModalOpen = false;
  let currentTripForUpdate: {
    id: string;
    status: TripStatus;
  } | null = null;

  // Simplify the open/close functions
  function openUpdateStatus(trip: Trip) {
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

  // Modify handleUpdateStatus to work with the new component
  async function handleUpdateStatus(action: string, datetime?: string) {
    if (!currentTripForUpdate?.id) return;
    if (action !== 'cancel' && !datetime) return;

    // Convert datetime to proper ISO format with UTC timezone
    const formattedDatetime = datetime ? new Date(datetime).toISOString() : undefined;

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

    trips = trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip);
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
</script>

<svelte:head>
  <title>Trip Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Trip Management</h1>
    
    {#if error}
      <LoadErrorMessage message={error} />
    {:else}
      <div class="stats-grid">
        <Card title="Active Trips" icon={icons.trips}>
          <div class="stat-content">
            <p class="stat-number">{stats.active}</p>
            <p class="stat-label">In Progress</p>
          </div>
        </Card>

        <Card title="Scheduled" icon={icons.trips}>
          <div class="stat-content">
            <p class="stat-number">{stats.scheduled}</p>
            <p class="stat-label">Upcoming</p>
          </div>
        </Card>

        <Card title="Total Distance" icon={icons.trips}>
          <div class="stat-content">
            <p class="stat-number">{formatNumber(stats.totalMiles)}</p>
            <p class="stat-label">Miles</p>
          </div>
        </Card>
      </div>

      <Card title="Trip Records" icon={icons.trips}>
        <ListControls
          searchPlaceholder="Search trips..."
          bind:searchQuery
          bind:selectedFilter={selectedStatus}
          filterOptions={rawStatusTypes}
          formatFilterLabel={formatStatusLabel}
          {sortButtons}
          addNewHref="/trips/new"
          addNewLabel="Create Trip"
          onSearch={(value) => searchQuery = value}
          onFilterChange={(value) => selectedStatus = value}
          onSort={handleSort}
        />

        <div class="results-summary">
          Showing {filteredRecords.length} of {trips.length} trips
        </div>

        <div class="records-list">
          {#each paginatedRecords as trip}
            <div class="record-item">
              <div class="record-header">
                <div class="record-title">
                  <h3>Trip #{trip.trip_number}</h3>
                  <span class="status-badge {trip.status.toLowerCase()}">
                    {trip.status.replace('_', ' ')}
                  </span>
                </div>
                {#if trip.cargo.hazmat}
                  <span class="hazmat-badge">HAZMAT</span>
                {/if}
              </div>

              <div class="record-details">
                <div class="detail-group">
                  <div class="detail">
                    <span class="label">Departure:</span>
                    <span class="value">{formatDate(trip.departure_time.scheduled)}</span>
                    {#if trip.departure_time.actual}
                      <span class="actual-time">Actual: {formatDate(trip.departure_time.actual)}</span>
                    {/if}
                  </div>
                  <div class="detail">
                    <span class="label">Arrival:</span>
                    <span class="value">{formatDate(trip.arrival_time.scheduled)}</span>
                    {#if trip.arrival_time.actual}
                      <span class="actual-time">Actual: {formatDate(trip.arrival_time.actual)}</span>
                    {/if}
                  </div>
                </div>

                <div class="detail-group">
                  <div class="detail">
                    <span class="label">Cargo:</span>
                    <span class="value">{trip.cargo.description}</span>
                    <span class="sub-value">{formatNumber(trip.cargo.weight)} lbs</span>
                  </div>
                  <div class="detail">
                    <span class="label">Distance:</span>
                    <span class="value">{formatNumber(trip.distance_miles)} miles</span>
                    <span class="sub-value">{formatNumber(trip.fuel_usage_gallons)} gal. fuel</span>
                  </div>
                </div>
              </div>

              {#if trip.notes.length > 0}
                <div class="trip-notes">
                  <div class="notes-header">
                    <span class="notes-count">{trip.notes.length} Note{trip.notes.length > 1 ? 's' : ''}</span>
                    {#if trip.notes.length > 1}
                      <button 
                        class="notes-toggle" 
                        on:click={() => toggleNotes(trip.id)}
                      >
                        {expandedNotes[trip.id] ? 'Show Less' : 'View All'}
                      </button>
                    {/if}
                  </div>
                  
                  {#if expandedNotes[trip.id]}
                    {#each [...trip.notes].reverse() as note}
                      <div class="note">
                        <div class="note-content">
                          <span class="note-time">{formatDate(note.note_timestamp)}</span>
                          <p>{note.content}</p>
                        </div>
                      </div>
                    {/each}
                  {:else}
                    <div class="note latest-note">
                      <div class="note-content">
                        <span class="note-time">{formatDate(trip.notes[trip.notes.length - 1].note_timestamp)}</span>
                        <p>{trip.notes[trip.notes.length - 1].content}</p>
                      </div>
                      {#if trip.notes.length > 1}
                        <div class="note-indicator">+{trip.notes.length - 1}</div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/if}

              <div class="record-actions">
                <a href="/trips/{trip.id}" class="action-button">View Details</a>
                {#if ['SCHEDULED', 'IN_TRANSIT'].includes(trip.status)}
                  <button class="action-button" on:click={() => openUpdateStatus(trip)}>
                    Update Status
                  </button>
                {/if}
                <button class="action-button" on:click={() => openAddNote(trip.id)}>
                  Add Note
                </button>
              </div>
            </div>
          {/each}
        </div>

        <div class="pagination">
          <div class="pagination-info">
            Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} trips
          </div>
          <div class="pagination-controls">
            <button 
              class="page-button"
              disabled={currentPage === 1}
              on:click={() => goToPage(1)}
              title="First page"
            >
              ««
            </button>
            <button 
              class="page-button"
              disabled={currentPage === 1}
              on:click={() => goToPage(currentPage - 1)}
              title="Previous page"
            >
              «
            </button>
            
            {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
              {#if page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)}
                <button 
                  class="page-button"
                  class:active={page === currentPage}
                  on:click={() => goToPage(page)}
                >
                  {page}
                </button>
              {:else if page === currentPage - 3 || page === currentPage + 3}
                <span class="page-ellipsis">...</span>
              {/if}
            {/each}

            <button 
              class="page-button"
              disabled={currentPage === totalPages}
              on:click={() => goToPage(currentPage + 1)}
              title="Next page"
            >
              »
            </button>
            <button 
              class="page-button"
              disabled={currentPage === totalPages}
              on:click={() => goToPage(totalPages)}
              title="Last page"
            >
              »»
            </button>
          </div>
        </div>
      </Card>
    {/if}
  </div>

  <!-- Add this modal markup just before the closing Layout tag -->
  <AddNoteModal
    isOpen={isAddNoteModalOpen}
    onClose={closeAddNote}
    onSubmit={handleAddNote}
  />

  <UpdateStatusModal
    isOpen={isUpdateStatusModalOpen}
    onClose={closeUpdateStatus}
    onSubmit={handleUpdateStatus}
    availableActions={currentTripForUpdate ? getAvailableActions(currentTripForUpdate.status) : []}
  />
</Layout>

<style>
  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.scheduled {
    background: #dbeafe;
    color: #2563eb;
  }

  .status-badge.in_progress {
    background: #fef3c7;
    color: #d97706;
  }

  .status-badge.completed {
    background: #dcfce7;
    color: #059669;
  }

  .status-badge.canceled {
    background: #fee2e2;
    color: #dc2626;
  }

  .status-badge.failed_delivery {
    background: #fae8ff;
    color: #9d174d;
  }

  .hazmat-badge {
    background: #fecaca;
    color: #b91c1c;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .detail-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .actual-time {
    font-size: 0.875rem;
    color: var(--theme-color);
    font-style: italic;
  }

  .trip-notes {
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .notes-count {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .notes-toggle {
    background: none;
    border: none;
    color: var(--theme-color);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
  }

  .notes-toggle:hover {
    text-decoration: underline;
  }

  .note {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    border-radius: 6px;
    background: var(--bg-secondary);
  }

  .note-content {
    flex: 1;
    min-width: 0;
  }

  .note-time {
    font-size: 0.75rem;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 0.25rem;
  }

  .note p {
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.4;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .note-indicator {
    background: var(--theme-color);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    min-width: 1.5rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    .trip-notes {
      padding: 0.5rem;
    }
    
    .note {
      padding: 0.5rem;
    }
  }

  /* Add these new styles */
  .note + .note {
    margin-top: 0.5rem;
  }

  .latest-note p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Other notes can wrap */
  .note:not(.latest-note) p {
    white-space: normal;
    overflow: visible;
  }

  /* Add these new styles */
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

  .error-message {
    text-align: center;
    padding: 2rem;
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
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