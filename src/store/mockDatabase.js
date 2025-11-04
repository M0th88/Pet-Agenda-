// Este archivo simulará nuestra base de datos central.

// (MOCK_USERS se queda igual)
export const MOCK_USERS = [
  { id: 1, name: 'Dueño de Prueba', email: 'test@petagenda.com', role: 'user' },
  { id: 2, name: 'Ana García', email: 'ana@garcia.com', role: 'user' },
  { id: 99, name: 'Admin', email: 'admin@petagenda.com', role: 'admin' },
];

// (MOCK_PETS se queda igual)
export const MOCK_PETS = [
  { id: 1, userId: 1, name: 'Rex', species: 'Perro', breed: 'Pastor Alemán' },
  { id: 2, userId: 1, name: 'Mishi', species: 'Gato', breed: 'Siamés' },
  { id: 3, userId: 2, name: 'Pipo', species: 'Perro', breed: 'Bulldog' },
];

// --- NUEVOS DATOS SIMULADOS ---

// Citas
export const MOCK_APPOINTMENTS = [
  { id: 1, petId: 1, date: '2025-11-10T10:00:00', reason: 'Chequeo anual', status: 'Pendiente' },
  { id: 2, petId: 1, date: '2025-11-20T12:00:00', reason: 'Corte de pelo', status: 'Pendiente' },
  { id: 3, petId: 3, date: '2025-11-12T15:30:00', reason: 'Vacuna Rabia', status: 'Completada' },
];

// Historial Médico (Vacunas, Tratamientos, etc.)
export const MOCK_MEDICAL_RECORDS = [
  { id: 1, petId: 1, type: 'Vacuna', name: 'Rabia (Anual)', date: '2024-12-15' },
  { id: 2, petId: 1, type: 'Tratamiento', name: 'Desparasitación', date: '2025-01-20' },
  { id: 3, petId: 3, type: 'Vacuna', name: 'Rabia', date: '2025-11-12' },
];

// (simulateApiCall se queda igual)
export const simulateApiCall = (delay = 700) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};