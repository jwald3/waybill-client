<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  import { createFacility, type CreateFacilityPayload } from '$lib/api/facilities';
  
  let formData: CreateFacilityPayload = {
    facility_number: '',
    name: '',
    type: 'A',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    contact_info: {
      phone: '',
      email: ''
    },
    parking_capacity: 0,
    services_available: []
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const facilityTypes = ['A', 'B', 'C'];

  const availableServices = [
    'REPAIRS',
    'LOADING_UNLOADING',
    'LODGING',
    'FUELING'
  ];

  let zipError = '';

  function toTitleCase(str: string): string {
    return str.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  function handleServiceToggle(service: string) {
    if (formData.services_available.includes(service)) {
      formData.services_available = formData.services_available.filter(s => s !== service);
    } else {
      formData.services_available = [...formData.services_available, service];
    }
  }

  function handleZipInput(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 5);
    
    if (input.value.length === 5) {
      zipError = '';
    } else {
      zipError = 'Please enter a 5-digit ZIP code';
    }
    
    formData.address.zip = input.value;
  }

  async function handleSubmit() {
    try {
      await createFacility(formData);
      goto('/facilities');
    } catch (error) {
      console.error('Error creating facility:', error);
    }
  }

  function handleCancel() {
    goto('/facilities');
  }
</script>

<svelte:head>
  <title>Add New Facility | Waybill</title>
</svelte:head>

<Layout>
  <div class="page">
    <h1 class="page-title">Add New Facility</h1>

    <Card title="Facility Details" icon={icons.facilities}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="facility_number">Facility Number</label>
                <input
                  id="facility_number"
                  type="text"
                  bind:value={formData.facility_number}
                  required
                />
              </div>

              <div class="input-field">
                <label for="name">Facility Name</label>
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  required
                />
              </div>

              <div class="input-field">
                <label for="type">Facility Type</label>
                <select
                  id="type"
                  bind:value={formData.type}
                  required
                >
                  {#each facilityTypes as type}
                    <option value={type}>Type {type}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="parking_capacity">Parking Capacity</label>
                <input
                  id="parking_capacity"
                  type="number"
                  bind:value={formData.parking_capacity}
                  min="0"
                  required
                />
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Address</h2>
            <div class="input-grid">
              <div class="input-field full-width">
                <label for="street">Street Address</label>
                <input
                  id="street"
                  type="text"
                  bind:value={formData.address.street}
                  required
                />
              </div>

              <div class="input-field">
                <label for="city">City</label>
                <input
                  id="city"
                  type="text"
                  bind:value={formData.address.city}
                  required
                />
              </div>

              <div class="input-field">
                <label for="state">State</label>
                <select
                  id="state"
                  bind:value={formData.address.state}
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="zip">ZIP Code</label>
                <input
                  id="zip"
                  type="text"
                  value={formData.address.zip}
                  required
                  inputmode="numeric"
                  on:input={handleZipInput}
                />
                {#if zipError}
                  <span class="error">{zipError}</span>
                {/if}
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Contact Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={formData.contact_info.phone}
                  required
                />
              </div>

              <div class="input-field">
                <label for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  bind:value={formData.contact_info.email}
                  required
                />
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Available Services</h2>
            <div class="services-grid">
              {#each availableServices as service}
                <label class="service-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.services_available.includes(service)}
                    on:change={() => handleServiceToggle(service)}
                  />
                  <div class="service-label">
                    <span>{toTitleCase(service)}</span>
                  </div>
                </label>
              {/each}
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="btn-cancel" on:click={handleCancel}>
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              Create Facility
            </button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</Layout>

<style>
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
  }

  .service-checkbox {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-all);
  }

  .service-checkbox:hover {
    border-color: var(--theme-color);
    transform: translateY(-1px);
  }

  .service-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin: 0;
  }

  .service-label {
    flex: 1;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .services-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      padding: var(--spacing-sm);
    }

    .service-checkbox {
      padding: var(--spacing-sm);
    }
  }

  .error {
    color: red;
    font-size: 0.8em;
    margin-top: 0.2em;
  }
</style> 