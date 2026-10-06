import type {
  CalculationInputs,
  PayrollResult,
  SettlementInputs,
  SettlementResult,
  DismissalInputs,
  DismissalResult,
  LevelGapResult,
} from '../types/payroll';
import { CCNL_DATASET } from '../data/ccnlData';
import { REGIONS, COMUNI } from '../data/geoData';

export function calculatePayroll(inputs: CalculationInputs): PayrollResult {
  const {
    mode,
    ral: inputRal,
    ccnlId,
    ccnlLevelId,
    months,
    superminimoMonthly,
    incentiveType = 'none',
    regionCode,
    comuneCode,
    spouseDependent,
    childrenUnder21,
    children21OrOver,
    otherDependents,
    iseeTier,
    customMonthlyBase,
    workCoefficient = 1,
    contractType = 'full-time',
  } = inputs;

  const coeff = contractType === 'part-time' && workCoefficient ? workCoefficient : 1;

  let monthlyBasePay = 0;
  let monthlySuperminimo = superminimoMonthly || 0;
  let totalMonthlyGross = 0;
  let ral = 0;

  if (mode === 'ral') {
    ral = Math.max(12000, inputRal) * coeff;
    totalMonthlyGross = ral / months;
    monthlyBasePay = totalMonthlyGross - monthlySuperminimo;
    if (monthlyBasePay < 0) {
      monthlyBasePay = totalMonthlyGross;
      monthlySuperminimo = 0;
    }
  } else {
    // Mode 'ccnl'
    if (ccnlId === 'custom') {
      monthlyBasePay = Math.max(0, customMonthlyBase || 0) * coeff;
    } else {
      const selectedCategory = CCNL_DATASET.find((c) => c.id === ccnlId) || CCNL_DATASET[0];
      const selectedLevel = selectedCategory.levels.find((l) => l.id === ccnlLevelId) || selectedCategory.levels[0];
      monthlyBasePay = selectedLevel.monthlyBasePay * coeff;
    }
    totalMonthlyGross = monthlyBasePay + monthlySuperminimo;
    ral = totalMonthlyGross * months;
  }

  // 1. INPS Employee Contribution (9.19%)
  const inpsEmployeeRate = 9.19;
  const inpsEmployeeYearly = ral * 0.0919;
  const inpsEmployeeMonthly = inpsEmployeeYearly / months;

  // 2. Taxable IRPEF Income
  const taxableIrpefYearly = Math.max(0, ral - inpsEmployeeYearly);
  const taxableIrpefMonthly = taxableIrpefYearly / months;

  // 3. Gross IRPEF Calculation (TUIR 2026 3 Brackets)
  let grossIrpefYearly = 0;
  if (taxableIrpefYearly <= 28000) {
    grossIrpefYearly = taxableIrpefYearly * 0.23;
  } else if (taxableIrpefYearly <= 50000) {
    grossIrpefYearly = 28000 * 0.23 + (taxableIrpefYearly - 28000) * 0.35;
  } else {
    grossIrpefYearly = 28000 * 0.23 + 22000 * 0.35 + (taxableIrpefYearly - 50000) * 0.43;
  }
  const grossIrpefMonthly = grossIrpefYearly / months;

  // 4. Employment Deductions (Art. 13 TUIR 2026)
  let employmentDeductionYearly = 0;
  if (taxableIrpefYearly <= 15000) {
    employmentDeductionYearly = 1955;
  } else if (taxableIrpefYearly <= 28000) {
    employmentDeductionYearly = 1910 + 1190 * ((28000 - taxableIrpefYearly) / 13000);
  } else if (taxableIrpefYearly <= 50000) {
    employmentDeductionYearly = 1910 * ((50000 - taxableIrpefYearly) / 22000);
  } else {
    employmentDeductionYearly = 0;
  }
  employmentDeductionYearly = Math.max(0, employmentDeductionYearly);

  // 5. Family Deductions (Art. 12 TUIR)
  let spouseDeductionYearly = 0;
  if (spouseDependent) {
    if (taxableIrpefYearly <= 80000) {
      spouseDeductionYearly = Math.max(0, 800 * ((80000 - taxableIrpefYearly) / 80000));
    }
  }

  let childrenOver21DeductionYearly = 0;
  if (children21OrOver > 0 && taxableIrpefYearly < 95000) {
    const singleChildBase = 950 * ((95000 - taxableIrpefYearly) / 95000);
    childrenOver21DeductionYearly = Math.max(0, singleChildBase * children21OrOver);
  }

  let otherDependentsDeductionYearly = 0;
  if (otherDependents > 0 && taxableIrpefYearly < 80000) {
    const singleOtherBase = 750 * ((80000 - taxableIrpefYearly) / 80000);
    otherDependentsDeductionYearly = Math.max(0, singleOtherBase * otherDependents);
  }

  const totalFamilyDeductionsYearly = spouseDeductionYearly + childrenOver21DeductionYearly + otherDependentsDeductionYearly;
  const totalDeductionsYearly = employmentDeductionYearly + totalFamilyDeductionsYearly;

  // 6. Regional and Municipal Surtaxes
  const selectedRegion = REGIONS.find((r) => r.code === regionCode) || REGIONS[0];
  const selectedComune = COMUNI.find((c) => c.code === comuneCode) || COMUNI[0];

  const regionalAddizionaleRate = selectedRegion.rate;
  const regionalAddizionaleYearly = taxableIrpefYearly * (regionalAddizionaleRate / 100);
  const regionalAddizionaleMonthly = regionalAddizionaleYearly / months;

  const municipalAddizionaleRate = selectedComune.rate;
  const municipalAddizionaleYearly = taxableIrpefYearly * (municipalAddizionaleRate / 100);
  const municipalAddizionaleMonthly = municipalAddizionaleYearly / months;

  // 7. Net IRPEF & Net Payroll
  const irpefAfterDeductions = Math.max(0, grossIrpefYearly - totalDeductionsYearly);
  const netIrpefYearly = irpefAfterDeductions + regionalAddizionaleYearly + municipalAddizionaleYearly;
  const netIrpefMonthly = netIrpefYearly / months;

  const effectiveIrpefTaxRate = taxableIrpefYearly > 0 ? (netIrpefYearly / taxableIrpefYearly) * 100 : 23;

  const netPayrollYearly = ral - inpsEmployeeYearly - netIrpefYearly;
  const netPayrollMonthly = netPayrollYearly / months;

  // 8. Assegno Unico Universale INPS
  let ratePerChildMonthly = 57.0;
  if (iseeTier === 'low') {
    ratePerChildMonthly = 199.0;
  } else if (iseeTier === 'medium') {
    ratePerChildMonthly = 140.0;
  }
  const assegnoUnicoMonthlyEstimate = childrenUnder21 * ratePerChildMonthly;
  const assegnoUnicoYearlyEstimate = assegnoUnicoMonthlyEstimate * 12;

  const realTotalMonthlyNet = netPayrollMonthly + assegnoUnicoMonthlyEstimate;

  // 9. TFR & Employer Costs with Hiring Incentives
  const tfrYearlyAccrual = ral / 13.5 - ral * 0.005;
  const tfrMonthlyAccrual = tfrYearlyAccrual / months;

  const employerInpsRate = 24.0;
  const rawEmployerInpsYearly = ral * (employerInpsRate / 100);

  let incentiveDiscountYearly = 0;
  if (incentiveType === 'under35' || incentiveType === 'donne') {
    const maxDiscountMonthly = 500;
    const maxDiscountYearly = maxDiscountMonthly * 12;
    incentiveDiscountYearly = Math.min(rawEmployerInpsYearly, maxDiscountYearly);
  } else if (incentiveType === 'sud') {
    incentiveDiscountYearly = rawEmployerInpsYearly * 0.30;
  }
  const incentiveDiscountMonthly = incentiveDiscountYearly / months;
  const effectiveEmployerInpsYearly = Math.max(0, rawEmployerInpsYearly - incentiveDiscountYearly);

  const employerInailRate = 0.5;
  const employerInailYearly = ral * (employerInailRate / 100);

  const employerFundsYearly = ral * 0.015;

  const totalEmployerCostYearly = ral + effectiveEmployerInpsYearly + employerInailYearly + employerFundsYearly + tfrYearlyAccrual;
  const totalEmployerCostMonthly = totalEmployerCostYearly / months;

  const cuneoFiscaleTotalYearly = totalEmployerCostYearly - netPayrollYearly;
  const cuneoFiscalePercentage = (cuneoFiscaleTotalYearly / totalEmployerCostYearly) * 100;

  return {
    mode,
    months,
    monthlyBasePay,
    monthlySuperminimo,
    totalMonthlyGross,
    ral,
    inpsEmployeeRate,
    inpsEmployeeYearly,
    inpsEmployeeMonthly,
    taxableIrpefYearly,
    taxableIrpefMonthly,
    grossIrpefYearly,
    grossIrpefMonthly,
    effectiveIrpefTaxRate,
    employmentDeductionYearly,
    spouseDeductionYearly,
    childrenOver21DeductionYearly,
    otherDependentsDeductionYearly,
    totalFamilyDeductionsYearly,
    totalDeductionsYearly,
    regionalAddizionaleRate,
    regionalAddizionaleYearly,
    regionalAddizionaleMonthly,
    municipalAddizionaleRate,
    municipalAddizionaleYearly,
    municipalAddizionaleMonthly,
    netIrpefYearly,
    netIrpefMonthly,
    netPayrollYearly,
    netPayrollMonthly,
    assegnoUnicoMonthlyEstimate,
    assegnoUnicoYearlyEstimate,
    realTotalMonthlyNet,
    tfrYearlyAccrual,
    tfrMonthlyAccrual,
    employerInpsRate,
    rawEmployerInpsYearly,
    incentiveType,
    incentiveDiscountYearly,
    incentiveDiscountMonthly,
    effectiveEmployerInpsYearly,
    employerInpsYearly: effectiveEmployerInpsYearly,
    employerInailRate,
    employerInailYearly,
    employerFundsYearly,
    totalEmployerCostYearly,
    totalEmployerCostMonthly,
    cuneoFiscaleTotalYearly,
    cuneoFiscalePercentage,
  };
}

