<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import type { Facility } from '$lib/api/facilities';
  
  let isNavExpanded = true;
  
  export let data;
  const facility: Facility = data.facility;

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }
</script>

<svelte:head>
  <title>{facility?.name ?? 'Facility'} Details | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    {#if !facility}
      <div class="loading">Loading facility details...</div>
    {:else}
      <div class="page-header">
        <div class="header-content">
          <a href="/facilities" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Facility Management
          </a>
          <div class="title-section">
            <div class="facility-header">
              <div class="title-info">
                <h1 class="page-title">{facility.name}</h1>
                <span class="facility-number">#{facility.facility_number}</span>
              </div>
              <span class="type-badge type-{facility.type.toLowerCase()}">
                TYPE {facility.type}
              </span>
            </div>
            <div class="capacity-display">
              <span class="capacity-label">Parking Capacity</span>
              <span class="capacity-value">{formatNumber(facility.parking_capacity)} spaces</span>
            </div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <Card title="Facility Information" icon={icons.facilities}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Facility Name</span>
                <span class="value highlight">{facility.name}</span>
              </div>
              <div class="detail-item">
                <span class="label">Facility Type</span>
                <span class="value">Type {facility.type}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Phone</span>
                <span class="value mono">{facility.contact_info.phone}</span>
              </div>
              <div class="detail-item">
                <span class="label">Email</span>
                <span class="value mono">{facility.contact_info.email}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Location Details" icon={icons.routes}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item full-width">
                <span class="label">Street Address</span>
                <span class="value">{facility.address.street}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">City</span>
                <span class="value">{facility.address.city}</span>
              </div>
              <div class="detail-item">
                <span class="label">State</span>
                <span class="value">{facility.address.state}</span>
              </div>
              <div class="detail-item">
                <span class="label">ZIP Code</span>
                <span class="value mono">{facility.address.zip}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Available Services" icon={icons.maintenance}>
          <div class="detail-group">
            <div class="services-list">
              {#each facility.services_available as service}
                <span class="service-badge">{service}</span>
              {/each}
            </div>
          </div>
        </Card>

        <Card title="Record Details" icon={icons.chart}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Created</span>
                <span class="value">{formatDate(facility.created_at)}</span>
              </div>
              <div class="detail-item">
                <span class="label">Last Updated</span>
                <span class="value">{formatDate(facility.updated_at)}</span>
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
          Edit Facility
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z"/>
          </svg>
          Schedule Maintenance
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
          </svg>
          View Reports
        </button>
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

  .facility-header {
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

  .facility-number {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
  }

  .type-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .type-badge.type-a {
    background: #dcfce7;
    color: #15803d;
  }

  .type-badge.type-b {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .type-badge.type-c {
    background: #fef9c3;
    color: #854d0e;
  }

  .capacity-display {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .capacity-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .capacity-value {
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

  .services-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .service-badge {
    padding: 0.5rem 1rem;
    background: color-mix(in srgb, var(--theme-color) 10%, transparent);
    color: var(--theme-color);
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
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