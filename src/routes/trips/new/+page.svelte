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

  let errors: Record<string, string> = {};
  
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

  function validateForm(): boolean {
    errors = {};
    
    if (!formData.trip_number?.trim()) {
      errors.trip_number = 'Trip number is required';
    }
    if (!formData.driver_id) {
      errors.driver = 'Please select a driver';
    }
    if (!formData.truck_id) {
      errors.truck = 'Please select a truck';
    }
    if (!formData.start_facility_id) {
      errors.start_facility = 'Please select a start facility';
    }
    if (!formData.end_facility_id) {
      errors.end_facility = 'Please select an end facility';
    }
    if (!formData.departure_time.scheduled) {
      errors.departure_time = 'Departure time is required';
    }
    if (!formData.arrival_time.scheduled) {
      errors.arrival_time = 'Arrival time is required';
    }
    if (!formData.cargo.description?.trim()) {
      errors.cargo_description = 'Cargo description is required';
    }
    if (formData.cargo.weight <= 0) {
      errors.cargo_weight = 'Cargo weight must be greater than 0';
    }
    if (formData.distance_miles <= 0) {
      errors.distance = 'Distance must be greater than 0';
    }
    if (formData.fuel_usage_gallons < 0) {
      errors.fuel = 'Fuel usage cannot be negative';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

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
      alert('Failed to create trip. Please try again.');
    }
  }

  function handleCancel() {
    goto('/trips');
  }
</script>

