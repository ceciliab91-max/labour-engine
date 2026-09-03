import type { RegionOption, ComuneOption } from '../types/payroll';

export const REGIONS: RegionOption[] = [
  { code: 'LOM', name: 'Lombardia', rate: 1.73 },
  { code: 'LAZ', name: 'Lazio', rate: 2.03 },
  { code: 'CAM', name: 'Campania', rate: 2.03 },
  { code: 'VEN', name: 'Veneto', rate: 1.23 },
  { code: 'EMI', name: 'Emilia-Romagna', rate: 1.53 },
  { code: 'PIE', name: 'Piemonte', rate: 1.83 },
  { code: 'TOS', name: 'Toscana', rate: 1.63 },
  { code: 'SIC', name: 'Sicilia', rate: 1.73 },
  { code: 'PUG', name: 'Puglia', rate: 1.63 },
  { code: 'STD', name: 'Altro Standard (1,50%)', rate: 1.50 },
];

export const COMUNI: ComuneOption[] = [
  { code: 'MI', name: 'Milano', regionCode: 'LOM', rate: 0.80 },
  { code: 'RM', name: 'Roma Capitale', regionCode: 'LAZ', rate: 0.90 },
  { code: 'NA', name: 'Napoli', regionCode: 'CAM', rate: 0.80 },
  { code: 'TO', name: 'Torino', regionCode: 'PIE', rate: 0.80 },
  { code: 'BO', name: 'Bologna', regionCode: 'EMI', rate: 0.80 },
  { code: 'FI', name: 'Firenze', regionCode: 'TOS', rate: 0.80 },
  { code: 'PA', name: 'Palermo', regionCode: 'SIC', rate: 0.80 },
  { code: 'BA', name: 'Bari', regionCode: 'PUG', rate: 0.80 },
  { code: 'STD', name: 'Altro Comune Standard', regionCode: 'STD', rate: 0.80 },
];
