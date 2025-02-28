<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  
  let formData = {
    trip_number: '',
    driver_id: '',
    truck_id: '',
    start_facility_id: '',
    end_facility_id: '',
    departure_time: {
      scheduled: ''
    },
    arrival_time: {
      scheduled: ''
    },
    status: 'SCHEDULED',
    cargo: {
      description: '',
      weight: 0,
      hazmat: false
    },
    fuel_usage_gallons: 0,
    distance_miles: 0
  };

  // Sample data for dropdowns - in a real app these would come from API calls
  const drivers = [
    { id: '679545ec96f55dd3a2da16fb', label: 'John Smith' },
    { id: '679545ec96f55dd3a2da16fc', label: 'Sarah Johnson' },
    { id: '679545ec96f55dd3a2da16fd', label: 'Mike Williams' }
  ];

  const trucks = [
    { id: '6795460896f55dd3a2da16fc', label: 'A236286 - Ford Big Truck' },
    { id: '6795460896f55dd3a2da16fd', label: 'B445789 - Peterbilt 579' },
    { id: '6795460896f55dd3a2da16fe', label: 'C789012 - Kenworth T680' }
  ];

  const facilities = [
    { id: '6795bb1cd71b7166e7edea76', label: 'Main Distribution Center - Albany, NY' },
    { id: '6795ab2f2643e5f09e1ba4e9', label: 'North Regional Hub - Buffalo, NY' },
    { id: '6795ab2f2643e5f09e1ba4ea', label: 'South Logistics Center - NYC' }
  ];

  const tripStatuses = [
    'SCHEDULED',
    'IN_TRANSIT',
    'COMPLETED',
    'CANCELED'
  ];

  function formatStatus(status: string): string {
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  async function handleSubmit() {
    try {
      // Convert datetime-local to ISO string for API
      const formattedData = {
        ...formData,
        departure_time: {
          scheduled: new Date(formData.departure_time.scheduled).toISOString()
        },
        arrival_time: {
          scheduled: new Date(formData.arrival_time.scheduled).toISOString()
        }
      };

      const response = await fetch('http://localhost:8000/api/v1/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      goto('/trips');
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  }

  function handleCancel() {
    goto('/trips');
  }
</script>

<svelte:head>
  <title>Create New Trip | Waybill</title>
</svelte:head>

<Layout>
  <div class="page">
    <h1 class="page-title">Create New Trip</h1>

    <Card title="Trip Details" icon={icons.trips}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="trip_number">Trip Number</label>
                <input
                  id="trip_number"
                  type="text"
                  bind:value={formData.trip_number}
                  required
                />
              </div>

              <div class="input-field">
                <label for="status">Status</label>
                <select
                  id="status"
                  bind:value={formData.status}
                  required
                >
                  {#each tripStatuses as status}
                    <option value={status}>{formatStatus(status)}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="driver">Driver</label>
                <select
                  id="driver"
                  bind:value={formData.driver_id}
                  required
                >
                  <option value="">Select Driver</option>
                  {#each drivers as driver}
                    <option value={driver.id}>{driver.label}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="truck">Truck</label>
                <select
                  id="truck"
                  bind:value={formData.truck_id}
                  required
                >
                  <option value="">Select Truck</option>
                  {#each trucks as truck}
                    <option value={truck.id}>{truck.label}</option>
                  {/each}
                </select>
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Route Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="start_facility">Start Facility</label>
                <select
                  id="start_facility"
                  bind:value={formData.start_facility_id}
                  required
                >
                  <option value="">Select Start Facility</option>
                  {#each facilities as facility}
                    <option value={facility.id}>{facility.label}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="end_facility">End Facility</label>
                <select
                  id="end_facility"
                  bind:value={formData.end_facility_id}
                  required
                >
                  <option value="">Select End Facility</option>
                  {#each facilities as facility}
                    <option value={facility.id}>{facility.label}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="departure_time">Scheduled Departure</label>
                <input
                  id="departure_time"
                  type="datetime-local"
                  bind:value={formData.departure_time.scheduled}
                  required
                />
              </div>

              <div class="input-field">
                <label for="arrival_time">Scheduled Arrival</label>
                <input
                  id="arrival_time"
                  type="datetime-local"
                  bind:value={formData.arrival_time.scheduled}
                  required
                />
              </div>

              <div class="input-field">
                <label for="distance">Distance (miles)</label>
                <input
                  id="distance"
                  type="number"
                  bind:value={formData.distance_miles}
                  min="0"
                  required
                />
              </div>

              <div class="input-field">
                <label for="fuel">Estimated Fuel Usage (gallons)</label>
                <input
                  id="fuel"
                  type="number"
                  bind:value={formData.fuel_usage_gallons}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Cargo Information</h2>
            <div class="input-grid">
              <div class="input-field full-width">
                <label for="cargo_description">Cargo Description</label>
                <input
                  id="cargo_description"
                  type="text"
                  bind:value={formData.cargo.description}
                  required
                />
              </div>

              <div class="input-field">
                <label for="cargo_weight">Weight (lbs)</label>
                <input
                  id="cargo_weight"
                  type="number"
                  bind:value={formData.cargo.weight}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div class="input-field">
                <label class="new-form-checkbox-label">
                  <input
                    type="checkbox"
                    bind:checked={formData.cargo.hazmat}
                  />
                  <span>Hazardous Materials</span>
                </label>
              </div>
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="btn-cancel" on:click={handleCancel}>
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              Create Trip
            </button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</Layout>