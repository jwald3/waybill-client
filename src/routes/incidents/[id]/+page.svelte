<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import IncidentCard from '$lib/components/IncidentCard.svelte';
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
          <div class="resource-page-title-section">
            <div class="resource-page-header">
              <div class="resource-page-title-info">
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

      <div class="resource-page-details-grid">
        <Card title="Driver Information" icon={icons.drivers}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Driver Name</span>
                <span class="resource-page-detail-value highlight">{incident.driver.first_name} {incident.driver.last_name}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">License Number</span>
                <span class="resource-page-detail-value mono">{incident.driver.license_number}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Phone</span>
                <span class="resource-page-detail-value mono">{incident.driver.phone}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Email</span>
                <span class="resource-page-detail-value mono">{incident.driver.email}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Vehicle Details" icon={icons.truck}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Truck Number</span>
                <span class="resource-page-detail-value highlight">{incident.truck.truck_number}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Vehicle</span>
                <span class="resource-page-detail-value">{incident.truck.year} {incident.truck.make} {incident.truck.model}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">VIN</span>
                <span class="resource-page-detail-value mono">{incident.truck.vin}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">License Plate</span>
                <span class="resource-page-detail-value">{incident.truck.license_plate.number} ({incident.truck.license_plate.state})</span>
              </div>
            </div>
          </div>
        </Card>

        <IncidentCard {incident} />

        <Card title="Trip Information" icon={icons.routes}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Trip Number</span>
                <span class="resource-page-detail-value mono">{incident.trip.trip_number}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Trip Status</span>
                <StatusBadge status={incident.trip.status} type="trip" />
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Scheduled Departure</span>
                <span class="resource-page-detail-value">{formatDate(incident.trip.departure_time.scheduled)}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Scheduled Arrival</span>
                <span class="resource-page-detail-value">{formatDate(incident.trip.arrival_time.scheduled)}</span>
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
      </div>
    {/if}
  </div>
</Layout>

<style>
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
</style> 