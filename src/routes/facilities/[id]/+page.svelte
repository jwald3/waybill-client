<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import type { Facility } from '$lib/api/facilities';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import TabGroup from '$lib/components/TabGroup.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  let isNavExpanded = true;
  
  export let data;
  const facility: Facility | null = data.facility ?? null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: icons.facilities },
    { id: 'inventory', label: 'Inventory', icon: icons.box },
    { id: 'documents', label: 'Documents', icon: icons.document }
  ];

  let activeTab = 'overview';

  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (hash && tabs.some(tab => tab.id === hash)) {
      activeTab = hash;
    }
  });

  if (browser) {
    const url = new URL(window.location.href);
    url.hash = activeTab;
    goto(url.toString(), { replaceState: true });
  }

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
      <a href="/facilities" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Facility Management
      </a>

      <div class="incident-header">
        <div class="header-top">
          <div class="incident-id">
            <h1>Facility Profile</h1>
            <div class="id-number">{facility.name}</div>
          </div>
          
          <div class="header-controls button-group">
            <button class="button primary">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Details
            </button>
          </div>
        </div>

        <div class="incident-meta">
          <StatusBadge status={facility.type} type="facility" />
          <div class="meta-divider"></div>
          <div class="date-reported">
            <span class="label">FACILITY NUMBER</span>
            <span class="value">#{facility.facility_number}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="damage-estimate">
            <span class="label">PARKING CAPACITY</span>
            <span class="value highlight">{formatNumber(facility.parking_capacity)} spaces</span>
          </div>
        </div>
      </div>

      <TabGroup {tabs} bind:activeTab>
        {#if activeTab === 'overview'}
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
        {:else if activeTab === 'inventory'}
          <div class="inventory-section">
            <div class="empty-state">
              <p>Inventory management coming soon.</p>
            </div>
          </div>
        {:else if activeTab === 'maintenance'}
          <div class="maintenance-section">
            <div class="empty-state">
              <p>Facility maintenance records coming soon.</p>
            </div>
          </div>
        {:else if activeTab === 'documents'}
          <div class="documents">
            <div class="empty-state">
              <p>Document management coming soon.</p>
            </div>
          </div>
        {/if}
      </TabGroup>
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

  .inventory-section,
  .maintenance-section,
  .documents {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--text-secondary);
  }
</style> 