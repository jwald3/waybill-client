<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  import { getTrucks } from '$lib/api/trucks';
  import type { Truck } from '$lib/api/trucks';
  import { createMaintenanceLog } from '$lib/api/maintenance';
  import { page } from '$app/stores';
  import { MAINTENANCE_SERVICE_TYPES } from '$lib/types/maintenance';
  
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

  const serviceTypes = MAINTENANCE_SERVICE_TYPES;

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

  let errors: Record<string, string> = {};
  
  function validateForm(): boolean {
    errors = {};
    
    if (!formData.truck_id) {
      errors.truck = 'Please select a truck';
    }
    if (!formData.date) {
      errors.date = 'Service date is required';
    }
    if (!formData.service_type) {
      errors.service_type = 'Service type is required';
    }
    if (formData.cost < 0) {
      errors.cost = 'Cost cannot be negative';
    }
    if (!formData.mechanic?.trim()) {
      errors.mechanic = 'Mechanic name is required';
    }
    if (!formData.location?.trim()) {
      errors.location = 'Service location is required';
    }
    if (!formData.notes?.trim()) {
      errors.notes = 'Notes are required';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      console.log(formData);
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

<style lang="postcss">
  .required {
    color: var(--color-error);
    margin-left: 4px;
  }

  .input-field label {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
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

  .input-field {
    margin-bottom: 1rem;
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
    margin-left: 0; /* Override the default margin */
  }

  /* Keep any existing styles */
</style>

<Layout>
  <div class="page">
    <h1 class="page-title">Add Maintenance Log</h1>

    <Card title="Maintenance Details" icon={icons.maintenance}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <div class="required-note">
            <span class="required">*</span> Required field
          </div>
          
          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
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

              <div class="input-field">
                <label for="date">
                  Service Date
                  <span class="required">*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  bind:value={formData.date}
                  class:error={errors.date}
                  required
                />
                {#if errors.date}
                  <span class="error-message">{errors.date}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="service_type">
                  Service Type
                  <span class="required">*</span>
                </label>
                <select
                  id="service_type"
                  bind:value={formData.service_type}
                  class:error={errors.service_type}
                  required
                >
                  {#each serviceTypes as type}
                    <option value={type}>{formatServiceType(type)}</option>
                  {/each}
                </select>
                {#if errors.service_type}
                  <span class="error-message">{errors.service_type}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="cost">
                  Cost ($)
                  <span class="required">*</span>
                </label>
                <input
                  id="cost"
                  type="number"
                  bind:value={formData.cost}
                  min="0"
                  step="0.01"
                  class:error={errors.cost}
                  required
                />
                {#if errors.cost}
                  <span class="error-message">{errors.cost}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="mechanic">
                  Mechanic
                  <span class="required">*</span>
                </label>
                <input
                  id="mechanic"
                  type="text"
                  bind:value={formData.mechanic}
                  class:error={errors.mechanic}
                  required
                />
                {#if errors.mechanic}
                  <span class="error-message">{errors.mechanic}</span>
                {/if}
              </div>

              <div class="input-field full-width">
                <label for="location">
                  Service Location
                  <span class="required">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  bind:value={formData.location}
                  class:error={errors.location}
                  required
                  placeholder="Shop Name, Street Address, City, State"
                />
                {#if errors.location}
                  <span class="error-message">{errors.location}</span>
                {/if}
              </div>

              <div class="input-field full-width">
                <label for="notes">
                  Notes
                  <span class="required">*</span>
                </label>
                <textarea
                  id="notes"
                  bind:value={formData.notes}
                  rows="4"
                  class="form-input"
                  class:error={errors.notes}
                  placeholder="Describe the maintenance work performed..."
                  required
                ></textarea>
                {#if errors.notes}
                  <span class="error-message">{errors.notes}</span>
                {/if}
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