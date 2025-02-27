<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  
  let formData = {
    trip_id: '',
    truck_id: '',
    driver_id: '',
    type: 'TRAFFIC_ACCIDENT',
    description: '',
    date: '',
    location: '',
    damage_estimate: 0
  };

  // Sample data for dropdowns - in a real app these would come from API calls
  const trips = [
    { id: '67b1020533184bdafb38b5ec', label: '209100240 - NYC to Boston' },
    { id: '67b1020533184bdafb38b5ed', label: '209100241 - Boston to Albany' },
    { id: '67b1020533184bdafb38b5ee', label: '209100242 - Albany to Buffalo' }
  ];

  const trucks = [
    { id: '67b0d790c7baa8eb47fafe70', label: 'A236286 - Ford Big Truck' },
    { id: '67b0d790c7baa8eb47fafe71', label: 'B445789 - Peterbilt 579' },
    { id: '67b0d790c7baa8eb47fafe72', label: 'C789012 - Kenworth T680' }
  ];

  const drivers = [
    { id: '67b0db7dc7baa8eb47fafe72', label: 'John Smith' },
    { id: '67b0db7dc7baa8eb47fafe73', label: 'Sarah Johnson' },
    { id: '67b0db7dc7baa8eb47fafe74', label: 'Mike Williams' }
  ];

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

  async function handleSubmit() {
    try {
      const response = await fetch('http://localhost:8000/api/v1/incident-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create incident report');
      }

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
                <select
                  id="trip"
                  bind:value={formData.trip_id}
                  required
                >
                  <option value="">Select Trip</option>
                  {#each trips as trip}
                    <option value={trip.id}>{trip.label}</option>
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
                />
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