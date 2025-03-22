<script lang="ts">
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { formatCurrency, formatDate } from '$lib/utils/format';

  export let record: {
    id: string;
    truck: {
      truck_number: string;
      make: string;
      model: string;
      mileage: number;
    };
    service_type: string;
    cost: number;
    date: string;
    mechanic: string;
    location: string;
    notes: string;
  };
</script>

<div class="record-item">
  <div class="record-header">
    <div class="record-title">
      <h3>{record.truck.make} {record.truck.model} ({record.truck.truck_number})</h3>
      <div class="record-info">
        <StatusBadge
          status={record.service_type}
          type="maintenance"
        />
      </div>
    </div>
    <div class="cost">
      {formatCurrency(record.cost)}
    </div>
  </div>

  <div class="record-details">
    <div class="detail">
      <span class="label">Date:</span>
      <span class="value">{formatDate(record.date)}</span>
    </div>
    <div class="detail">
      <span class="label">Mechanic:</span>
      <span class="value">{record.mechanic}</span>
    </div>
    <div class="detail">
      <span class="label">Mileage:</span>
      <span class="value">{record.truck.mileage.toLocaleString()} miles</span>
    </div>
    <div class="detail">
      <span class="label">Location:</span>
      <span class="value">{record.location}</span>
    </div>
  </div>

  <p class="description">{record.notes}</p>

  <div class="record-actions">
    <a href="/maintenance/{record.id}" class="action-button">View Full Details</a>
    <button class="action-button">Update Record</button>
  </div>
</div> 