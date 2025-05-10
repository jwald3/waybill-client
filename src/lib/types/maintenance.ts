export const MAINTENANCE_SERVICE_TYPES = [
  'ROUTINE_MAINTENANCE',
  'EMERGENCY_REPAIR'
] as const;

export type MaintenanceServiceType = typeof MAINTENANCE_SERVICE_TYPES[number]; 