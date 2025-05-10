<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  import { createDriver, type CreateDriverPayload } from '$lib/api/drivers';
  
  let formData: CreateDriverPayload = {
    first_name: '',
    last_name: '',
    dob: '',
    license_number: '',
    license_state: '',
    license_expiration: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  let errors: Record<string, string> = {};
  
  function validateForm(): boolean {
    errors = {};
    
    if (!formData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!formData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!formData.dob) {
      errors.dob = 'Date of birth is required';
    }
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.license_number?.trim()) {
      errors.license_number = 'License number is required';
    }
    if (!formData.license_state) {
      errors.license_state = 'License state is required';
    }
    if (!formData.license_expiration) {
      errors.license_expiration = 'License expiration is required';
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
    } else if (!validateZip(formData.address.zip)) {
      errors.zip = 'Please enter a valid 5-digit ZIP code';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    try {
      await createDriver(formData);
      goto('/drivers');
    } catch (error) {
      console.error('Error creating driver:', error);
      alert('Failed to create driver. Please try again.');
    }
  }

  function handleCancel() {
    goto('/drivers');
  }

  function validateZip(value: string): boolean {
    return /^\d{5}$/.test(value);
  }

  let zipError = '';

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
</script>

<svelte:head>
  <title>Add New Driver | Waybill</title>
</svelte:head>

<Layout>
  <div class="page">
    <h1 class="page-title">Add New Driver</h1>

    <Card title="Driver Details" icon={icons.drivers}>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-content">
          <div class="required-note">
            <span class="required">*</span> Required field
          </div>

          <section class="form-group">
            <h2 class="section-title">Personal Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="first_name">
                  First Name
                  <span class="required">*</span>
                </label>
                <input
                  id="first_name"
                  type="text"
                  bind:value={formData.first_name}
                  class:error={errors.first_name}
                  required
                />
                {#if errors.first_name}
                  <span class="error-message">{errors.first_name}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="last_name">
                  Last Name
                  <span class="required">*</span>
                </label>
                <input
                  id="last_name"
                  type="text"
                  bind:value={formData.last_name}
                  class:error={errors.last_name}
                  required
                />
                {#if errors.last_name}
                  <span class="error-message">{errors.last_name}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="dob">
                  Date of Birth
                  <span class="required">*</span>
                </label>
                <input
                  id="dob"
                  type="date"
                  bind:value={formData.dob}
                  class:error={errors.dob}
                  required
                />
                {#if errors.dob}
                  <span class="error-message">{errors.dob}</span>
                {/if}
              </div>

              <div class="input-field">
                <label for="phone">
                  Phone Number
                  <span class="required">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={formData.phone}
                  class:error={errors.phone}
                  required
                />
                {#if errors.phone}
                  <span class="error-message">{errors.phone}</span>
                {/if}
              </div>

              <div class="input-field full-width">
                <label for="email">
                  Email
                  <span class="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  bind:value={formData.email}
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
            <h2 class="section-title">License Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="license_number">
                  License Number
                  <span class="required">*</span>
                </label>
                <input
                  id="license_number"
                  type="text"
                  bind:value={formData.license_number}
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
                  bind:value={formData.license_state}
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

              <div class="input-field">
                <label for="license_expiration">
                  License Expiration
                  <span class="required">*</span>
                </label>
                <input
                  id="license_expiration"
                  type="date"
                  bind:value={formData.license_expiration}
                  class:error={errors.license_expiration}
                  required
                />
                {#if errors.license_expiration}
                  <span class="error-message">{errors.license_expiration}</span>
                {/if}
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">Address</h2>
            <div class="input-grid">
              <div class="input-field full-width">
                <label for="street">
                  Street Address
                  <span class="required">*</span>
                </label>
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
                <label for="city">
                  City
                  <span class="required">*</span>
                </label>
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
                <label for="zip">
                  ZIP Code
                  <span class="required">*</span>
                </label>
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

          <div class="form-actions">
            <button type="button" class="btn-cancel" on:click={handleCancel}>
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              Create Driver
            </button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</Layout>

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
</style> 