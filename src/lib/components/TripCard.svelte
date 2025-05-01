<script lang="ts">
  import type { Trip } from '$lib/api/trips';
  import StatusBadge from './StatusBadge.svelte';

  export let trip: Trip;
  export let onAddNote: (tripId: string) => void;
  export let onUpdateStatus: (trip: Trip) => void;
  export let expandedNotes: { [key: string]: boolean };

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

  function toggleNotes(tripId: string) {
    expandedNotes[tripId] = !expandedNotes[tripId];
  }
</script>

<div class="record-item">
  <div class="record-header">
    <div class="record-title">
      <h3>Trip #{trip.trip_number}</h3>
    </div>
    <StatusBadge status={trip.status} type="trip" />
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
    <a href="/trips/{trip.id}" class="centered-action-button">View Details</a>
    {#if ['SCHEDULED', 'IN_TRANSIT'].includes(trip.status)}
      <button class="centered-action-button" on:click={() => onUpdateStatus(trip)}>
        Update Status
      </button>
    {/if}
    <button class="centered-action-button" on:click={() => onAddNote(trip.id)}>
      Add Note
    </button>
  </div>
</div>

<style>
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

  .note + .note {
    margin-top: 0.5rem;
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
  }

  .latest-note p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .note:not(.latest-note) p {
    white-space: normal;
    overflow: visible;
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
</style> 