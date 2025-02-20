<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  
  let isNavExpanded = true;

  // Types matching API response
  interface MaintenanceLog {
    id: string;
    truck: {
      id: string;
      truck_number: string;
      vin: string;
      make: string;
      model: string;
      year: number;
      license_plate: {
        number: string;
        state: string;
      };
      mileage: number;
      status: string;
      trailer_type: string;
      capacity_tons: number;
      fuel_type: string;
      last_maintenance: string;
    };
    date: string;
    service_type: string;
    cost: number;
    notes: string;
    mechanic: string;
    location: string;
    created_at: string;
    updated_at: string;
  }

  // Dummy data matching API structure
  const maintenanceRecords: MaintenanceLog[] = [
    {
      id: "67b0eceac7baa8eb47fafe76",
      truck: {
        id: "67b0d790c7baa8eb47fafe70",
        truck_number: "A236286",
        vin: "2352302832A235",
        make: "Ford",
        model: "F-750",
        year: 2018,
        license_plate: {
          number: "CATS123",
          state: "NY"
        },
        mileage: 150000,
        status: "IN_TRANSIT",
        trailer_type: "DRY_VAN",
        capacity_tons: 5,
        fuel_type: "DIESEL",
        last_maintenance: "2024-02-15"
      },
      date: "2024-03-15",
      service_type: "ROUTINE_MAINTENANCE",
      cost: 2085.29,
      notes: "Regular 50,000 mile service check. Minor wear on brake pads.",
      mechanic: "Alan Michaels",
      location: "Golden Auto Shop, 239 N. Almond Street, Albany, New York",
      created_at: "2024-02-15T19:37:14.299Z",
      updated_at: "2024-02-15T19:37:14.299Z"
    },
    {
      id: "67b0eceac7baa8eb47fafe77",
      truck: {
        id: "67b0d790c7baa8eb47fafe71",
        truck_number: "B445789",
        vin: "78923HJKL456",
        make: "Peterbilt",
        model: "579",
        year: 2020,
        license_plate: {
          number: "TRK4567",
          state: "CA"
        },
        mileage: 98000,
        status: "MAINTENANCE",
        trailer_type: "REFRIGERATED",
        capacity_tons: 8,
        fuel_type: "DIESEL",
        last_maintenance: "2024-01-20"
      },
      date: "2024-03-12",
      service_type: "REPAIR",
      cost: 3450.00,
      notes: "Brake system inspection and repair. Replaced brake pads and rotors.",
      mechanic: "Sarah Chen",
      location: "TruckCare Center, 1234 Industry Ave, Los Angeles, California",
      created_at: "2024-02-15T19:37:14.299Z",
      updated_at: "2024-02-15T19:37:14.299Z"
    },
    {
      id: "67b0eceac7baa8eb47fafe78",
      truck: {
        id: "67b0d790c7baa8eb47fafe72",
        truck_number: "C789012",
        vin: "ABCD123456789",
        make: "Kenworth",
        model: "T680",
        year: 2021,
        license_plate: {
          number: "XYZ789",
          state: "TX"
        },
        mileage: 75000,
        status: "AVAILABLE",
        trailer_type: "FLATBED",
        capacity_tons: 6,
        fuel_type: "DIESEL",
        last_maintenance: "2024-02-01"
      },
      date: "2024-03-10",
      service_type: "EMERGENCY",
      cost: 1875.50,
      notes: "Emergency repair for engine overheating. Replaced coolant and thermostat.",
      mechanic: "Robert Martinez",
      location: "Truck Masters, 567 Fleet Street, Houston, Texas",
      created_at: "2024-02-15T19:37:14.299Z",
      updated_at: "2024-02-15T19:37:14.299Z"
    }
  ];

  // Maintenance statistics
  const stats = {
    routine: maintenanceRecords.filter(r => r.service_type === 'ROUTINE_MAINTENANCE').length,
    repair: maintenanceRecords.filter(r => r.service_type === 'REPAIR').length,
    emergency: maintenanceRecords.filter(r => r.service_type === 'EMERGENCY').length,
    totalCost: maintenanceRecords.reduce((sum, record) => sum + record.cost, 0)
  };

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<Layout {isNavExpanded}>
  <div class="maintenance">
    <h1 class="maintenance-title">Maintenance Management</h1>

    <div class="stats-grid">
      <Card title="Routine Maintenance" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.routine}</p>
          <p class="stat-label">Services</p>
        </div>
      </Card>

      <Card title="Repairs" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.repair}</p>
          <p class="stat-label">Active repairs</p>
        </div>
      </Card>

      <Card title="Emergency Services" icon={icons.maintenance}>
        <div class="stat-content warning">
          <p class="stat-number">{stats.emergency}</p>
          <p class="stat-label">Critical issues</p>
        </div>
      </Card>

      <Card title="Total Costs" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{formatCurrency(stats.totalCost)}</p>
          <p class="stat-label">This period</p>
        </div>
      </Card>
    </div>

    <Card title="Maintenance Records" icon={icons.maintenance}>
      <div class="maintenance-list">
        {#each maintenanceRecords as record}
          <div class="maintenance-item">
            <div class="item-header">
              <div class="item-title">
                <h3>{record.truck.make} {record.truck.model} ({record.truck.truck_number})</h3>
                <span class="chip {record.service_type.toLowerCase()}">{record.service_type.replace('_', ' ')}</span>
              </div>
              <div class="cost">
                {formatCurrency(record.cost)}
              </div>
            </div>

            <div class="item-details">
              <div class="detail">
                <span class="label">Date:</span>
                <span class="value">{formatDate(record.date)}</span>
              </div>
              <div class="detail">
                <span class="label">Mechanic:</span>
                <span class="value">{record.mechanic}</span>
              </div>
              <div class="detail">
                <span class="label">Mileage:</span>
                <span class="value">{record.truck.mileage.toLocaleString()} miles</span>
              </div>
              <div class="detail">
                <span class="label">Location:</span>
                <span class="value">{record.location}</span>
              </div>
            </div>

            <p class="description">{record.notes}</p>

            <div class="item-actions">
              <button class="action-button">View Full Details</button>
              <button class="action-button">Update Record</button>
            </div>
          </div>
        {/each}
      </div>
    </Card>
  </div>
</Layout>

<style>
  .maintenance {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .maintenance-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .maintenance-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-content {
    text-align: center;
    padding: 1.5rem;
  }

  .stat-content.warning .stat-number {
    color: #ef4444;
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 800;
    color: var(--theme-color);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .maintenance-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .maintenance-item {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .maintenance-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: var(--theme-color);
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .item-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .item-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .chip {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .chip.routine_maintenance {
    background: #dbeafe;
    color: #2563eb;
  }

  .chip.repair {
    background: #fef3c7;
    color: #d97706;
  }

  .chip.emergency {
    background: #fee2e2;
    color: #dc2626;
  }

  .item-priority {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
  }

  .item-priority.high {
    background: #fee2e2;
    color: #dc2626;
  }

  .item-priority.medium {
    background: #fef3c7;
    color: #d97706;
  }

  .item-priority.critical {
    background: #fecaca;
    color: #b91c1c;
  }

  .item-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .detail {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .value {
    font-weight: 500;
    color: var(--text-primary);
  }

  .description {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .item-actions {
    display: flex;
    gap: 1rem;
  }

  .action-button {
    padding: 0.625rem 1.25rem;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: 8px;
    color: var(--theme-color);
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .action-button:hover {
    background: var(--theme-color);
    color: white;
  }

  .cost {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--theme-color);
  }

  @media (max-width: 768px) {
    .maintenance {
      padding: 1rem;
    }

    .maintenance-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .maintenance-item {
      padding: 1rem;
    }

    .item-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .item-details {
      grid-template-columns: 1fr;
    }

    .item-actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
    }
  }
</style> 