export function calculateSettlement(inputs: SettlementInputs): SettlementResult {
  const { grossOfferAmount, taxCategory, averageTaxRateOverride } = inputs;
  
  let estimatedTaxRate = 23;
  if (averageTaxRateOverride && averageTaxRateOverride > 0) {
    estimatedTaxRate = averageTaxRateOverride;
  } else {
    if (grossOfferAmount <= 15000) {
      estimatedTaxRate = 23;
    } else if (grossOfferAmount <= 35000) {
      estimatedTaxRate = 27;
    } else if (grossOfferAmount <= 60000) {
      estimatedTaxRate = 32;
    } else {
      estimatedTaxRate = 38;
    }
  }

  const taxAmount = grossOfferAmount * (estimatedTaxRate / 100);
  const inpsEmployeeAmount = 0;
  const inpsEmployerAmount = 0;
  const netSettlementAmount = grossOfferAmount - taxAmount;
  const employerCost = grossOfferAmount;

  let legalNote = '';
  let categoryLabel = '';
  if (taxCategory === 'incentivo_esodo') {
    categoryLabel = "Incentivo all'Esodo (Art. 17 c. 1 lett. a TUIR)";
    legalNote = 'Somma erogata a titolo di incentivo all’esodo ex art. 17, c. 1, lett. a) TUIR. Assoggettata a tassazione separata con aliquota media quinquennale. Interamente esente da contributi INPS sia lavoratore che datore.';
  } else if (taxCategory === 'transazione_2113') {
    categoryLabel = 'Transazione Novativa Risarcitoria (Art. 2113 c.c. / Art. 410 c.p.c.)';
    legalNote = 'Somma pattuita a titolo transattivo novativo ed al fine di prevenire o definire controversie di lavoro ex art. 2113 c.c. Beneficia dell’esenzione contributiva INPS e della tassazione separata IRPEF.';
  } else {
    categoryLabel = 'Anticipazione / Liquidazione TFR Conciliativo';
    legalNote = 'Anticipazione competenze di fine rapporto (TFR) in sede protetta. Soggetta a tassazione separata ai sensi dell’art. 19 TUIR con rivalutazione del montante.';
  }

  const clauseText = `Le Parti concordano l'erogazione in favore del Lavoratore della somma lorda complessiva di € ${grossOfferAmount.toLocaleString('it-IT')},00 a titolo di ${categoryLabel}, da assoggettarsi a ritenuta fiscale con aliquota presunta a titolo di tassazione separata del ${estimatedTaxRate}%, pari ad € ${taxAmount.toLocaleString('it-IT')},00, per un importo netto presunto residuo erogato al Lavoratore di € ${netSettlementAmount.toLocaleString('it-IT')},00. La predetta somma è riconosciuta interamente esente da contributi previdenziali ed assistenziali INPS/INAIL sia a carico del Lavoratore che a carico della Società.`;

  return {
    grossOfferAmount,
    seniorityYears: inputs.seniorityYears,
    estimatedTaxRate,
    taxAmount,
    inpsEmployeeAmount,
    inpsEmployerAmount,
    netSettlementAmount,
    employerCost,
    legalNote,
    clauseText,
  };
}

