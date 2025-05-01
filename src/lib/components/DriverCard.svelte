<script lang="ts">
  import type { Driver } from '$lib/api/drivers';
  import StatusBadge from './StatusBadge.svelte';

  export let driver: Driver;
  export let onUpdateStatus: (driver: Driver) => void;

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="record-item">
  <div class="record-header">
    <div class="record-title">
      <div class="avatar">
        {driver.first_name[0]}{driver.last_name[0]}
      </div>
      <div class="driver-info">
        <h3>{driver.first_name} {driver.last_name}</h3>
        <p class="driver-contact">{driver.email} • {driver.phone}</p>
      </div>
    </div>
    <StatusBadge status={driver.employment_status} type="driver" />
  </div>

  <div class="record-details">
    <div class="detail">
      <span class="label">License</span>
      <span class="value">{driver.license_number}</span>
      <span class="sub-value">{driver.license_state} • Expires: {formatDate(driver.license_expiration)}</span>
    </div>

    <div class="detail">
      <span class="label">Address</span>
      <span class="value">{driver.address.street}</span>
      <span class="sub-value">{driver.address.city}, {driver.address.state} {driver.address.zip}</span>
    </div>
  </div>

  <div class="record-actions">
    <a href="/drivers/{driver.id}" class="centered-action-button">View Details</a>
    <button class="centered-action-button">Edit</button>
    {#if driver.employment_status !== 'TERMINATED'}
      <button class="centered-action-button" on:click={() => onUpdateStatus(driver)}>
        Update Status
      </button>
    {/if}
  </div>
</div>

<style>
  .avatar {
    width: 48px;
    height: 48px;
    background: var(--theme-gradient);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
    margin-right: 1rem;
  }

  .driver-info h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .driver-contact {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
</style> 