<style lang="postcss">
  .required {
    color: var(--color-error);
    margin-left: 4px;
  }

  .required-note {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: -0.5rem 0 1.5rem;
    padding: 0.75rem;
    background: var(--color-background-secondary);
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .required-note .required {
    margin-left: 0;
  }

  .error {
    border-color: var(--color-error) !important;
  }

  .error-message {
    color: var(--color-error);
    font-size: 0.875rem;
    margin-top: 4px;
    display: block;
  }

  /* Keep existing styles */
</style>

<svelte:head>
  <title>Create New Trip | Waybill</title>
</svelte:head>

<Layout>
  <div class="page">
    <h1 class="page-title">Create New Trip</h1>

    <Card title="Trip Details" icon={icons.trips}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <div class="required-note">
            <span class="required">*</span> Required field
          </div>

          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="trip_number">
                  Trip Number
                  <span class="required">*</span>
                </label>
                <input
                  id="trip_number"
                  type="text"
                  bind:value={formData.trip_number}
                  class:error={errors.trip_number}
                  required
                />
                {#if errors.trip_number}
                  <span class="error-message">{errors.trip_number}</span>
                {/if}
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
                <label for="driver">
                  Driver
                  <span class="required">*</span>
                </label>
                {#await driversPromise}
                  <select disabled>
                    <option>Loading drivers...</option>
                  </select>
                {:then driversResponse}
                  <select
                    id="driver"
                    bind:value={formData.driver_id}
                    class:error={errors.driver}
                    required
                  >
                    <option value="">Select Driver</option>
                    {#each driversResponse.items as driver}
                      <option value={driver.id}>{formatDriverLabel(driver)}</option>
                    {/each}
                  </select>
                  {#if errors.driver}
                    <span class="error-message">{errors.driver}</span>
                  {/if}
                {:catch error}
                  <select disabled>
                    <option>Error loading drivers</option>
                  </select>
                {/await}
              </div>

              <div class="input-field">
                <label for="truck">
                  Truck
                  <span class="required">*</span>
                </label>
                {#await trucksPromise}
                  <select disabled>
                    <option>Loading trucks...</option>
                  </select>
                {:then trucksResponse}
                  <select
                    id="truck"
                    bind:value={formData.truck_id}
                    class:error={errors.truck}
                    required
                  >
                    <option value="">Select Truck</option>
                    {#each trucksResponse.items as truck}
                      <option value={truck.id}>{formatTruckLabel(truck)}</option>
                    {/each}
                  </select>
                  {#if errors.truck}
                    <span class="error-message">{errors.truck}</span>
                  {/if}
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
                <label for="start_facility">
                  Start Facility
                  <span class="required">*</span>
                </label>
                {#await facilitiesPromise}
                  <select disabled>
                    <option>Loading facilities...</option>
                  </select>
                {:then facilitiesResponse}
                  <select
                    id="start_facility"
                    bind:value={formData.start_facility_id}
                    class:error={errors.start_facility}
                    required
                  >
                    <option value="">Select Start Facility</option>
                    {#each facilitiesResponse.items as facility}
                      <option value={facility.id}>{formatFacilityLabel(facility)}</option>
                    {/each}
                  </select>
                  {#if errors.start_facility}
                    <span class="error-message">{errors.start_facility}</span>
                  {/if}
                {:catch error}
                  <select disabled>
                    <option>Error loading facilities</option>
                  </select>
                {/await}
              </div>

              <div class="input-field">
                <label for="end_facility">
                  End Facility
                  <span class="required">*</span>
                </label>
                {#await facilitiesPromise}
                  <select disabled>
                    <option>Loading facilities...</option>
                  </select>
                {:then facilitiesResponse}
                  <select
                    id="end_facility"
                    bind:value={formData.end_facility_id}
                    class:error={errors.end_facility}
                    required
                  >
                    <option value="">Select End Facility</option>
                    {#each facilitiesResponse.items as facility}
                      <option value={facility.id}>{formatFacilityLabel(facility)}</option>
                    {/each}
                  </select>
                  {#if errors.end_facility}
                    <span class="error-message">{errors.end_facility}</span>
                  {/if}
                {:catch error}
                  <select disabled>
                    <option>Error loading facilities</option>
                  </select>
                {/await}
              </div>

              <div class="input-field">
                <label for="departure_time">
                  Scheduled Departure
                  <span class="required">*</span>
                </label>
                <input
                  id="departure_time"
                  type="datetime-local"
                  bind:value={formData.departure_time.scheduled}
                  class:error={errors.departure_time}
                  required
                />
                {#if errors.departure_time}
                  <span class="error-message">{errors.departure_time}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="arrival_time">
                  Scheduled Arrival
                  <span class="required">*</span>
                </label>
                <input
                  id="arrival_time"
                  type="datetime-local"
                  bind:value={formData.arrival_time.scheduled}
                  class:error={errors.arrival_time}
                  required
                />
                {#if errors.arrival_time}
                  <span class="error-message">{errors.arrival_time}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="distance">
                  Distance (miles)
                  <span class="required">*</span>
                </label>
                <input
                  id="distance"
                  type="number"
                  bind:value={formData.distance_miles}
                  class:error={errors.distance}
                  min="0"
                  required
                />
                {#if errors.distance}
                  <span class="error-message">{errors.distance}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="fuel">
                  Estimated Fuel Usage (gallons)
                  <span class="required">*</span>
                </label>
                <input
                  id="fuel"
                  type="number"
                  bind:value={formData.fuel_usage_gallons}
                  class:error={errors.fuel}
                  min="0"
                  step="0.01"
                  required
                />
                {#if errors.fuel}
                  <span class="error-message">{errors.fuel}</span>
                {/if}
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Cargo Information</h2>
            <div class="input-grid">
              <div class="input-field full-width">
                <label for="cargo_description">
                  Cargo Description
                  <span class="required">*</span>
                </label>
                <input
                  id="cargo_description"
                  type="text"
                  bind:value={formData.cargo.description}
                  class:error={errors.cargo_description}
                  required
                />
                {#if errors.cargo_description}
                  <span class="error-message">{errors.cargo_description}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="cargo_weight">
                  Weight (lbs)
                  <span class="required">*</span>
                </label>
                <input
                  id="cargo_weight"
                  type="number"
                  bind:value={formData.cargo.weight}
                  class:error={errors.cargo_weight}
                  min="0"
                  step="0.01"
                  required
                />
                {#if errors.cargo_weight}
                  <span class="error-message">{errors.cargo_weight}</span>
                {/if}
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