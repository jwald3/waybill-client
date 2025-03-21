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

  function formatStatusLabel(status: string): string {
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
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
      <div class="page-header">
        <div class="resource-page-header-content">
          <a href="/drivers" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Driver Management
          </a>
          <div class="resource-page-title-section">
            <div class="resource-page-header">
              <div class="avatar">
                {#if driver?.first_name && driver?.last_name}
                  {driver.first_name[0]}{driver.last_name[0]}
                {/if}
              </div>
              <div class="driver-info">
                <h1 class="page-title">
                  {driver?.first_name ?? ''} {driver?.last_name ?? ''}
                </h1>
                <span class="driver-id">#{driver?.license_number ?? ''}</span>
              </div>
            </div>
            <StatusBadge status={driver.employment_status} type="driver" />
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

      <div class="action-buttons">
        {#if driver.employment_status !== 'TERMINATED'}
          <button class="action-button primary" on:click={openUpdateStatus}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
            </svg>
            Update Status
          </button>
        {/if}
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Edit Details
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          View Documents
        </button>
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
  .avatar {
    width: 64px;
    height: 64px;
    background: var(--theme-gradient);
    color: white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.5rem;
  }

  .driver-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .driver-id {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
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
</style> 