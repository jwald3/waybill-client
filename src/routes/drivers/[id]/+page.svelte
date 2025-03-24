<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import type { Driver } from '$lib/api/drivers';
  import { 
    activateDriver, 
    suspendDriver, 
    terminateDriver, 
    type EmploymentStatus, 
    getAvailableStatusTransitions 
  } from '$lib/api/drivers';
  import DriverStatusModal from '$lib/components/DriverStatusModal.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';

  export let data;
  let driver: Driver = data.driver;
  
  let isNavExpanded = true;

  let isUpdateStatusModalOpen = false;
  let currentDriverStatus: EmploymentStatus | null = null;

  function openUpdateStatus() {
    if (!['ACTIVE', 'SUSPENDED'].includes(driver.employment_status)) {
      console.error('Invalid current status:', driver.employment_status);
      return;
    }
    
    currentDriverStatus = driver.employment_status as EmploymentStatus;
    isUpdateStatusModalOpen = true;
  }

  function closeUpdateStatus() {
    currentDriverStatus = null;
    isUpdateStatusModalOpen = false;
  }

  async function handleUpdateStatus(newStatus: EmploymentStatus) {
    try {
      let updatedDriver: Driver;

      switch (newStatus) {
        case 'ACTIVE':
          updatedDriver = await activateDriver(driver.id);
          break;
        case 'SUSPENDED':
          updatedDriver = await suspendDriver(driver.id);
          break;
        case 'TERMINATED':
          updatedDriver = await terminateDriver(driver.id);
          break;
        default:
          throw new Error('Invalid status selected');
      }

      driver = updatedDriver;
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
</script>

<svelte:head>
  <title>{driver?.first_name ?? 'Driver'} {driver?.last_name ?? 'Details'} | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    {#if !driver}
      <div class="loading">Loading driver details...</div>
    {:else}
      <a href="/drivers" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Driver Management
      </a>

      <div class="incident-header">
        <div class="header-top">
          <div class="incident-id">
            <h1>Driver Profile</h1>
            <div class="id-number">{driver.first_name} {driver.last_name}</div>
          </div>
          
          <div class="header-controls">
            {#if driver.employment_status !== 'TERMINATED'}
              <button class="action-button primary" on:click={openUpdateStatus}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
                </svg>
                Update Status
              </button>
            {/if}
            <button class="edit-control">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Details
            </button>
          </div>
        </div>

        <div class="incident-meta">
          <StatusBadge status={driver.employment_status} type="driver" />
          <div class="meta-divider"></div>
          <div class="date-reported">
            <span class="label">DATE OF BIRTH</span>
            <span class="value">{formatDate(driver.dob)} ({calculateAge(driver.dob)} years)</span>
          </div>
          <div class="meta-divider"></div>
          <div class="damage-estimate">
            <span class="label">LICENSE EXPIRES</span>
            <span class="value highlight">{formatDate(driver.license_expiration)}</span>
          </div>
        </div>
      </div>

      <div class="resource-page-details-grid">
        <Card title="Personal Information" icon={icons.drivers}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Full Name</span>
                <span class="resource-page-detail-value highlight">{driver.first_name} {driver.last_name}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Date of Birth</span>
                <span class="resource-page-detail-value">{formatDate(driver.dob)} <span class="sub-value">({calculateAge(driver.dob)} years)</span></span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Email</span>
                <span class="resource-page-detail-value mono">{driver.email}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Phone</span>
                <span class="resource-page-detail-value mono">{driver.phone}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="License Information" icon={icons.notes}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">License Number</span>
                <span class="resource-page-detail-value highlight mono">{driver.license_number}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">State</span>
                <span class="resource-page-detail-value">{driver.license_state}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Expiration Date</span>
                <span class="resource-page-detail-value">{formatDate(driver.license_expiration)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Contact Information" icon={icons.facilities}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item full-width">
                <span class="resource-page-detail-label">Street Address</span>
                <span class="resource-page-detail-value">{driver.address.street}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">City</span>
                <span class="resource-page-detail-value">{driver.address.city}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">State</span>
                <span class="resource-page-detail-value">{driver.address.state}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">ZIP Code</span>
                <span class="resource-page-detail-value mono">{driver.address.zip}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    {/if}
  </div>
</Layout>

<DriverStatusModal
  isOpen={isUpdateStatusModalOpen}
  onClose={closeUpdateStatus}
  onSubmit={handleUpdateStatus}
  availableStatuses={currentDriverStatus ? getAvailableStatusTransitions(currentDriverStatus) : []}
/>

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

  .sub-value {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: normal;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }

  .header-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
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
  }

  .action-button.primary {
    background: rgb(99, 102, 241);
    color: white;
    border: none;
  }

  .action-button.primary:hover {
    background: rgb(79, 82, 231);
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
</style> 