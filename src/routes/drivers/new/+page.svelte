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

  async function handleSubmit() {
    try {
      console.log('Submitting driver data:', formData);
      const token = localStorage.getItem('auth_token');
      console.log('Current auth token:', token ? 'present' : 'missing');
      
      await createDriver(formData);
      goto('/drivers');
    } catch (error) {
      console.error('Error creating driver:', error);
      // Add user-visible error handling here
      alert('Failed to create driver. Please check your login status and try again.');
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
          <section class="form-group">
            <h2 class="section-title">Personal Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="first_name">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  bind:value={formData.first_name}
                  required
                />
              </div>

              <div class="input-field">
                <label for="last_name">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  bind:value={formData.last_name}
                  required
                />
              </div>

              <div class="input-field">
                <label for="dob">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  bind:value={formData.dob}
                  required
                />
              </div>

              <div class="input-field">
                <label for="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={formData.phone}
                  required
                />
              </div>

              <div class="input-field full-width">
                <label for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  bind:value={formData.email}
                  required
                />
              </div>
            </div>
          </section>

          <section class="form-group">
            <h2 class="section-title">License Information</h2>
            <div class="input-grid">
              <div class="input-field">
                <label for="license_number">License Number</label>
                <input
                  id="license_number"
                  type="text"
                  bind:value={formData.license_number}
                  required
                />
              </div>

              <div class="input-field">
                <label for="license_state">License State</label>
                <select
                  id="license_state"
                  bind:value={formData.license_state}
                  required
                >
                  <option value="">Select State</option>
                  {#each states as state}
                    <option value={state}>{state}</option>
                  {/each}
                </select>
              </div>

              <div class="input-field">
                <label for="license_expiration">License Expiration</label>
                <input
                  id="license_expiration"
                  type="date"
                  bind:value={formData.license_expiration}
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

<style>
  .error {
    color: red;
    font-size: 0.8em;
    margin-top: 0.2em;
  }
</style> 