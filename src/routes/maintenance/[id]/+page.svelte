<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { formatCurrency, formatDate } from '$lib/utils/format';
  import type { MaintenanceLog } from '$lib/api/maintenance';
  
  let isNavExpanded = true;
  
  export let data;
  const maintenance: MaintenanceLog = data.maintenance;

  function formatServiceType(type: string): string {
    return type.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }
</script>

<svelte:head>
  <title>
    {maintenance?.truck?.truck_number 
      ? `Maintenance Details | ${maintenance.truck.truck_number}`
      : 'Maintenance Details'} | Waybill
  </title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    {#if !maintenance}
      <div class="loading">Loading maintenance details...</div>
    {:else}
      <a href="/maintenance" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Maintenance Management
      </a>

      <div class="incident-header">
        <div class="header-top">
          <div class="incident-id">
            <h1>Maintenance Record</h1>
            <div class="id-number">{maintenance.truck.make} {maintenance.truck.model}</div>
          </div>
          
          <div class="header-controls">
            <button class="edit-control">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Record
            </button>
            <a href={`/trucks/${maintenance.truck.id}`} class="action-button">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18 18.5v-1c0-.8-.7-1.5-1.5-1.5H13v6h1.5v-2h1.1l.9 2H18l-.9-2.1c.5-.3.9-.8.9-1.4zm-3 0v-1h1.5v1H15zm-5.5-1H7c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h2.5c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5zm0 4.5H7v-3h2.5v3zm11-9.5h-1.8l1.8-2v2zm.2-5H15v3h-2V5H4v14h6v2h8v-2h2v-2h2V7.5c0-.8-.7-1.5-1.5-1.5zM18 15h-2v2h2v-2z"/>
              </svg>
              View Vehicle
            </a>
          </div>
        </div>

        <div class="incident-meta">
          <span class="service-badge {maintenance.service_type.toLowerCase()}">
            {formatServiceType(maintenance.service_type)}
          </span>
          <div class="meta-divider"></div>
          <div class="date-reported">
            <span class="label">SERVICE DATE</span>
            <span class="value">{formatDate(maintenance.date)}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="damage-estimate">
            <span class="label">SERVICE COST</span>
            <span class="value highlight">{formatCurrency(maintenance.cost)}</span>
          </div>
        </div>
      </div>

      <div class="resource-page-details-grid">
        <Card title="Service Information" icon={icons.maintenance}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Service Date</span>
                <span class="resource-page-detail-value highlight">{formatDate(maintenance.date)}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Service Type</span>
                <span class="resource-page-detail-value">{formatServiceType(maintenance.service_type)}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Mechanic</span>
                <span class="resource-page-detail-value">{maintenance.mechanic}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Location</span>
                <span class="resource-page-detail-value">{maintenance.location}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item full-width">
                <span class="resource-page-detail-label">Service Notes</span>
                <span class="resource-page-detail-value notes">{maintenance.notes}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Vehicle Information" icon={icons.truck}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Vehicle</span>
                <span class="resource-page-detail-value highlight">{maintenance.truck.make} {maintenance.truck.model} ({maintenance.truck.year})</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">VIN</span>
                <span class="resource-page-detail-value mono">{maintenance.truck.vin}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Current Mileage</span>
                <span class="resource-page-detail-value">{formatNumber(maintenance.truck.mileage)} miles</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">License Plate</span>
                <span class="resource-page-detail-value mono">{maintenance.truck.license_plate.number} ({maintenance.truck.license_plate.state})</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Record Details" icon={icons.chart}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Created</span>
                <span class="resource-page-detail-value">{formatDate(maintenance.created_at)}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Last Updated</span>
                <span class="resource-page-detail-value">{formatDate(maintenance.updated_at)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    {/if}
  </div>
</Layout>

<style>
  /* Remove old styles for these elements */
  .truck-number,
  .resource-page-header,
  .resource-page-header-content,
  .resource-page-title-section,
  .resource-page-title-info,
  .cost-display,
  .cost-label,
  .cost-value {
    /* These styles will be removed */
  }

  /* Add new header styles */
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

  .header-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
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
    text-decoration: none;
  }

  /* Keep existing service badge styles */
  .service-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .service-badge.routine_maintenance {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .service-badge.repair {
    background: #fef3c7;
    color: #d97706;
  }

  .service-badge.emergency {
    background: #fee2e2;
    color: #dc2626;
  }

  @media (max-width: 480px) {
    .header-controls {
      flex-direction: column;
      width: 100%;
    }

    .header-controls button,
    .header-controls a {
      width: 100%;
      justify-content: center;
    }
  }
</style> 