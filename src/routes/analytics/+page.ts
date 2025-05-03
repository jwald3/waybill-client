import type { PageLoad } from './$types';
import { getTrips } from '$lib/api/trips';
import { getTrucks } from '$lib/api/trucks';
import { getIncidents } from '$lib/api/incidents';
import { getMaintenanceLogs } from '$lib/api/maintenance';

// Force client-side rendering
export const ssr = false;
export const csr = true;

// Add error type
type LoadError = {
  message: string;
  code: string;
};

export const load: PageLoad = async ({ fetch }) => {
  try {
    const [ tripsRes, trucksRes, incidentsRes, maintenanceRes] = await Promise.all([
      getTrips(fetch),
      getTrucks(fetch),
      getIncidents(fetch),
      getMaintenanceLogs(fetch)
    ]);

    // Check if any of the responses are null/undefined
    if (!tripsRes || !trucksRes || !incidentsRes || !maintenanceRes) {
      throw new Error('Failed to load one or more required data sources');
    }

    // Ensure we have valid response objects with items arrays
    const trips = tripsRes?.items || [];
    const trucks = trucksRes?.items || [];
    const incidents = incidentsRes?.items || [];
    const maintenance = maintenanceRes?.items || [];

    // Delivery Performance
    const completedTrips = trips.filter(trip => trip.status === 'COMPLETED');
    const onTimeDeliveries = completedTrips.filter(trip => 
      trip.arrival_time?.actual && new Date(trip.arrival_time.actual) <= new Date(trip.arrival_time.scheduled)
    );
    const onTimeRate = completedTrips.length ? 
      ((onTimeDeliveries.length / completedTrips.length) * 100).toFixed(1) : "0.0";
    const failedDeliveries = trips.filter(trip => trip.status === 'CANCELED').length;

    // Fleet Efficiency
    const tripsWithFuel = trips.filter(trip => trip.fuel_usage_gallons > 0 && trip.distance_miles > 0);
    const avgMpg = tripsWithFuel.length ? 
      (tripsWithFuel.reduce((acc, trip) => 
        acc + (trip.distance_miles / trip.fuel_usage_gallons), 0) / tripsWithFuel.length).toFixed(1) : "0.0";
    
    const totalFuelUsage = tripsWithFuel.reduce((acc, trip) => acc + trip.fuel_usage_gallons, 0);
    const totalMileage = tripsWithFuel.reduce((acc, trip) => acc + trip.distance_miles, 0);

    // Maintenance Stats
    const totalMaintenanceCost = maintenance.reduce((acc, log) => acc + log.cost, 0);
    const maintenanceByType = maintenance.reduce((acc, log) => {
      acc[log.service_type] = (acc[log.service_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Fleet Status
    const truckStatusCounts = trucks.reduce((acc, truck) => {
      acc[truck.status] = (acc[truck.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Trip Status Distribution
    const tripStatusCounts = trips.reduce((acc, trip) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      metrics: {
        fleet: {
          total: trucksRes?.total || 0,
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
        trips: trips
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(trip => ({
            id: trip.id,
            tripNumber: trip.trip_number,
            distance: trip.distance_miles,
            status: trip.status,
            fuelUsage: trip.fuel_usage_gallons,
            scheduledArrival: trip.arrival_time.scheduled
          })),
        incidents: incidents
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(incident => ({
            id: incident.id,
            type: incident.type,
            description: incident.description,
            date: incident.date,
            damageEstimate: incident.damage_estimate
          })),
        maintenance: maintenance
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
          .map(log => ({
            id: log.id,
            type: log.service_type,
            cost: log.cost,
            date: log.date,
            notes: log.notes
          }))
      },
      error: null as LoadError | null
    };
  } catch (error) {
    console.error('Error loading analytics data:', error);
    
    return {
      metrics: {
        fleet: {
          total: 0,
          available: 0,
          inTransit: 0,
          underMaintenance: 0
        },
        delivery: {
          onTimeRate: "0.0",
          totalDeliveries: 0,
          failedDeliveries: 0,
          activeTrips: 0
        },
        efficiency: {
          avgMpg: "0.0",
          totalFuelUsage: "0.0",
          totalMileage: "0",
          maintenanceCost: "0.00"
        }
      },
      charts: {
        fleetStatus: [],
        maintenanceTypes: []
      },
      recentData: {
        trips: [],
        incidents: [],
        maintenance: []
      },
      error: {
        message: 'Unable to load analytics data. Please try refreshing the page.',
        code: 'DATA_LOAD_ERROR'
      } as LoadError
    };
  }
}; 