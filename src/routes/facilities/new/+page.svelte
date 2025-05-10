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
  let errors: Record<string, string> = {};

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

  function validateForm(): boolean {
    errors = {};
    
    if (!formData.facility_number?.trim()) {
      errors.facility_number = 'Facility number is required';
    }
    if (!formData.name?.trim()) {
      errors.name = 'Facility name is required';
    }
    if (!formData.type) {
      errors.type = 'Facility type is required';
    }
    if (formData.parking_capacity < 0) {
      errors.parking_capacity = 'Parking capacity cannot be negative';
    }
    if (!formData.address.street?.trim()) {
      errors.street = 'Street address is required';
    }
    if (!formData.address.city?.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.address.state) {
      errors.state = 'State is required';
    }
    if (!formData.address.zip?.trim()) {
      errors.zip = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.address.zip)) {
      errors.zip = 'Please enter a valid 5-digit ZIP code';
    }
    if (!formData.contact_info.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.contact_info.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_info.email)) {
      errors.email = 'Please enter a valid email address';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      await createFacility(formData);
      goto('/facilities');
    } catch (error) {
      console.error('Error creating facility:', error);
      alert('Failed to create facility. Please try again.');
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
          <div class="required-note">
            <span class="required">*</span> Required field
          </div>

          <section class="form-group">
            <h2 class="section-title">Basic Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="facility_number">
                  Facility Number
                  <span class="required">*</span>
                </label>
                <input
                  id="facility_number"
                  type="text"
                  bind:value={formData.facility_number}
                  class:error={errors.facility_number}
                  required
                />
                {#if errors.facility_number}
                  <span class="error-message">{errors.facility_number}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="name">
                  Facility Name
                  <span class="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  bind:value={formData.name}
                  class:error={errors.name}
                  required
                />
                {#if errors.name}
                  <span class="error-message">{errors.name}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="type">
                  Facility Type
                  <span class="required">*</span>
                </label>
                <select
                  id="type"
                  bind:value={formData.type}
                  class:error={errors.type}
                  required
                >
                  {#each facilityTypes as type}
                    <option value={type}>Type {type}</option>
                  {/each}
                </select>
                {#if errors.type}
                  <span class="error-message">{errors.type}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="parking_capacity">
                  Parking Capacity
                  <span class="required">*</span>
                </label>
                <input
                  id="parking_capacity"
                  type="number"
                  bind:value={formData.parking_capacity}
                  class:error={errors.parking_capacity}
                  min="0"
                  required
                />
                {#if errors.parking_capacity}
                  <span class="error-message">{errors.parking_capacity}</span>
                {/if}
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
                  class:error={errors.street}
                  required
                />
                {#if errors.street}
                  <span class="error-message">{errors.street}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="city">City</label>
                <input
                  id="city"
                  type="text"
                  bind:value={formData.address.city}
                  class:error={errors.city}
                  required
                />
                {#if errors.city}
                  <span class="error-message">{errors.city}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="state">
                  State
                  <span class="required">*</span>
                </label>
                <select
                  id="state"
                  bind:value={formData.address.state}
                  class:error={errors.state}
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
                {#if errors.state}
                  <span class="error-message">{errors.state}</span>
                {/if}
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
                  class:error={errors.zip}
                />
                {#if errors.zip}
                  <span class="error-message">{errors.zip}</span>
                {/if}
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Contact Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="phone">
                  Phone Number
                  <span class="required">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={formData.contact_info.phone}
                  class:error={errors.phone}
                  required
                />
                {#if errors.phone}
                  <span class="error-message">{errors.phone}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="email">
                  Email
                  <span class="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  bind:value={formData.contact_info.email}
                  class:error={errors.email}
                  required
                />
                {#if errors.email}
                  <span class="error-message">{errors.email}</span>
                {/if}
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
</style> 