<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  import { getTrucks } from '$lib/api/trucks';
  import { getDrivers } from '$lib/api/drivers';
  import { getFacilities } from '$lib/api/facilities';
  import { mutateApi } from '$lib/api/client';
  import type { Trip } from '$lib/api/trips';
  
  let formData: Omit<Trip, 'id' | 'created_at' | 'updated_at' | 'notes' | 'driver' | 'truck' | 'start_facility' | 'end_facility'> = {
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

  // Load data from APIs
  let driversPromise = getDrivers();
  let trucksPromise = getTrucks();
  let facilitiesPromise = getFacilities();

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

  function formatDriverLabel(driver: any): string {
    return `${driver.first_name} ${driver.last_name}`;
  }

  function formatTruckLabel(truck: any): string {
    return `${truck.truck_number} - ${truck.year} ${truck.make} ${truck.model}`;
  }

  function formatFacilityLabel(facility: any): string {
    return `${facility.name} - ${facility.address.city}, ${facility.address.state}`;
  }

  async function handleSubmit() {
    try {
      const formattedData = {
        ...formData,
        departure_time: {
          scheduled: new Date(formData.departure_time.scheduled).toISOString()
        },
        arrival_time: {
          scheduled: new Date(formData.arrival_time.scheduled).toISOString()
        }
      };

      // Add validation to ensure required IDs are present
      if (!formattedData.driver_id || !formattedData.truck_id || 
          !formattedData.start_facility_id || !formattedData.end_facility_id) {
        throw new Error('Please select all required fields');
      }

      // Replace direct fetch with mutateApi
      await mutateApi('/trips', 'POST', formattedData);
      goto('/trips');
    } catch (error) {
      console.error('Error creating trip:', error);
      // You might want to add some user feedback here
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
                {#await driversPromise}
                  <select disabled>
                    <option>Loading drivers...</option>
                  </select>
                {:then driversResponse}
                  <select
                    id="driver"
                    bind:value={formData.driver_id}
                    required
                  >
                    <option value="">Select Driver</option>
                    {#each driversResponse.items as driver}
                      <option value={driver.id}>{formatDriverLabel(driver)}</option>
                    {/each}
                  </select>
                {:catch error}
                  <select disabled>
                    <option>Error loading drivers</option>
                  </select>
                {/await}
              </div>

              <div class="input-field">
                <label for="truck">Truck</label>
                {#await trucksPromise}
                  <select disabled>
                    <option>Loading trucks...</option>
                  </select>
                {:then trucksResponse}
                  <select
                    id="truck"
                    bind:value={formData.truck_id}
                    required
                  >
                    <option value="">Select Truck</option>
                    {#each trucksResponse.items as truck}
                      <option value={truck.id}>{formatTruckLabel(truck)}</option>
                    {/each}
                  </select>
                {:catch error}
                  <select disabled>
                    <option>Error loading trucks</option>
                  </select>
                {/await}
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Route Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="start_facility">Start Facility</label>
                {#await facilitiesPromise}
                  <select disabled>
                    <option>Loading facilities...</option>
                  </select>
                {:then facilitiesResponse}
                  <select
                    id="start_facility"
                    bind:value={formData.start_facility_id}
                    required
                  >
                    <option value="">Select Start Facility</option>
                    {#each facilitiesResponse.items as facility}
                      <option value={facility.id}>{formatFacilityLabel(facility)}</option>
                    {/each}
                  </select>
                {:catch error}
                  <select disabled>
                    <option>Error loading facilities</option>
                  </select>
                {/await}
              </div>

              <div class="input-field">
                <label for="end_facility">End Facility</label>
                {#await facilitiesPromise}
                  <select disabled>
                    <option>Loading facilities...</option>
                  </select>
                {:then facilitiesResponse}
                  <select
                    id="end_facility"
                    bind:value={formData.end_facility_id}
                    required
                  >
                    <option value="">Select End Facility</option>
                    {#each facilitiesResponse.items as facility}
                      <option value={facility.id}>{formatFacilityLabel(facility)}</option>
                    {/each}
                  </select>
                {:catch error}
                  <select disabled>
                    <option>Error loading facilities</option>
                  </select>
                {/await}
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