import type { PageServerLoad } from './$types';
import { getDrivers } from '$lib/api/drivers';
import { getTrips } from '$lib/api/trips';
import { getTrucks } from '$lib/api/trucks';
import { getIncidents } from '$lib/api/incidents';

export const load: PageServerLoad = async ({ fetch }) => {
  const [driversRes, tripsRes, trucksRes, incidentsRes] = await Promise.all([
    getDrivers(fetch),
    getTrips(fetch),
    getTrucks(fetch),
    getIncidents(fetch)
  ]);

  // Calculate on-time delivery rate
  const completedTrips = tripsRes.items.filter(trip => 
    trip.status === 'COMPLETED' || trip.status === 'FAILED_DELIVERY'
  );
  const onTimeDeliveries = completedTrips.filter(trip => 
    trip.arrival_time.actual && new Date(trip.arrival_time.actual) <= new Date(trip.arrival_time.scheduled)
  );
  const onTimeRate = completedTrips.length ? 
    ((onTimeDeliveries.length / completedTrips.length) * 100).toFixed(1) : "0.0";

  // Calculate average fuel efficiency
  const tripsWithFuel = tripsRes.items.filter(trip => trip.fuel_usage_gallons > 0 && trip.distance_miles > 0);
  const avgMpg = tripsWithFuel.length ? 
    (tripsWithFuel.reduce((acc, trip) => 
      acc + (trip.distance_miles / trip.fuel_usage_gallons), 0) / tripsWithFuel.length).toFixed(1) : "0.0";

  // Calculate average trip duration in hours
  const tripsWithDuration = tripsRes.items.filter(trip => 
    trip.arrival_time.actual && trip.departure_time.actual
  );
  const avgDuration = tripsWithDuration.length ? 
    (tripsWithDuration.reduce((acc, trip) => {
      const duration = new Date(trip.arrival_time.actual!).getTime() - 
                      new Date(trip.departure_time.actual!).getTime();
      return acc + (duration / (1000 * 60 * 60));
    }, 0) / tripsWithDuration.length).toFixed(1) : "0.0";

  // Calculate truck status distribution
  const truckStatusCounts = trucksRes.items.reduce((acc, truck) => {
    acc[truck.status] = (acc[truck.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get active drivers count
  const activeDrivers = driversRes.items.filter(d => d.employment_status === 'ACTIVE').length;

  return {
    metrics: {
      onTimeRate,
      avgDuration,
      avgMpg,
      activeDrivers,
      totalTrips: tripsRes.total,
      incidentCount: incidentsRes.total
    },
    fleetStatus: [
      { label: 'Available', value: truckStatusCounts['AVAILABLE'] || 0, color: '#10b981' },
      { label: 'In Transit', value: truckStatusCounts['IN_TRANSIT'] || 0, color: '#6366f1' },
      { label: 'Maintenance', value: truckStatusCounts['UNDER_MAINTENANCE'] || 0, color: '#f59e0b' },
      { label: 'Retired', value: truckStatusCounts['RETIRED'] || 0, color: '#ef4444' }
    ],
    recentTrips: tripsRes.items
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(trip => ({
        tripNumber: trip.trip_number,
        distance: trip.distance_miles,
        status: trip.status,
        fuelUsage: trip.fuel_usage_gallons
      })),
    topDrivers: driversRes.items
      .filter(driver => driver.employment_status === 'ACTIVE')
      .slice(0, 3)
      .map(driver => ({
        name: `${driver.first_name} ${driver.last_name}`,
        avatar: `${driver.first_name[0]}${driver.last_name[0]}`,
        state: driver.license_state
      }))
  };
}; 