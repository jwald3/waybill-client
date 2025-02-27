<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { goto } from '$app/navigation';
  
  let formData = {
    first_name: '',
    last_name: '',
    dob: '',
    license_number: '',
    license_state: '',
    license_expiration: '',
    phone: '',
    email: '',
    address: {
      Street: '',
      City: '',
      State: '',
      Zip: ''
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
      const response = await fetch('http://localhost:8000/api/v1/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create driver');
      }

      goto('/drivers');
    } catch (error) {
      console.error('Error creating driver:', error);
    }
  }

  function handleCancel() {
    goto('/drivers');
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
                  bind:value={formData.address.Street}
                  required
                />
              </div>

              <div class="input-field">
                <label for="city">City</label>
                <input
                  id="city"
                  type="text"
                  bind:value={formData.address.City}
                  required
                />
              </div>

              <div class="input-field">
                <label for="state">State</label>
                <select
                  id="state"
                  bind:value={formData.address.State}
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
                  bind:value={formData.address.Zip}
                  required
                  pattern="[0-9]{5}"
                />
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