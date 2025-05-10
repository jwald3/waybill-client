<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  import { createTruck, type CreateTruckPayload } from '$lib/api/trucks';
  
  let formData: CreateTruckPayload = {
    truck_number: '',
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: {
      number: '',
      state: ''
    },
    mileage: 0,
    trailer_type: 'DRY_VAN',
    capacity_tons: 0,
    fuel_type: 'DIESEL',
    last_maintenance: ''
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const trailerTypes = [
    'DRY_VAN',
    'REFRIGERATED',
    'FLAT_BED',
    'TANKER',
    'AUTO_CARRIER',
    'LIVE_STOCK',
    'INTERMODAL',
    'LOGGING',
    'PNEUMATIC_TANK'
  ];

  const fuelTypes = [
    'DIESEL',
    'GASOLINE',
    'ELECTRIC',
    'HYBRID'
  ];

  const statusTypes = [
    'AVAILABLE',
    'IN_TRANSIT',
    'MAINTENANCE'
  ];

  let errors: Record<string, string> = {};
  
  function validateForm(): boolean {
    errors = {};
    
    if (!formData.truck_number?.trim()) {
      errors.truck_number = 'Truck number is required';
    }
    if (!formData.vin?.trim()) {
      errors.vin = 'VIN is required';
    }
    if (!formData.make?.trim()) {
      errors.make = 'Make is required';
    }
    if (!formData.model?.trim()) {
      errors.model = 'Model is required';
    }
    if (!formData.year) {
      errors.year = 'Year is required';
    } else if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = 'Please enter a valid year';
    }
    if (formData.mileage < 0) {
      errors.mileage = 'Mileage cannot be negative';
    }
    if (!formData.license_plate.number?.trim()) {
      errors.license_number = 'License plate number is required';
    }
    if (!formData.license_plate.state) {
      errors.license_state = 'License state is required';
    }
    if (!formData.trailer_type) {
      errors.trailer_type = 'Trailer type is required';
    }
    if (!formData.fuel_type) {
      errors.fuel_type = 'Fuel type is required';
    }
    if (formData.capacity_tons <= 0) {
      errors.capacity = 'Capacity must be greater than 0';
    }
    if (!formData.last_maintenance) {
      errors.last_maintenance = 'Last maintenance date is required';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      await createTruck(formData);
      goto('/trucks');
    } catch (error) {
      console.error('Error creating truck:', error);
      alert('Failed to create truck. Please try again.');
    }
  }

  function handleCancel() {
    goto('/trucks');
  }
</script>

<svelte:head>
  <title>Add New Truck | Waybill</title>
</svelte:head>

<Layout>
  <div class="page">
    <h1 class="page-title">Add New Truck</h1>

    <Card title="Truck Details" icon={icons.truck}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <div class="required-note">
            <span class="required">*</span> Required field
          </div>

          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="truck_number">
                  Truck Number
                  <span class="required">*</span>
                </label>
                <input
                  id="truck_number"
                  type="text"
                  bind:value={formData.truck_number}
                  class:error={errors.truck_number}
                  required
                />
                {#if errors.truck_number}
                  <span class="error-message">{errors.truck_number}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="vin">
                  VIN
                  <span class="required">*</span>
                </label>
                <input
                  id="vin"
                  type="text"
                  bind:value={formData.vin}
                  class:error={errors.vin}
                  required
                />
                {#if errors.vin}
                  <span class="error-message">{errors.vin}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="make">
                  Make
                  <span class="required">*</span>
                </label>
                <input
                  id="make"
                  type="text"
                  bind:value={formData.make}
                  class:error={errors.make}
                  required
                />
                {#if errors.make}
                  <span class="error-message">{errors.make}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="model">
                  Model
                  <span class="required">*</span>
                </label>
                <input
                  id="model"
                  type="text"
                  bind:value={formData.model}
                  class:error={errors.model}
                  required
                />
                {#if errors.model}
                  <span class="error-message">{errors.model}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="year">
                  Year
                  <span class="required">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  bind:value={formData.year}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  class:error={errors.year}
                  required
                />
                {#if errors.year}
                  <span class="error-message">{errors.year}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="mileage">
                  Mileage
                  <span class="required">*</span>
                </label>
                <input
                  id="mileage"
                  type="number"
                  bind:value={formData.mileage}
                  min="0"
                  class:error={errors.mileage}
                  required
                />
                {#if errors.mileage}
                  <span class="error-message">{errors.mileage}</span>
                {/if}
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">License & Registration</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="license_number">
                  License Plate Number
                  <span class="required">*</span>
                </label>
                <input
                  id="license_number"
                  type="text"
                  bind:value={formData.license_plate.number}
                  class:error={errors.license_number}
                  required
                />
                {#if errors.license_number}
                  <span class="error-message">{errors.license_number}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="license_state">
                  License State
                  <span class="required">*</span>
                </label>
                <select
                  id="license_state"
                  bind:value={formData.license_plate.state}
                  class:error={errors.license_state}
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
                {#if errors.license_state}
                  <span class="error-message">{errors.license_state}</span>
                {/if}
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Specifications</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="trailer_type">
                  Trailer Type
                  <span class="required">*</span>
                </label>
                <select
                  id="trailer_type"
                  bind:value={formData.trailer_type}
                  class:error={errors.trailer_type}
                  required
                >
                  {#each trailerTypes as type}
                    <option value={type}>{type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}</option>
                  {/each}
                </select>
                {#if errors.trailer_type}
                  <span class="error-message">{errors.trailer_type}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="fuel_type">
                  Fuel Type
                  <span class="required">*</span>
                </label>
                <select
                  id="fuel_type"
                  bind:value={formData.fuel_type}
                  class:error={errors.fuel_type}
                  required
                >
                  {#each fuelTypes as type}
                    <option value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                  {/each}
                </select>
                {#if errors.fuel_type}
                  <span class="error-message">{errors.fuel_type}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="capacity">
                  Capacity (tons)
                  <span class="required">*</span>
                </label>
                <input
                  id="capacity"
                  type="number"
                  bind:value={formData.capacity_tons}
                  min="0"
                  step="0.1"
                  class:error={errors.capacity}
                  required
                />
                {#if errors.capacity}
                  <span class="error-message">{errors.capacity}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="last_maintenance">
                  Last Maintenance Date
                  <span class="required">*</span>
                </label>
                <input
                  id="last_maintenance"
                  type="date"
                  bind:value={formData.last_maintenance}
                  class:error={errors.last_maintenance}
                  required
                />
                {#if errors.last_maintenance}
                  <span class="error-message">{errors.last_maintenance}</span>
                {/if}
              </div>
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="btn-cancel" on:click={handleCancel}>
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              Create Truck
            </button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</Layout> 