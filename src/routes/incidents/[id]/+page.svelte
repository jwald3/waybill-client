<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { icons } from '$lib/icons';
  import { formatCurrency, formatDate } from '$lib/utils/format';
  import type { IncidentReport } from '$lib/api/incidents';
  
  let isNavExpanded = true;
  
  export let data;
  const incident: IncidentReport = data.incident;
</script>

<svelte:head>
  <title>Incident #{incident?.id ?? ''} Details | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    {#if !incident}
      <div class="loading">Loading incident details...</div>
    {:else}
      <div class="page-header">
        <div class="resource-page-header-content">
          <a href="/incidents" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Incidents
          </a>
          <div class="title-section">
            <div class="incident-header">
              <div class="title-info">
                <h1 class="page-title">Incident Report #{incident.id}</h1>
                <span class="incident-date">{formatDate(incident.date)}</span>
              </div>
              <StatusBadge status={incident.type} type="incident" />
            </div>
            <div class="damage-display">
              <span class="damage-label">Estimated Damage</span>
              <span class="damage-value">{formatCurrency(incident.damage_estimate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <Card title="Driver Information" icon={icons.drivers}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Driver Name</span>
                <span class="value highlight">{incident.driver.first_name} {incident.driver.last_name}</span>
              </div>
              <div class="detail-item">
                <span class="label">License Number</span>
                <span class="value mono">{incident.driver.license_number}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Phone</span>
                <span class="value mono">{incident.driver.phone}</span>
              </div>
              <div class="detail-item">
                <span class="label">Email</span>
                <span class="value mono">{incident.driver.email}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Vehicle Details" icon={icons.truck}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Truck Number</span>
                <span class="value highlight">{incident.truck.truck_number}</span>
              </div>
              <div class="detail-item">
                <span class="label">Vehicle</span>
                <span class="value">{incident.truck.year} {incident.truck.make} {incident.truck.model}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">VIN</span>
                <span class="value mono">{incident.truck.vin}</span>
              </div>
              <div class="detail-item">
                <span class="label">License Plate</span>
                <span class="value">{incident.truck.license_plate.number} ({incident.truck.license_plate.state})</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Incident Details" icon={icons.incidents}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="label">Location</span>
                <span class="value">{incident.location}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="label">Description</span>
                <p class="value description">{incident.description}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Trip Information" icon={icons.routes}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Trip Number</span>
                <span class="value mono">{incident.trip.trip_number}</span>
              </div>
              <div class="detail-item">
                <span class="label">Trip Status</span>
                <StatusBadge status={incident.trip.status} type="trip" />
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Scheduled Departure</span>
                <span class="value">{formatDate(incident.trip.departure_time.scheduled)}</span>
              </div>
              <div class="detail-item">
                <span class="label">Scheduled Arrival</span>
                <span class="value">{formatDate(incident.trip.arrival_time.scheduled)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div class="action-buttons">
        <button class="action-button primary">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Edit Report
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z"/>
          </svg>
          Schedule Repair
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
          </svg>
          View Related Reports
        </button>
      </div>
    {/if}
  </div>
</Layout>

<style>
  .title-section {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .incident-header {
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

  .incident-date {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
  }

  .damage-display {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .damage-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .damage-value {
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

  .detail-item.full-width {
    grid-column: 1 / -1;
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

  .value.highlight {
    color: var(--theme-color);
    font-weight: 600;
  }

  .value.mono {
    font-family: monospace;
    letter-spacing: 0.5px;
  }

  .value.description {
    font-size: 1rem;
    line-height: 1.5;
    white-space: pre-wrap;
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
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-all);
  }

  .action-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
  }

  .action-button.primary {
    background: var(--theme-color);
    color: white;
    border-color: var(--theme-color);
  }

  .action-button.primary:hover {
    opacity: 0.9;
  }
</style> 