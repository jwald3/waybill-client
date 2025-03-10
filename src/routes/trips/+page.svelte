<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import { icons } from '$lib/icons';
  import type { Trip, TripNote } from '$lib/api/trips';
  import { getTrips, addTripNote, beginTrip, finishTripSuccess, finishTripFailure, cancelTrip, type TripStatus } from '$lib/api/trips';
  
  let isNavExpanded = true;

  export let data;
  let trips: Trip[] = data.trips;

  // Make stats calculation reactive based on trips data
  $: stats = {
    active: trips.filter(t => t.status === 'IN_PROGRESS').length,
    scheduled: trips.filter(t => t.status === 'SCHEDULED').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
    totalMiles: trips.reduce((sum, trip) => sum + trip.distance_miles, 0),
    totalFuel: trips.reduce((sum, trip) => sum + trip.fuel_usage_gallons, 0)
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

  // Add these new interfaces/types
  interface AddNoteModal {
    isOpen: boolean;
    tripId: string | null;
    content: string;
  }

  // Add these new state variables
  let addNoteModal: AddNoteModal = {
    isOpen: false,
    tripId: null,
    content: ''
  };

  // Add these new functions
  function openAddNote(tripId: string) {
    addNoteModal = {
      isOpen: true,
      tripId,
      content: ''
    };
  }

  function closeAddNote() {
    addNoteModal = {
      isOpen: false,
      tripId: null,
      content: ''
    };
  }

  async function handleAddNote() {
    if (!addNoteModal.content.trim() || !addNoteModal.tripId) return;

    try {
      addNoteError = null; // Reset any previous errors
      
      // Now updatedTrip contains the full updated trip data
      const updatedTrip = await addTripNote(addNoteModal.tripId, {
        content: addNoteModal.content.trim()
      });

      // Update the trips array with the complete updated trip
      trips = trips.map(trip => 
        trip.id === updatedTrip.id ? updatedTrip : trip
      );

      // Auto-expand notes for the trip that just got a new note
      expandedNotes[addNoteModal.tripId] = true;

      closeAddNote();
    } catch (error) {
      console.error('Failed to add note:', error);
      addNoteError = 'Failed to add note. Please try again.';
    }
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

  // Add these new interfaces
  interface UpdateStatusModal {
    isOpen: boolean;
    tripId: string | null;
    currentStatus: TripStatus | null;
    selectedAction: string | null;
    datetime: string;
  }

  // Add this state
  let updateStatusModal: UpdateStatusModal = {
    isOpen: false,
    tripId: null,
    currentStatus: null,
    selectedAction: null,
    datetime: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDThh:mm
  };

  let updateStatusError: string | null = null;

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

  function openUpdateStatus(trip: Trip) {
    updateStatusModal = {
      isOpen: true,
      tripId: trip.id,
      currentStatus: trip.status as TripStatus,
      selectedAction: null,
      datetime: new Date().toISOString().slice(0, 16)
    };
    updateStatusError = null;
  }

  function closeUpdateStatus() {
    updateStatusModal = {
      isOpen: false,
      tripId: null,
      currentStatus: null,
      selectedAction: null,
      datetime: new Date().toISOString().slice(0, 16)
    };
    updateStatusError = null;
  }

  async function handleUpdateStatus() {
    if (!updateStatusModal.tripId || !updateStatusModal.selectedAction) return;

    try {
      updateStatusError = null;
      let updatedTrip: Trip;

      switch (updateStatusModal.selectedAction) {
        case 'begin':
          updatedTrip = await beginTrip(updateStatusModal.tripId, {
            departure_time: new Date(updateStatusModal.datetime).toISOString()
          });
          break;
        case 'complete':
          updatedTrip = await finishTripSuccess(updateStatusModal.tripId, {
            arrival_time: new Date(updateStatusModal.datetime).toISOString()
          });
          break;
        case 'fail':
          updatedTrip = await finishTripFailure(updateStatusModal.tripId, {
            arrival_time: new Date(updateStatusModal.datetime).toISOString()
          });
          break;
        case 'cancel':
          updatedTrip = await cancelTrip(updateStatusModal.tripId);
          break;
        default:
          throw new Error('Invalid action');
      }

      // Update the trips array with the updated trip
      trips = trips.map(trip => 
        trip.id === updatedTrip.id ? updatedTrip : trip
      );

      closeUpdateStatus();
    } catch (error) {
      console.error('Failed to update status:', error);
      updateStatusError = 'Failed to update trip status. Please try again.';
    }
  }
</script>

<svelte:head>
  <title>Trip Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Trip Management</h1>
    
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
  </div>

  <!-- Add this modal markup just before the closing Layout tag -->
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

  .modal-body textarea {
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

  .modal-body textarea:focus {
    outline: none;
    border-color: var(--theme-color);
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