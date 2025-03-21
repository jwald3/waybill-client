<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import type { Facility } from '$lib/api/facilities';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  
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
        <div class="resource-page-header-content">
          <a href="/facilities" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Facility Management
          </a>
          <div class="resource-page-title-section">
            <div class="resource-page-header">
              <div class="resource-page-title-info">
                <h1 class="page-title">{facility.name}</h1>
                <span class="facility-number">#{facility.facility_number}</span>
              </div>
              <StatusBadge status={facility.type} type="facility" />
            </div>
            <div class="capacity-display">
              <span class="capacity-label">Parking Capacity</span>
              <span class="capacity-value">{formatNumber(facility.parking_capacity)} spaces</span>
            </div>
          </div>
        </div>
      </div>

      <div class="resource-page-details-grid">
        <Card title="Facility Information" icon={icons.facilities}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Facility Name</span>
                <span class="resource-page-detail-value highlight">{facility.name}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Facility Type</span>
                <span class="resource-page-detail-value">Type {facility.type}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Phone</span>
                <span class="resource-page-detail-value mono">{facility.contact_info.phone}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Email</span>
                <span class="resource-page-detail-value mono">{facility.contact_info.email}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Location Details" icon={icons.routes}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item full-width">
                <span class="resource-page-detail-label">Street Address</span>
                <span class="resource-page-detail-value">{facility.address.street}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">City</span>
                <span class="resource-page-detail-value">{facility.address.city}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">State</span>
                <span class="resource-page-detail-value">{facility.address.state}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">ZIP Code</span>
                <span class="resource-page-detail-value mono">{facility.address.zip}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Available Services" icon={icons.maintenance}>
          <div class="resource-page-detail-group">
            <div class="services-list">
              {#each facility.services_available as service}
                <span class="service-badge">{service}</span>
              {/each}
            </div>
          </div>
        </Card>

        <Card title="Record Details" icon={icons.chart}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Created</span>
                <span class="resource-page-detail-value">{formatDate(facility.created_at)}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Last Updated</span>
                <span class="resource-page-detail-value">{formatDate(facility.updated_at)}</span>
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
  .facility-number {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
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
</style> 