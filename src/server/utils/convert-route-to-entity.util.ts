const mapping: Record<string, string> = {
  appointments: 'appointment',
  'insurance-plans': 'insurance_plan',
  organizations: 'organization',
  'patient-records': 'patient_record',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