export function calculateDismissalIndemnity(
  inputs: DismissalInputs,
  monthlyBaseSalary: number
): DismissalResult {
  const { hiringEra, companySize, seniorityYears, noticeMonths, customMonthlySalary } = inputs;
  const baseSalary = customMonthlySalary && customMonthlySalary > 0 ? customMonthlySalary : monthlyBaseSalary;

  let minMonths = 6;
  let maxMonths = 36;
  let estimatedMonths = 12;
  let normativeReference = '';

  if (hiringEra === 'post_2015') {
    if (companySize === 'large') {
      minMonths = 6;
      maxMonths = 36;
      normativeReference = 'D.Lgs. 23/2015 (Grandi Imprese - Art. 3, c. 1 post sent. Corte Cost. 194/2018)';
      estimatedMonths = Math.min(36, Math.max(6, seniorityYears * 2));
    } else {
      minMonths = 3;
      maxMonths = 6;
      normativeReference = 'D.Lgs. 23/2015 (Piccole Imprese ≤15 dip. - Art. 9, max 6 mensilità)';
      estimatedMonths = Math.min(6, Math.max(3, Math.round(seniorityYears * 1)));
    }
  } else {
    if (companySize === 'large') {
      minMonths = 12;
      maxMonths = 24;
      normativeReference = 'Art. 18 L. 300/1970 mod. L. 92/2012 (Tutela Risarcitoria Forfettaria 12-24 mensilità)';
      estimatedMonths = Math.min(24, Math.max(12, 12 + seniorityYears));
    } else {
      minMonths = 2.5;
      maxMonths = 6;
      normativeReference = 'L. 604/1966 Art. 8 (Piccole Imprese, riassunzione o indennità 2,5 - 6 mensilità)';
      estimatedMonths = Math.min(6, Math.max(2.5, 2.5 + seniorityYears * 0.5));
    }
  }

  const minIndemnityAmount = minMonths * baseSalary;
  const maxIndemnityAmount = maxMonths * baseSalary;
  const estimatedIndemnityAmount = estimatedMonths * baseSalary;

  const noticePayAmount = noticeMonths * baseSalary;
  const totalEstimatedExposure = estimatedIndemnityAmount + noticePayAmount;

  return {
    hiringEra,
    companySize,
    seniorityYears,
    monthlyBaseSalary: baseSalary,
    minMonths,
    maxMonths,
    estimatedMonths,
    minIndemnityAmount,
    maxIndemnityAmount,
    estimatedIndemnityAmount,
    noticeMonths,
    noticePayAmount,
    totalEstimatedExposure,
    normativeReference,
  };
}

export function calculateLevelGap(
  actualMonthlyPay: number,
  requiredLevelMonthlyPay: number,
  months: number
): LevelGapResult {
  const monthlyDelta = actualMonthlyPay - requiredLevelMonthlyPay;
  const yearlyDelta = monthlyDelta * months;
  const fiveYearPrescriptionDelta = yearlyDelta * 5;

  let status: LevelGapResult['status'] = 'exact_minimum';
  if (monthlyDelta < -1) {
    status = 'underpaid_sottoinquadramento';
  } else if (monthlyDelta > 1) {
    status = 'overpaid_or_superminimo';
  }

  return {
    actualMonthlyPay,
    requiredLevelMonthlyPay,
    monthlyDelta,
    yearlyDelta,
    fiveYearPrescriptionDelta,
    status,
  };
}
