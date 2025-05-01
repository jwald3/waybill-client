<script lang="ts">
  import Card from './Card.svelte';
  import { icons } from '$lib/icons';
  import type { IncidentReport } from '$lib/api/incidents';

  export let incident: IncidentReport;
</script>

<Card title="Incident Details" icon={icons.incidents}>
  <div class="resource-page-detail-group">
    <div class="resource-page-detail-row">
      <div class="resource-page-detail-item full-width">
        <span class="resource-page-detail-label">Location</span>
        <span class="resource-page-detail-value">{incident.location}</span>
      </div>
    </div>
    <div class="resource-page-detail-row">
      <div class="resource-page-detail-item full-width">
        <span class="resource-page-detail-label">Description</span>
        <p class="resource-page-detail-value description">{incident.description}</p>
      </div>
    </div>
    <div class="record-actions">
      <a href="/incidents/{incident.id}" class="centered-action-button">View Details</a>
    </div>
  </div>
</Card>

<style>
  .record-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
</style> 