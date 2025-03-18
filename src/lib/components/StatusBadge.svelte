<script lang="ts">
  // Define all possible status types from across the app
  type TruckStatus = 'AVAILABLE' | 'IN_TRANSIT' | 'UNDER_MAINTENANCE' | 'RETIRED';
  type TripStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'FAILED_DELIVERY' | 'ON_SCHEDULE' | 'DELAYED' | 'HAZMAT';
  type DriverStatus = 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'ON_LEAVE';
  type IncidentType = 'TRAFFIC_ACCIDENT' | 'MECHANICAL_FAILURE' | 'WEATHER_DELAY' | 'CARGO_ISSUE' | 'OTHER';
  type FacilityType = string;

  export let status: TruckStatus | TripStatus | DriverStatus | IncidentType | FacilityType;
  export let type: 'truck' | 'trip' | 'driver' | 'incident' | 'facility' | 'maintenance' = 'truck';

  // Format the status text for display
  $: displayText = formatStatusText(status);

  function formatStatusText(status: string): string {
    if (type === 'facility') {
      return `TYPE ${status}`;
    }
    return status.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  // Get the appropriate color scheme based on status and type
  $: colorClass = getColorClass(status, type);

  function getColorClass(status: string, type: string): string {
    switch (type) {
      case 'truck':
        switch (status) {
          case 'AVAILABLE': return 'success';
          case 'IN_TRANSIT': return 'info';
          case 'UNDER_MAINTENANCE': return 'warning';
          case 'RETIRED': return 'neutral';
          default: return 'neutral';
        }
      case 'trip':
        switch (status) {
          case 'SCHEDULED': return 'info';
          case 'IN_PROGRESS': return 'warning';
          case 'COMPLETED': return 'success';
          case 'CANCELED': return 'error';
          case 'FAILED_DELIVERY': return 'error';
          case 'ON_SCHEDULE': return 'success';
          case 'DELAYED': return 'warning';
          case 'HAZMAT': return 'error';
          default: return 'neutral';
        }
      case 'driver':
        switch (status) {
          case 'ACTIVE': return 'success';
          case 'SUSPENDED': return 'error';
          case 'ON_LEAVE': return 'warning';
          case 'TERMINATED': return 'neutral';
          default: return 'neutral';
        }
      case 'incident':
        switch (status) {
          case 'TRAFFIC_ACCIDENT': return 'error';
          case 'MECHANICAL_FAILURE': return 'warning';
          case 'WEATHER_DELAY': return 'info';
          case 'CARGO_ISSUE': return 'purple';
          case 'OTHER': return 'neutral';
          default: return 'neutral';
        }
      case 'facility':
        switch (status) {
          case 'A': return 'success';
          case 'B': return 'info';
          case 'C': return 'warning';
          default: return 'neutral';
        }
      default:
        return 'neutral';
    }
  }
</script>

<span class="status-badge {colorClass}">
  {displayText}
</span>

<style>
  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
  }

  /* Success - Green */
  .success {
    background: #dcfce7;
    color: #15803d;
  }

  /* Info - Blue */
  .info {
    background: #dbeafe;
    color: #1d4ed8;
  }

  /* Warning - Yellow/Orange */
  .warning {
    background: #fef3c7;
    color: #d97706;
  }

  /* Error - Red */
  .error {
    background: #fee2e2;
    color: #dc2626;
  }

  /* Purple */
  .purple {
    background: #f3e8ff;
    color: #7c3aed;
  }

  /* Neutral - Gray */
  .neutral {
    background: #f3f4f6;
    color: #6b7280;
  }
</style> 