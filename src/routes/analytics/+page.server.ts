import type { PageServerLoad } from './$types';
import { getDrivers } from '$lib/api/drivers';
import { getTrips } from '$lib/api/trips';
import { getTrucks } from '$lib/api/trucks';
import { getIncidents } from '$lib/api/incidents';
import { getMaintenanceLogs } from '$lib/api/maintenance';

export const load: PageServerLoad = async ({ fetch }) => {
  const [driversRes, tripsRes, trucksRes, incidentsRes, maintenanceRes] = await Promise.all([
    getDrivers(fetch),
    getTrips(fetch),
    getTrucks(fetch),
    getIncidents(fetch),
    getMaintenanceLogs(fetch)
  ]);

  // Delivery Performance
  const completedTrips = tripsRes.items.filter(trip => 
    trip.status === 'COMPLETED' || trip.status === 'FAILED_DELIVERY'
  );
  const onTimeDeliveries = completedTrips.filter(trip => 
    trip.arrival_time.actual && new Date(trip.arrival_time.actual) <= new Date(trip.arrival_time.scheduled)
  );
  const onTimeRate = completedTrips.length ? 
    ((onTimeDeliveries.length / completedTrips.length) * 100).toFixed(1) : "0.0";
  const failedDeliveries = completedTrips.filter(trip => trip.status === 'FAILED_DELIVERY').length;

  // Fleet Efficiency
  const tripsWithFuel = tripsRes.items.filter(trip => trip.fuel_usage_gallons > 0 && trip.distance_miles > 0);
  const avgMpg = tripsWithFuel.length ? 
    (tripsWithFuel.reduce((acc, trip) => 
      acc + (trip.distance_miles / trip.fuel_usage_gallons), 0) / tripsWithFuel.length).toFixed(1) : "0.0";
  
  const totalFuelUsage = tripsWithFuel.reduce((acc, trip) => acc + trip.fuel_usage_gallons, 0);
  const totalMileage = tripsWithFuel.reduce((acc, trip) => acc + trip.distance_miles, 0);

  // Maintenance Stats
  const totalMaintenanceCost = maintenanceRes.items.reduce((acc, log) => acc + log.cost, 0);
  const maintenanceByType = maintenanceRes.items.reduce((acc, log) => {
    acc[log.service_type] = (acc[log.service_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Fleet Status
  const truckStatusCounts = trucksRes.items.reduce((acc, truck) => {
    acc[truck.status] = (acc[truck.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Trip Status Distribution
  const tripStatusCounts = tripsRes.items.reduce((acc, trip) => {
    acc[trip.status] = (acc[trip.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    metrics: {
      fleet: {
        total: trucksRes.total,
        available: truckStatusCounts['AVAILABLE'] || 0,
        inTransit: truckStatusCounts['IN_TRANSIT'] || 0,
        underMaintenance: truckStatusCounts['UNDER_MAINTENANCE'] || 0
      },
      delivery: {
        onTimeRate,
        totalDeliveries: completedTrips.length,
        failedDeliveries,
        activeTrips: tripStatusCounts['IN_PROGRESS'] || 0
      },
      efficiency: {
        avgMpg,
        totalFuelUsage: totalFuelUsage.toFixed(1),
        totalMileage: totalMileage.toFixed(0),
        maintenanceCost: totalMaintenanceCost.toFixed(2)
      }
    },
    charts: {
      fleetStatus: [
        { label: 'Available', value: truckStatusCounts['AVAILABLE'] || 0, color: '#10b981' },
        { label: 'In Transit', value: truckStatusCounts['IN_TRANSIT'] || 0, color: '#6366f1' },
        { label: 'Maintenance', value: truckStatusCounts['UNDER_MAINTENANCE'] || 0, color: '#f59e0b' },
        { label: 'Retired', value: truckStatusCounts['RETIRED'] || 0, color: '#ef4444' }
      ],
      maintenanceTypes: [
        { label: 'Routine', value: maintenanceByType['ROUTINE_MAINTENANCE'] || 0, color: '#10b981' },
        { label: 'Repair', value: maintenanceByType['REPAIR'] || 0, color: '#f59e0b' },
        { label: 'Emergency', value: maintenanceByType['EMERGENCY'] || 0, color: '#ef4444' }
      ]
    },
    recentData: {
      trips: tripsRes.items
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(trip => ({
          tripNumber: trip.trip_number,
          distance: trip.distance_miles,
          status: trip.status,
          fuelUsage: trip.fuel_usage_gallons,
          scheduledArrival: trip.arrival_time.scheduled
        })),
      incidents: incidentsRes.items
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(incident => ({
          type: incident.type,
          description: incident.description,
          date: incident.date,
          damageEstimate: incident.damage_estimate
        })),
      maintenance: maintenanceRes.items
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(log => ({
          type: log.service_type,
          cost: log.cost,
          date: log.date,
          notes: log.notes
        }))
    }
  };
}; 