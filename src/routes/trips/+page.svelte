<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import LoadErrorMessage from '$lib/components/LoadErrorMessage.svelte';
  import { icons } from '$lib/icons';
  import type { Trip } from '$lib/api/trips';
  import { addTripNote, beginTrip, finishTripSuccess, finishTripFailure, cancelTrip, type TripStatus } from '$lib/api/trips';
  import AddNoteModal from '$lib/components/AddNoteModal.svelte';
  import UpdateStatusModal from '$lib/components/UpdateStatusModal.svelte';
  import TripCard from '$lib/components/TripCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import type { PageData } from './$types';
  import HomepageSummaryCard from '$lib/components/HomepageSummaryCard.svelte';
  export let data: PageData;

  let isNavExpanded = true;

  let trips: Trip[] = data.trips || [];
  let error = data.error;

  // Make stats calculation reactive based on trips data
  $: stats = trips ? {
    active: trips.filter(t => t.status === 'IN_TRANSIT').length,
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
			<LoadErrorMessage
				message={error}
				icon={icons.trips}
				title="Unable to Load Trips"
			/>
		{:else}
			<div class="stats-grid">
				<HomepageSummaryCard
          icon={icons.truck}
          title="Active Trips"
          value={stats.active}
          subtitle="In Progress"
        />
        <HomepageSummaryCard
          icon={icons.calendar}
          title="Scheduled Trips"
          value={stats.scheduled}
          subtitle="Upcoming"
        />
        <HomepageSummaryCard
          icon={icons.route}
          title="Total Distance"
          value={stats.totalMiles}
          subtitle="Miles"
        />
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
            <TripCard
              {trip}
              {expandedNotes}
              onAddNote={openAddNote}
              onUpdateStatus={openUpdateStatus}
            />
          {/each}
        </div>

        <Pagination
          {currentPage}
          {totalPages}
          totalItems={filteredRecords.length}
          itemsPerPage={recordsPerPage}
          onPageChange={goToPage}
        />
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
</style> 