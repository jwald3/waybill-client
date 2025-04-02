<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  import { getTrips } from '$lib/api/trips';
  import { getTrucks } from '$lib/api/trucks';
  import { getDrivers } from '$lib/api/drivers';
  import { API_BASE_URL, mutateApi } from '$lib/api/client';
  import { createIncident, type CreateIncidentPayload } from '$lib/api/incidents';
  
  let formData: CreateIncidentPayload = {
    trip_id: '',
    truck_id: '',
    driver_id: '',
    type: 'TRAFFIC_ACCIDENT',
    description: '',
    date: '',
    location: '',
    damage_estimate: 0
  };

  // Load data from APIs
  let tripsPromise = getTrips();
  let trucksPromise = getTrucks();
  let driversPromise = getDrivers();

  const incidentTypes = [
    'TRAFFIC_ACCIDENT',
    'MECHANICAL_FAILURE',
    'WEATHER_DELAY',
    'CARGO_ISSUE',
    'OTHER'
  ];

  function formatIncidentType(type: string): string {
    return type.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  function formatTripLabel(trip: any): string {
    return `${trip.trip_number} - ${trip.cargo.description}`;
  }

  function formatTruckLabel(truck: any): string {
    return `${truck.truck_number} - ${truck.year} ${truck.make} ${truck.model}`;
  }

  function formatDriverLabel(driver: any): string {
    return `${driver.first_name} ${driver.last_name}`;
  }

  async function handleSubmit() {
    try {
      await createIncident(formData);
      goto('/incidents');
    } catch (error) {
      console.error('Error creating incident report:', error);
    }
  }

  function handleCancel() {
    goto('/incidents');
  }
</script>

<svelte:head>
  <title>Report Incident | Waybill</title>
</svelte:head>

<Layout>
  <div class="page">
    <h1 class="page-title">Report Incident</h1>

    <Card title="Incident Details" icon={icons.incidents}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="trip">Trip</label>
                {#await tripsPromise}
                  <select disabled>
                    <option>Loading trips...</option>
                  </select>
                {:then tripsResponse}
                  <select
                    id="trip"
                    bind:value={formData.trip_id}
                    required
                  >
                    <option value="">Select Trip</option>
                    {#each tripsResponse.items as trip}
                      <option value={trip.id}>{formatTripLabel(trip)}</option>
                    {/each}
                  </select>
                {:catch error}
                  <select disabled>
                    <option>Error loading trips</option>
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
                <label for="date">Incident Date</label>
                <input
                  id="date"
                  type="date"
                  bind:value={formData.date}
                  required
                />
              </div>

              <div class="input-field">
                <label for="type">Incident Type</label>
                <select
                  id="type"
                  bind:value={formData.type}
                  required
                >
                  {#each incidentTypes as type}
                    <option value={type}>{formatIncidentType(type)}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="damage_estimate">Damage Estimate ($)</label>
                <input
                  id="damage_estimate"
                  type="number"
                  bind:value={formData.damage_estimate}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div class="input-field full-width">
                <label for="location">Incident Location</label>
                <input
                  id="location"
                  type="text"
                  bind:value={formData.location}
                  required
                  placeholder="Street, City, State"
                />
              </div>

              <div class="input-field full-width">
                <label for="description">Description</label>
                <textarea
                  id="description"
                  bind:value={formData.description}
                  rows="4"
                  class="form-input"
                  placeholder="Describe what happened..."
                  required
                >
                </textarea>
              </div>
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="btn-cancel" on:click={handleCancel}>
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              Submit Report
            </button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</Layout> 