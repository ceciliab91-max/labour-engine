export type InputMode = 'ral' | 'ccnl';

export type SuperminimoType = 'absorbable' | 'non_absorbable';

export type HiringIncentiveType = 'none' | 'under35' | 'donne' | 'sud';

export interface CcnlLevel {
  id: string;
  name: string;
  monthlyBasePay: number;
  description?: string;
}

export interface CcnlCategory {
  id: string;
  name: string;
  code: string;
  defaultMonths: 13 | 14;
  levels: CcnlLevel[];
  notes?: string;
}

export interface RegionOption {
  code: string;
  name: string;
  rate: number;
}

export interface ComuneOption {
  code: string;
  name: string;
  regionCode: string;
  rate: number;
}

export type ContractType = 'full-time' | 'part-time';
export type PartTimeType = 'orizzontale' | 'verticale' | 'misto';

export interface LabourScheduleData {
  contractType: ContractType;
  partTimeType: PartTimeType | null;
  weeklyHours: number;
  percentage: number;
  coefficient: number;
}

export interface CalculationInputs {
  mode: InputMode;
  ral: number;
  ccnlId: string;
  ccnlLevelId: string;
  months: 13 | 14;
  superminimoMonthly: number;
  superminimoType: SuperminimoType;
  incentiveType: HiringIncentiveType;
  regionCode: string;
  comuneCode: string;
  spouseDependent: boolean;
  childrenUnder21: number;
  children21OrOver: number;
  otherDependents: number;
  iseeTier: 'base' | 'medium' | 'low';
  customMonthlyBase: number;
  customCcnlName: string;
  contractType?: ContractType;
  partTimeType?: PartTimeType | null;
  weeklyHours?: number;
  partTimePercentage?: number;
  workCoefficient?: number;
}

export interface PayrollResult {
  mode: InputMode;
  months: number;
  
  // Base Payroll Figures
  monthlyBasePay: number;
  monthlySuperminimo: number;
  totalMonthlyGross: number;
  ral: number;
  
  // Worker Contributions & IRPEF Base
  inpsEmployeeRate: number;
  inpsEmployeeYearly: number;
  inpsEmployeeMonthly: number;
  taxableIrpefYearly: number;
  taxableIrpefMonthly: number;
  
  // IRPEF Gross Brackets breakdown
  grossIrpefYearly: number;
  grossIrpefMonthly: number;
  effectiveIrpefTaxRate: number;
  
  // Deductions (Art. 13 & Art. 12 TUIR)
  employmentDeductionYearly: number;
  spouseDeductionYearly: number;
  childrenOver21DeductionYearly: number;
  otherDependentsDeductionYearly: number;
  totalFamilyDeductionsYearly: number;
  totalDeductionsYearly: number;
  
  // Local Surtaxes
  regionalAddizionaleRate: number;
  regionalAddizionaleYearly: number;
  regionalAddizionaleMonthly: number;
  
  municipalAddizionaleRate: number;
  municipalAddizionaleYearly: number;
  municipalAddizionaleMonthly: number;
  
  // Final Net Payroll
  netIrpefYearly: number;
  netIrpefMonthly: number;
  
  netPayrollYearly: number;
  netPayrollMonthly: number;
  
  // Assegno Unico INPS
  assegnoUnicoMonthlyEstimate: number;
  assegnoUnicoYearlyEstimate: number;
  
  // Overall Worker Monthly Cash Flow
  realTotalMonthlyNet: number;
  
  // TFR & Employer Cost with Hiring Incentives
  tfrYearlyAccrual: number;
  tfrMonthlyAccrual: number;
  
  employerInpsRate: number;
  rawEmployerInpsYearly: number;
  incentiveType: HiringIncentiveType;
  incentiveDiscountYearly: number;
  incentiveDiscountMonthly: number;
  effectiveEmployerInpsYearly: number;
  employerInpsYearly: number; // Aliased to effectiveEmployerInpsYearly for backward compatibility
  
  employerInailRate: number;
  employerInailYearly: number;
  employerFundsYearly: number;
  
  totalEmployerCostYearly: number;
  totalEmployerCostMonthly: number;
  
  // Tax Wedge Indicators
  cuneoFiscaleTotalYearly: number;
  cuneoFiscalePercentage: number;
}

export interface SettlementInputs {
  grossOfferAmount: number;
  seniorityYears: number;
  taxCategory: 'incentivo_esodo' | 'transazione_2113' | 'tfr_anticipo';
  averageTaxRateOverride?: number;
}

export interface SettlementResult {
  grossOfferAmount: number;
  seniorityYears: number;
  estimatedTaxRate: number;
  taxAmount: number;
  inpsEmployeeAmount: number;
  inpsEmployerAmount: number;
  netSettlementAmount: number;
  employerCost: number;
  legalNote: string;
  clauseText: string;
}

export interface DismissalInputs {
  hiringEra: 'pre_2015' | 'post_2015';
  companySize: 'large' | 'small';
  seniorityYears: number;
  noticeMonths: number;
  customMonthlySalary?: number;
}

export interface DismissalResult {
  hiringEra: 'pre_2015' | 'post_2015';
  companySize: 'large' | 'small';
  seniorityYears: number;
  monthlyBaseSalary: number;
  minMonths: number;
  maxMonths: number;
  estimatedMonths: number;
  minIndemnityAmount: number;
  maxIndemnityAmount: number;
  estimatedIndemnityAmount: number;
  noticeMonths: number;
  noticePayAmount: number;
  totalEstimatedExposure: number;
  normativeReference: string;
}

export interface LevelGapResult {
  actualMonthlyPay: number;
  requiredLevelMonthlyPay: number;
  monthlyDelta: number;
  yearlyDelta: number;
  fiveYearPrescriptionDelta: number;
  status: 'overpaid_or_superminimo' | 'underpaid_sottoinquadramento' | 'exact_minimum';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isDocument?: boolean;
}
