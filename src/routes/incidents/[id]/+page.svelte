<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { icons } from '$lib/icons';
  import { formatCurrency, formatDate } from '$lib/utils/format';
  import type { IncidentReport } from '$lib/api/incidents';
  
  let isNavExpanded = true;
  
  export let data;
  const incident: IncidentReport | null = data.incident ?? null;
</script>

<svelte:head>
  <title>Incident #{incident?.id ?? ''} Details | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    {#if !incident}
      <div class="loading">Loading incident details...</div>
    {:else}
      <a href="/incidents" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Incidents
      </a>

      <div class="incident-header">
        <div class="header-top">
          <div class="incident-id">
            <h1>Incident Report</h1>
            <div class="id-number">#{incident.id}</div>
          </div>
          
          <div class="header-controls">
            <button class="edit-control">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z"/>
              </svg>
              Schedule Repair
            </button>
            <button class="edit-control">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Report
            </button>
          </div>
        </div>

        <div class="incident-meta">
          <StatusBadge status={incident.type} type="incident" />
          <div class="meta-divider"></div>
          <div class="date-reported">
            <span class="label">DATE REPORTED</span>
            <span class="value">{formatDate(incident.date)}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="damage-estimate">
            <span class="label">ESTIMATED DAMAGE</span>
            <span class="value highlight">{formatCurrency(incident.damage_estimate)}</span>
          </div>
        </div>
      </div>

      <div class="resource-page-details-grid">
        <Card title="Driver Information" icon={icons.drivers}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Driver Name</span>
                <a href="/drivers/{incident.driver.id}" class="resource-page-detail-value highlight link">
                  {incident.driver.first_name} {incident.driver.last_name}
                </a>
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
                <a href="/trucks/{incident.truck.id}" class="resource-page-detail-value highlight link">
                  {incident.truck.truck_number}
                </a>
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

        <Card title="Incident Details" icon={icons.incidents}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item full-width">
                <span class="resource-page-detail-label">Location</span>
                <span class="resource-page-detail-value">{incident.location}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item full-width">
                <span class="resource-page-detail-label">Description</span>
                <p class="resource-page-detail-value description">{incident.description}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Trip Information" icon={icons.routes}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Trip Number</span>
                <a href="/trips/{incident.trip.id}" class="resource-page-detail-value mono link">
                  {incident.trip.trip_number}
                </a>
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
    {/if}
  </div>
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

  .value.highlight {
    color: var(--theme-color);
    font-size: var(--font-size-xl);
    font-weight: 600;
  }

  .edit-control {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: rgb(99, 102, 241);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .edit-control:hover {
    background: rgb(79, 82, 231);
  }

  @media (max-width: 1400px) {
    .id-number {
      font-size: var(--font-size-2xl);
      word-break: break-all;
    }
  }

  @media (max-width: 1200px) {
    .header-top {
      gap: var(--spacing-md);
    }

    .incident-meta {
      gap: var(--spacing-md);
    }

    .incident-id h1 {
      font-size: var(--font-size-lg);
    }
  }

  @media (max-width: 768px) {
    .incident-header {
      padding: var(--spacing-lg);
      margin: var(--spacing-md) 0 var(--spacing-xl);
    }

    .header-top {
      margin-bottom: var(--spacing-lg);
    }

    .incident-id h1 {
      font-size: var(--font-size-lg);
    }

    .id-number {
      font-size: var(--font-size-2xl);
    }

    .edit-control {
      padding: var(--spacing-sm) var(--spacing-md);
    }

    .incident-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }

    .meta-divider {
      height: 20px;
    }

    .value {
      font-size: var(--font-size-md);
    }

    .value.highlight {
      font-size: var(--font-size-lg);
    }
  }

  @media (max-width: 480px) {
    .header-top {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-md);
    }

    .incident-id {
      margin-bottom: 0;
    }

    .edit-control {
      width: 100%;
      justify-content: center;
    }

    .incident-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .meta-divider {
      display: none;
    }

    .date-reported,
    .damage-estimate {
      width: 100%;
    }
  }

  .header-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
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

  .link {
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .link:hover {
    color: var(--theme-color-dark);
    text-decoration: underline;
  }
</style> 