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
      <div class="page-header">
        <div class="header-content">
          <a href="/maintenance" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Maintenance Management
          </a>
          <div class="title-section">
            <div class="maintenance-header">
              <div class="title-info">
                <h1 class="page-title">{maintenance.truck.make} {maintenance.truck.model}</h1>
                <span class="truck-number">#{maintenance.truck.truck_number}</span>
              </div>
              <span class="service-badge {maintenance.service_type.toLowerCase()}">
                {formatServiceType(maintenance.service_type)}
              </span>
            </div>
            <div class="cost-display">
              <span class="cost-label">Service Cost</span>
              <span class="cost-value">{formatCurrency(maintenance.cost)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <Card title="Service Information" icon={icons.maintenance}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Service Date</span>
                <span class="value highlight">{formatDate(maintenance.date)}</span>
              </div>
              <div class="detail-item">
                <span class="label">Service Type</span>
                <span class="value">{formatServiceType(maintenance.service_type)}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Mechanic</span>
                <span class="value">{maintenance.mechanic}</span>
              </div>
              <div class="detail-item">
                <span class="label">Location</span>
                <span class="value">{maintenance.location}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="label">Service Notes</span>
                <span class="value notes">{maintenance.notes}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Vehicle Information" icon={icons.truck}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Vehicle</span>
                <span class="value highlight">{maintenance.truck.make} {maintenance.truck.model} ({maintenance.truck.year})</span>
              </div>
              <div class="detail-item">
                <span class="label">VIN</span>
                <span class="value mono">{maintenance.truck.vin}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Current Mileage</span>
                <span class="value">{formatNumber(maintenance.truck.mileage)} miles</span>
              </div>
              <div class="detail-item">
                <span class="label">License Plate</span>
                <span class="value mono">{maintenance.truck.license_plate.number} ({maintenance.truck.license_plate.state})</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Record Details" icon={icons.chart}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Created</span>
                <span class="value">{formatDate(maintenance.created_at)}</span>
              </div>
              <div class="detail-item">
                <span class="label">Last Updated</span>
                <span class="value">{formatDate(maintenance.updated_at)}</span>
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
          Edit Record
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          View Invoice
        </button>
        <a href={`/trucks/${maintenance.truck.id}`} class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18 18.5v-1c0-.8-.7-1.5-1.5-1.5H13v6h1.5v-2h1.1l.9 2H18l-.9-2.1c.5-.3.9-.8.9-1.4zm-3 0v-1h1.5v1H15zm-5.5-1H7c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h2.5c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5zm0 4.5H7v-3h2.5v3zm11-9.5h-1.8l1.8-2v2zm.2-5H15v3h-2V5H4v14h6v2h8v-2h2v-2h2V7.5c0-.8-.7-1.5-1.5-1.5zM18 15h-2v2h2v-2z"/>
          </svg>
          View Vehicle
        </a>
      </div>
    {/if}
  </div>
</Layout>

<style>
  .page-header {
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
  }

  .back-link:hover {
    color: var(--theme-color);
  }

  .title-section {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .maintenance-header {
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

  .truck-number {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
  }

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

  .cost-display {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .cost-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .cost-value {
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

  .value.notes {
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
    border-radius: 8px;
    background: white;
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .action-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .action-button.primary {
    background: var(--theme-color);
    color: white;
    border-color: var(--theme-color);
  }

  .action-button.primary:hover {
    background: var(--theme-color-dark);
    border-color: var(--theme-color-dark);
    color: white;
  }
</style> 