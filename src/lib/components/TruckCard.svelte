<script lang="ts">
  import type { Truck } from '$lib/api/trucks';
  import StatusBadge from './StatusBadge.svelte';

  export let truck: Truck;
  export let onUpdateStatus: (truck: Truck) => void;

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

<div class="record-item">
  <div class="record-header">
    <div class="record-title">
      <h3>{truck.make} {truck.model}</h3>
      <span class="truck-number">{truck.truck_number}</span>
    </div>
    <StatusBadge status={truck.status} type="truck" />
  </div>

  <div class="record-details">
    <div class="detail">
      <span class="label">Vehicle Info</span>
      <span class="value">{truck.year} • VIN: {truck.vin}</span>
      <span class="sub-value">License: {truck.license_plate.number} ({truck.license_plate.state})</span>
    </div>

    <div class="detail">
      <span class="label">Usage</span>
      <span class="value">{formatNumber(truck.mileage)} miles</span>
      <span class="sub-value">Last Maintenance: {formatDate(truck.last_maintenance)}</span>
    </div>

    <div class="detail">
      <span class="label">Specifications</span>
      <span class="value">{truck.trailer_type.replace('_', ' ')}</span>
      <span class="sub-value">Capacity: {truck.capacity_tons} tons • {truck.fuel_type}</span>
    </div>
  </div>

  <div class="record-actions">
    <a href="/trucks/{truck.id}" class="action-button">View Details</a>
    <a href="/maintenance/new?truck={truck.id}" class="action-button">Schedule Maintenance</a>
    {#if truck.status !== 'RETIRED'}
      <button class="action-button" on:click={() => onUpdateStatus(truck)}>
        Update Status
      </button>
    {/if}
  </div>
</div>

<style>
  .truck-number {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
</style> 