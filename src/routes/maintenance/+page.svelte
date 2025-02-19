<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  
  let isNavExpanded = true;

  // Dummy data for maintenance records
  const maintenanceRecords = [
    {
      id: 'M1001',
      truck: 'Truck #1234',
      type: 'Scheduled',
      status: 'Due',
      dueDate: '2024-03-15',
      description: 'Regular 50,000 mile service',
      priority: 'High',
      assignedTo: 'Mike Smith'
    },
    {
      id: 'M1002',
      truck: 'Truck #2156',
      type: 'Repair',
      status: 'In Progress',
      dueDate: '2024-03-12',
      description: 'Brake system inspection',
      priority: 'Medium',
      assignedTo: 'John Doe'
    },
    {
      id: 'M1003',
      truck: 'Truck #3789',
      type: 'Emergency',
      status: 'Completed',
      dueDate: '2024-03-10',
      description: 'Engine overheating issue',
      priority: 'Critical',
      assignedTo: 'Sarah Johnson'
    }
  ];

  // Maintenance statistics
  const stats = {
    scheduled: 12,
    inProgress: 4,
    completed: 28,
    overdue: 2
  };
</script>

<Layout {isNavExpanded}>
  <div class="maintenance">
    <h1 class="maintenance-title">Maintenance Management</h1>

    <div class="stats-grid">
      <Card title="Scheduled" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.scheduled}</p>
          <p class="stat-label">Upcoming services</p>
        </div>
      </Card>

      <Card title="In Progress" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.inProgress}</p>
          <p class="stat-label">Active repairs</p>
        </div>
      </Card>

      <Card title="Completed" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.completed}</p>
          <p class="stat-label">This month</p>
        </div>
      </Card>

      <Card title="Overdue" icon={icons.maintenance}>
        <div class="stat-content warning">
          <p class="stat-number">{stats.overdue}</p>
          <p class="stat-label">Need attention</p>
        </div>
      </Card>
    </div>

    <Card title="Maintenance Schedule" icon={icons.maintenance}>
      <div class="maintenance-list">
        {#each maintenanceRecords as record}
          <div class="maintenance-item">
            <div class="item-header">
              <div class="item-title">
                <h3>{record.truck}</h3>
                <span class="chip {record.status.toLowerCase()}">{record.status}</span>
              </div>
              <div class="item-priority {record.priority.toLowerCase()}">
                {record.priority} Priority
              </div>
            </div>

            <div class="item-details">
              <div class="detail">
                <span class="label">Type:</span>
                <span class="value">{record.type}</span>
              </div>
              <div class="detail">
                <span class="label">Due Date:</span>
                <span class="value">{record.dueDate}</span>
              </div>
              <div class="detail">
                <span class="label">Assigned To:</span>
                <span class="value">{record.assignedTo}</span>
              </div>
            </div>

            <p class="description">{record.description}</p>

            <div class="item-actions">
              <button class="action-button">View Details</button>
              <button class="action-button">Update Status</button>
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

  .chip.due {
    background: #fef3c7;
    color: #d97706;
  }

  .chip.completed {
    background: #dcfce7;
    color: #059669;
  }

  .chip.in.progress {
    background: #dbeafe;
    color: #3b82f6;
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