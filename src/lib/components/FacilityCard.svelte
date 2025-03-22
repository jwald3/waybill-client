<script lang="ts">
  import type { Facility } from '$lib/api/facilities';
  import StatusBadge from '$lib/components/StatusBadge.svelte';

  export let facility: Facility;
</script>

<div class="record-item">
  <div class="record-header">
    <div class="record-title">
      <h3>{facility.name}</h3>
      <span class="facility-number">{facility.facility_number}</span>
    </div>
    <StatusBadge status={facility.type} type="facility" />
  </div>

  <div class="record-details">
    <div class="detail">
      <span class="label">Address</span>
      <span class="value">{facility.address.street}</span>
      <span class="sub-value">{facility.address.city}, {facility.address.state} {facility.address.zip}</span>
    </div>

    <div class="detail">
      <span class="label">Contact</span>
      <span class="value">{facility.contact_info.phone}</span>
      <span class="sub-value">{facility.contact_info.email}</span>
    </div>

    <div class="detail">
      <span class="label">Capacity</span>
      <span class="value">{facility.parking_capacity.toLocaleString()} spaces</span>
    </div>

    <div class="detail">
      <span class="label">Services</span>
      <div class="services-list">
        {#each facility.services_available as service}
          <span class="service-badge">{service}</span>
        {/each}
      </div>
    </div>
  </div>

  <div class="record-actions">
    <a href="/facilities/{facility.id}" class="action-button">View Details</a>
    <button class="action-button">Edit Facility</button>
  </div>
</div>

<style>
  .facility-number {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .services-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .service-badge {
    padding: 0.375rem 0.75rem;
    background: color-mix(in srgb, var(--theme-color) 10%, transparent);
    color: var(--theme-color);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
  }
</style> 