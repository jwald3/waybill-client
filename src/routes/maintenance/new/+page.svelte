<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  
  let formData = {
    truck_id: '',
    date: '',
    service_type: 'ROUTINE_MAINTENANCE',
    cost: 0,
    notes: '',
    mechanic: '',
    location: ''
  };

  // Sample trucks for the dropdown
  // In a real app, this would come from an API
  const trucks = [
    { id: '67b0d790c7baa8eb47fafe70', label: 'A236286 - Ford Big Truck' },
    { id: '67b0d790c7baa8eb47fafe71', label: 'B445789 - Peterbilt 579' },
    { id: '67b0d790c7baa8eb47fafe72', label: 'C789012 - Kenworth T680' }
  ];

  const serviceTypes = [
    'ROUTINE_MAINTENANCE',
    'REPAIR',
    'EMERGENCY',
    'INSPECTION',
    'TIRE_SERVICE',
    'OIL_CHANGE'
  ];

  function formatServiceType(type: string): string {
    return type.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  async function handleSubmit() {
    try {
      const response = await fetch('http://localhost:8000/api/v1/maintenance-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create maintenance log');
      }

      goto('/maintenance');
    } catch (error) {
      console.error('Error creating maintenance log:', error);
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
                />
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