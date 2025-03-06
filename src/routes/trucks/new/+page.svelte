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

  async function handleSubmit() {
    try {
      await createTruck(formData);
      goto('/trucks');
    } catch (error) {
      console.error('Error creating truck:', error);
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
          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="truck_number">Truck Number</label>
                <input
                  id="truck_number"
                  type="text"
                  bind:value={formData.truck_number}
                  required
                />
              </div>

              <div class="input-field">
                <label for="vin">VIN</label>
                <input
                  id="vin"
                  type="text"
                  bind:value={formData.vin}
                  required
                />
              </div>

              <div class="input-field">
                <label for="make">Make</label>
                <input
                  id="make"
                  type="text"
                  bind:value={formData.make}
                  required
                />
              </div>

              <div class="input-field">
                <label for="model">Model</label>
                <input
                  id="model"
                  type="text"
                  bind:value={formData.model}
                  required
                />
              </div>

              <div class="input-field">
                <label for="year">Year</label>
                <input
                  id="year"
                  type="number"
                  bind:value={formData.year}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div class="input-field">
                <label for="mileage">Mileage</label>
                <input
                  id="mileage"
                  type="number"
                  bind:value={formData.mileage}
                  min="0"
                  required
                />
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">License & Registration</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="license_number">License Plate Number</label>
                <input
                  id="license_number"
                  type="text"
                  bind:value={formData.license_plate.number}
                  required
                />
              </div>

              <div class="input-field">
                <label for="license_state">License State</label>
                <select
                  id="license_state"
                  bind:value={formData.license_plate.state}
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Specifications</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="trailer_type">Trailer Type</label>
                <select
                  id="trailer_type"
                  bind:value={formData.trailer_type}
                  required
                >
                  {#each trailerTypes as type}
                    <option value={type}>{type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="fuel_type">Fuel Type</label>
                <select
                  id="fuel_type"
                  bind:value={formData.fuel_type}
                  required
                >
                  {#each fuelTypes as type}
                    <option value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="capacity">Capacity (tons)</label>
                <input
                  id="capacity"
                  type="number"
                  bind:value={formData.capacity_tons}
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div class="input-field">
                <label for="last_maintenance">Last Maintenance Date</label>
                <input
                  id="last_maintenance"
                  type="date"
                  bind:value={formData.last_maintenance}
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
              Create Truck
            </button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</Layout> 