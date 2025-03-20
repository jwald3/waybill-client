<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  import { getTrucks } from '$lib/api/trucks';
  import type { Truck } from '$lib/api/trucks';
  import { createMaintenanceLog } from '$lib/api/maintenance';
  import { page } from '$app/stores';
  
  // Get truck_id from URL query parameter
  $: selectedTruckId = $page.url.searchParams.get('truck') || '';
  
  let formData = {
    truck_id: selectedTruckId, // Initialize with URL parameter
    date: '',
    service_type: 'ROUTINE_MAINTENANCE' as const,
    cost: 0,
    notes: '',
    mechanic: '',
    location: ''
  };

  // Load trucks from API
  let trucksPromise = getTrucks();

  const serviceTypes = [
    'ROUTINE_MAINTENANCE',
    'REPAIR',
    'EMERGENCY'
  ] as const;

  function formatTruckLabel(truck: Truck): string {
    return `${truck.truck_number} - ${truck.year} ${truck.make} ${truck.model}`;
  }

  function formatServiceType(type: string): string {
    return type.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Update formData.truck_id when URL parameter changes
  $: formData.truck_id = selectedTruckId;

  async function handleSubmit() {
    try {
      await createMaintenanceLog(formData);
      await goto('/maintenance');
    } catch (error) {
      console.error('Error creating maintenance log:', error);
      alert('Failed to create maintenance log. Please try again.');
    }
  }

  function handleCancel() {
    goto('/maintenance');
  }
</script>

<svelte:head>
  <title>Add Maintenance Log | Waybill</title>
</svelte:head>

<Layout>
  <div class="page">
    <h1 class="page-title">Add Maintenance Log</h1>

    <Card title="Maintenance Details" icon={icons.maintenance}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
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
                <label for="date">Service Date</label>
                <input
                  id="date"
                  type="date"
                  bind:value={formData.date}
                  required
                />
              </div>

              <div class="input-field">
                <label for="service_type">Service Type</label>
                <select
                  id="service_type"
                  bind:value={formData.service_type}
                  required
                >
                  {#each serviceTypes as type}
                    <option value={type}>{formatServiceType(type)}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="cost">Cost ($)</label>
                <input
                  id="cost"
                  type="number"
                  bind:value={formData.cost}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div class="input-field">
                <label for="mechanic">Mechanic</label>
                <input
                  id="mechanic"
                  type="text"
                  bind:value={formData.mechanic}
                  required
                />
              </div>

              <div class="input-field full-width">
                <label for="location">Service Location</label>
                <input
                  id="location"
                  type="text"
                  bind:value={formData.location}
                  required
                  placeholder="Shop Name, Street Address, City, State"
                />
              </div>

              <div class="input-field full-width">
                <label for="notes">Notes</label>
                <textarea
                  id="notes"
                  bind:value={formData.notes}
                  rows="4"
                  class="form-input"
                  placeholder="Describe the maintenance work performed..."
                ></textarea>
              </div>
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="btn-cancel" on:click={handleCancel}>
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              Create Maintenance Log
            </button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</Layout> 