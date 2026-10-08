import React, { useState } from 'react';
import type { PayrollResult, CalculationInputs } from '../types/payroll';
import { CCNL_DATASET } from '../data/ccnlData';
import { REGIONS, COMUNI } from '../data/geoData';
import { calculateLevelGap, calculateDismissalIndemnity, calculateSettlement } from '../utils/payrollEngine';
import { X, Printer, Copy, Check, Scale, ShieldCheck, FileText, FileCheck } from 'lucide-react';

interface ExportLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PayrollResult;
  inputs: CalculationInputs;
}

export const ExportLegalModal: React.FC<ExportLegalModalProps> = ({
  isOpen,
  onClose,
  result,
  inputs,
}) => {
  const [activeTab, setActiveTab] = useState<'prospetto' | 'verbale'>('prospetto');
  const [caseReference, setCaseReference] = useState('Pratica RG n. 2026/1042 — Lavoratore vs Datore');
  const [firmName, setFirmName] = useState('Studio Legale Giuslavoristico & Associati');
  const [workerName, setWorkerName] = useState('Mario Rossi');
  const [employerName, setEmployerName] = useState('Azienda S.p.A.');
  const [grossOfferAmount, setGrossOfferAmount] = useState(20000);
  const [taxRateOverride, setTaxRateOverride] = useState(Math.round(result.effectiveIrpefTaxRate) || 23);
  const [copiedReport, setCopiedReport] = useState(false);

  if (!isOpen) return null;

  const currentCategory = CCNL_DATASET.find((c) => c.id === inputs.ccnlId) || CCNL_DATASET[0];
  const currentLevel = currentCategory.levels.find((l) => l.id === inputs.ccnlLevelId) || currentCategory.levels[0];
  const currentRegion = REGIONS.find((r) => r.code === inputs.regionCode) || REGIONS[0];
  const currentComune = COMUNI.find((c) => c.code === inputs.comuneCode) || COMUNI[0];

  const minimoTabellareBase = inputs.ccnlId === 'custom' ? inputs.customMonthlyBase || 1800 : currentLevel.monthlyBasePay;
  const contractType = inputs.contractType || 'full-time';
  const partTimeFactor = inputs.partTimeFactor ?? inputs.workCoefficient ?? 1;

  const levelGap = calculateLevelGap(
    result.totalMonthlyGross,
    minimoTabellareBase,
    result.months,
    contractType,
    partTimeFactor
  );
  const dismissalEstimate = calculateDismissalIndemnity(
    { hiringEra: 'post_2015', companySize: 'large', seniorityYears: 5, noticeMonths: 2 },
    result.totalMonthlyGross
  );

  const settlement = calculateSettlement({
    grossOfferAmount,
    seniorityYears: 5,
    taxCategory: 'transazione_2113',
    averageTaxRateOverride: taxRateOverride,
  });

  const ccnlNameDisplay =
    inputs.mode === 'ccnl'
      ? inputs.ccnlId === 'custom'
        ? inputs.customCcnlName || 'CCNL Personalizzato'
        : `${currentCategory.name} — ${currentLevel.name}`
      : `Standard (${inputs.months} Mensilità)`;

  const formattedLordo = settlement.grossOfferAmount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedAliquota = settlement.estimatedTaxRate.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  const formattedRitenuta = settlement.taxAmount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedNetto = settlement.netSettlementAmount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fullReportText = `====================================================================
PROSPETTO RETRIBUTIVO & RELAZIONE PER ATTI / CONCILIAZIONI GIUSLAVORISTICHE
LegalPay Engine — TUIR 2026 & CCNL Compliant
Riferimento: ${caseReference}
Emesso da: ${firmName}
Data: ${new Date().toLocaleDateString('it-IT')}
====================================================================

1. INQUADRAMENTO CONTRATTUALE E RETRIBUZIONE:
- Contratto Collettivo (CCNL): ${ccnlNameDisplay}
- Mensilità Contrattuali: ${result.months}
- Tipologia Orario: ${contractType === 'part-time' ? `Part-time ${(partTimeFactor * 100).toFixed(1)}%` : 'Full-time'}
- Retribuzione Annua Lorda (RAL): € ${Math.round(result.ral).toLocaleString('it-IT')}
- Paga Base Mensile: € ${result.monthlyBasePay.toFixed(2)}
- Superminimo Mensile: € ${result.monthlySuperminimo.toFixed(2)} (${inputs.superminimoType === 'absorbable' ? 'Assorbibile ex art. 2077 c.c.' : 'Ad personam non assorbibile'})
- Sede Lavorativa: Comune di ${currentComune.name} (${currentRegion.name})

2. VERIFICA CONGRUITÀ RETRIBUTIVA & DIFFERENZE (ART. 36 COST.):
- Minimo Tabellare di Diritto: € ${levelGap.requiredLevelMonthlyPay.toFixed(2)} /mese ${contractType === 'part-time' ? `(Riproprozionato Part-time ${(partTimeFactor * 100).toFixed(1)}%)` : ''}
- Retribuzione Effettivamente Corrisposta: € ${result.totalMonthlyGross.toFixed(2)} /mese
- Esito Congruità: ${levelGap.status === 'underpaid_sottoinquadramento' ? `SOTTO-INQUADRAMENTO RETRIBUTIVO (-€ ${Math.abs(Math.round(levelGap.monthlyDelta))} /mese | Credito 5 Anni: € ${Math.abs(Math.round(levelGap.fiveYearPrescriptionDelta)).toLocaleString('it-IT')})` : `Retribuzione Conforme / Superminimo (+€ ${Math.round(levelGap.monthlyDelta)} /mese)`}

3. RISCHIO RISARCITORIO LICENZIAMENTO (JOBS ACT / ART. 18):
- Riferimento Normativo: ${dismissalEstimate.normativeReference}
- Stima Risarcimento Licenziamento Illegittimo (${dismissalEstimate.estimatedMonths} mensilità): € ${Math.round(dismissalEstimate.estimatedIndemnityAmount).toLocaleString('it-IT')}
- Mancato Preavviso (${dismissalEstimate.noticeMonths} mesi): € ${Math.round(dismissalEstimate.noticePayAmount).toLocaleString('it-IT')}
- Esposizione Totale Stimata: € ${Math.round(dismissalEstimate.totalEstimatedExposure).toLocaleString('it-IT')}

4. SINTESI CEDOLINO E FISCALITÀ DIPENDENTE:
- Contributi IVS INPS Dipendente (9,19%): € ${result.inpsEmployeeYearly.toFixed(2)} /anno (€ ${result.inpsEmployeeMonthly.toFixed(2)} /mese)
- Imponibile Fiscale IRPEF: € ${result.taxableIrpefYearly.toFixed(2)} /anno
- Imposta IRPEF Lorda (Scaglioni TUIR 2026): € ${result.grossIrpefYearly.toFixed(2)} /anno
- Detrazione Lavoro Dipendente (Art. 13 TUIR): € ${result.employmentDeductionYearly.toFixed(2)} /anno
- Detrazioni Carichi di Famiglia (Art. 12 TUIR): € ${result.totalFamilyDeductionsYearly.toFixed(2)} /anno
- IRPEF Netta Trattenuta: € ${result.netIrpefYearly.toFixed(2)} /anno

--------------------------------------------------------------------
NETTO CEDOLINO BUSTA PAGA: € ${Math.round(result.netPayrollMonthly).toLocaleString('it-IT')} /mese (€ ${Math.round(result.netPayrollYearly).toLocaleString('it-IT')} /anno)
${result.assegnoUnicoMonthlyEstimate > 0 ? `+ Assegno Unico INPS (Fuori Busta): € ${Math.round(result.assegnoUnicoMonthlyEstimate).toLocaleString('it-IT')} /mese` : ''}
NETTO REALE COMPLESSIVO: € ${Math.round(result.realTotalMonthlyNet).toLocaleString('it-IT')} /mese
--------------------------------------------------------------------

5. COSTO GLOBALE AZIENDA (EMPLOYER BUDGET):
- Accantonamento Quota TFR Annuo (Art. 2120 c.c.): € ${result.tfrYearlyAccrual.toFixed(2)} /anno
- Oneri Previdenziali Datore (INPS/INAIL): € ${(result.employerInpsYearly + result.employerInailYearly + result.employerFundsYearly).toFixed(2)} /anno
- COSTO TOTALE AZIENDA: € ${Math.round(result.totalEmployerCostMonthly).toLocaleString('it-IT')} /mese (€ ${Math.round(result.totalEmployerCostYearly).toLocaleString('it-IT')} /anno)
- Incidenza Cuneo Fiscale Complessivo: ${result.cuneoFiscalePercentage.toFixed(1)}%

Documento generato tramite LegalPay Engine per uso professionale.`;

  const conciliationText = `VERBALE DI CONCILIAZIONE IN SEDE PROTETTA (EX ART. 2113 C.C. / ARTT. 410, 411 C.P.C.)

Riferimento: ${caseReference}
Assistenza Legale / Intestazione: ${firmName}
Data: ${new Date().toLocaleDateString('it-IT')}

Parti: ${workerName} (Lavoratore) / ${employerName} (Datore di Lavoro)

Le Parti convenute avanti alla Commissione di Conciliazione concordano la risoluzione tombale di ogni ed qualsiasi pretesa derivante dall'intercorso rapporto di lavoro, mediante l'erogazione in favore del Lavoratore della somma lorda omnicomprensiva di € ${formattedLordo} a titolo di transazione novativa risarcitoria.

DISCIPLINA FISCALE E PREVIDENZIALE:
1. Ai sensi dell'Art. 17, comma 1, lett. a) TUIR e dell'Art. 19 TUIR, sulla predetta somma si applica la ritenuta d'imposta a titolo di tassazione separata con aliquota media presunta del ${formattedAliquota}%, pari ad € ${formattedRitenuta}, per un importo netto erogato in favore del Lavoratore di € ${formattedNetto}.
2. Le Parti danno atto che la predetta somma risarcitoria è interamente esente da contributi previdenziali ed assistenziali INPS ed INAIL (0,00 €) sia a carico del Lavoratore che a carico della Società, ai sensi dell'Art. 12, L. 153/1969 e s.m.i.
3. Il presente verbale rende la transazione inoppugnabile ai sensi dell'Art. 2113, comma 4, c.c.

[Spazio per firme]
Firma del Lavoratore: _______________________
Firma del Datore di Lavoro: _______________________
Per la Commissione: _______________________`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const textToCopy = activeTab === 'prospetto' ? fullReportText : conciliationText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Esportazione Documenti Legali & Prospetti</h2>
              <p className="text-xs text-slate-300">Layout formattato A4 per atti giudiziari, verbali 2113 c.c. e direzioni HR</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Controls & Document Tab Selector (no-print) */}
        <div className="no-print bg-slate-100/80 px-6 py-3 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Seleziona Tipo Documento da Stampare / Esportare:
            </span>

            {/* Document Selector Tabs */}
            <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('prospetto')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'prospetto'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prospetto Economico</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('verbale')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'verbale'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verbale Conciliazione 2113 c.c.</span>
              </button>
            </div>
          </div>

          {/* Editable Headers & Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Riferimento Pratica / Parti</label>
              <input
                type="text"
                value={caseReference}
                onChange={(e) => setCaseReference(e.target.value)}
                className="w-full font-semibold py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Intestazione Studio / Consulente</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full font-semibold py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {activeTab === 'verbale' && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Lavoratore</label>
                  <input
                    type="text"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full font-semibold py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ragione Sociale Datore</label>
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="w-full font-semibold py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Importo Lordo Transazione (€)</label>
                  <input
                    type="number"
                    step={500}
                    value={grossOfferAmount}
                    onChange={(e) => setGrossOfferAmount(Number(e.target.value) || 0)}
                    className="w-full font-bold font-mono py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aliquota Tassazione Separata (%)</label>
                  <input
                    type="number"
                    step={0.5}
                    min={15}
                    max={43}
                    value={taxRateOverride}
                    onChange={(e) => setTaxRateOverride(Number(e.target.value) || 23)}
                    className="w-full font-bold font-mono py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal Body / Printable Container */}
        <div className="p-6 text-xs text-slate-800" id="printable-report">
          {activeTab === 'prospetto' ? (
            /* Document 1: Prospetto Economico Retributivo */
            <div className="bg-white border border-slate-300 rounded-xl p-6 space-y-4 font-sans print-break-inside-avoid print:border-none print:p-0">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h1 className="text-base font-black text-slate-900 tracking-tight">PROSPETTO RETRIBUTIVO & RELAZIONE GIURIDICA</h1>
                  <p className="text-xs text-emerald-700 font-bold mt-0.5">{caseReference}</p>
                  <p className="text-[10px] text-slate-500">{firmName} — Data: {new Date().toLocaleDateString('it-IT')}</p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                    LegalPay Engine TUIR 2026
                  </span>
                </div>
              </div>

              {/* Summary Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">RAL Totale</span>
                  <div className="text-xs font-black font-mono text-slate-900">€ {Math.round(result.ral).toLocaleString('it-IT')}</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Netto Mensile</span>
                  <div className="text-xs font-black font-mono text-emerald-700">€ {Math.round(result.netPayrollMonthly).toLocaleString('it-IT')}</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Costo Azienda Mese</span>
                  <div className="text-xs font-black font-mono text-slate-900">€ {Math.round(result.totalEmployerCostMonthly).toLocaleString('it-IT')}</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Congruità Livello</span>
                  <div className="text-[11px] font-bold text-slate-700 truncate">
                    {levelGap.status === 'underpaid_sottoinquadramento' ? 'Sotto-inquadrato' : 'Conforme'}
                  </div>
                </div>
              </div>

              {/* Main Analytical Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[10px]">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-2.5">Voce</th>
                      <th className="py-1.5 px-2.5">Riferimento Normativo</th>
                      <th className="py-1.5 px-2.5 text-right">Mensile (€)</th>
                      <th className="py-1.5 px-2.5 text-right">Annuale (€)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-1.5 px-2.5">Paga Base CCNL + Contingenza</td>
                      <td className="py-1.5 px-2.5 text-slate-500">{ccnlNameDisplay}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono">€ {result.monthlyBasePay.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono">€ {(result.monthlyBasePay * result.months).toFixed(2)}</td>
                    </tr>

                    {result.monthlySuperminimo > 0 && (
                      <tr>
                        <td className="py-1.5 px-2.5 font-semibold">Superminimo Mensile</td>
                        <td className="py-1.5 px-2.5 text-slate-500">
                          {inputs.superminimoType === 'absorbable' ? 'Assorbibile ex art. 2077 c.c.' : 'Ad personam non assorbibile'}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold">€ {result.monthlySuperminimo.toFixed(2)}</td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold">€ {(result.monthlySuperminimo * result.months).toFixed(2)}</td>
                      </tr>
                    )}

                    <tr className="bg-slate-50 font-bold">
                      <td className="py-1.5 px-2.5">RAL TOTALE LORDA</td>
                      <td className="py-1.5 px-2.5 text-slate-500 font-normal">{result.months} Mensilità ordinarie</td>
                      <td className="py-1.5 px-2.5 text-right font-mono">€ {result.totalMonthlyGross.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono">€ {result.ral.toFixed(2)}</td>
                    </tr>

                    <tr>
                      <td className="py-1.5 px-2.5 text-rose-700">Contributi INPS Dipendente (9,19%)</td>
                      <td className="py-1.5 px-2.5 text-slate-500">L. 335/95 e s.m.i.</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-rose-700">-€ {result.inpsEmployeeMonthly.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-rose-700">-€ {result.inpsEmployeeYearly.toFixed(2)}</td>
                    </tr>

                    <tr>
                      <td className="py-1.5 px-2.5 text-rose-700">IRPEF Netta Trattenuta</td>
                      <td className="py-1.5 px-2.5 text-slate-500">Scaglioni TUIR 2026 (al netto detrazioni)</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-rose-700">-€ {result.netIrpefMonthly.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-rose-700">-€ {result.netIrpefYearly.toFixed(2)}</td>
                    </tr>

                    <tr className="bg-emerald-100/70 font-black text-slate-900">
                      <td className="py-1.5 px-2.5 text-emerald-950">NETTO BUSTA PAGA CEDOLINO</td>
                      <td className="py-1.5 px-2.5 text-emerald-800 font-semibold">{result.months} mensilità</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-emerald-700">€ {result.netPayrollMonthly.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-emerald-700">€ {result.netPayrollYearly.toFixed(2)}</td>
                    </tr>

                    <tr className="bg-slate-900 text-white font-black">
                      <td className="py-1.5 px-2.5">COSTO TOTALE AZIENDA (GLOBAL BUDGET)</td>
                      <td className="py-1.5 px-2.5 text-slate-300 font-normal">RAL + INPS/INAIL Datore + TFR</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-emerald-400">€ {result.totalEmployerCostMonthly.toFixed(2)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono text-emerald-400">€ {result.totalEmployerCostYearly.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-[9px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
                <span>LegalPay Engine v2.0 — Labor Law & Compensation Platform</span>
                <span>Documento ad uso legale e consulenziale</span>
              </div>
            </div>
          ) : (
            /* Document 2: Verbale di Conciliazione Art. 2113 c.c. */
            <div className="bg-white border border-slate-300 rounded-xl p-6 space-y-4 font-sans print-break-inside-avoid print:border-none print:p-0">
              {/* Document Legal Title Header */}
              <div className="text-center border-b border-slate-300 pb-3">
                <h1 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
                  VERBALE DI CONCILIAZIONE IN SEDE PROTETTA
                </h1>
                <p className="text-[11px] font-bold text-slate-700 uppercase mt-0.5">
                  (EX ART. 2113 C.C. / ARTT. 410, 411 C.P.C.)
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium mt-2 px-1">
                  <span><strong>Riferimento:</strong> {caseReference}</span>
                  <span><strong>Data:</strong> {new Date().toLocaleDateString('it-IT')}</span>
                </div>
              </div>

              {/* Legal Parties Context */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <div><strong>Lavoratore:</strong> {workerName}</div>
                <div><strong>Datore di Lavoro:</strong> {employerName}</div>
                <div><strong>Assistenza Legale / Organismo:</strong> {firmName}</div>
              </div>

              {/* Main Conciliation Text */}
              <div className="text-[11px] text-slate-800 leading-relaxed text-justify space-y-3">
                <p>
                  Le Parti convenute avanti alla Commissione di Conciliazione concordano la risoluzione tombale di ogni ed qualsiasi pretesa derivante dall'intercorso rapporto di lavoro, mediante l'erogazione in favore del Lavoratore della somma lorda omnicomprensiva di <strong className="font-extrabold font-mono text-slate-950">€ {formattedLordo}</strong> a titolo di transazione novativa risarcitoria.
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="font-bold uppercase text-[10px] tracking-wide text-slate-900 border-b border-slate-200 pb-0.5">
                    DISCIPLINA FISCALE E PREVIDENZIALE:
                  </div>

                  <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-snug">
                    <li>
                      Ai sensi dell'Art. 17, comma 1, lett. a) TUIR e dell'Art. 19 TUIR, sulla predetta somma si applica la ritenuta d'imposta a titolo di tassazione separata con aliquota media presunta del <strong className="font-mono text-slate-950">{formattedAliquota}%</strong>, pari ad <strong className="font-mono text-rose-700">€ {formattedRitenuta}</strong>, per un importo netto erogato in favore del Lavoratore di <strong className="font-mono text-emerald-800">€ {formattedNetto}</strong>.
                    </li>
                    <li>
                      Le Parti danno atto che la predetta somma risarcitoria è interamente esente da contributi previdenziali ed assistenziali INPS ed INAIL (0,00 €) sia a carico del Lavoratore che a carico della Società, ai sensi dell'Art. 12, L. 153/1969 e s.m.i.
                    </li>
                    <li>
                      Il presente verbale rende la transazione inoppugnabile ai sensi dell'Art. 2113, comma 4, c.c.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Signatures Section */}
              <div className="pt-6 mt-4 border-t border-slate-200 space-y-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Sottoscrizione delle Parti e Attestazione di Autenticità
                </div>

                <div className="grid grid-cols-3 gap-3 text-[10px] text-center pt-2">
                  <div className="space-y-8">
                    <span className="font-bold text-slate-800 block">Firma del Lavoratore</span>
                    <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
                    <span className="text-slate-500 font-mono">({workerName})</span>
                  </div>

                  <div className="space-y-8">
                    <span className="font-bold text-slate-800 block">Firma del Datore di Lavoro</span>
                    <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
                    <span className="text-slate-500 font-mono">({employerName})</span>
                  </div>

                  <div className="space-y-8">
                    <span className="font-bold text-slate-800 block">Per la Commissione</span>
                    <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
                    <span className="text-slate-500 font-mono">(La Commissione di Conciliazione)</span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
                <span>Verbale di Conciliazione Art. 2113 c.c. — LegalPay Engine 2.0</span>
                <span>Copia Conforme per gli usi di legge</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between no-print">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
          >
            {copiedReport ? <Check className="w-4 h-4 mr-1.5 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
            {copiedReport ? 'Copiato in Appunti!' : activeTab === 'prospetto' ? 'Copia Testo Report' : 'Copia Testo Verbale'}
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Stampa / Salva in PDF
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
