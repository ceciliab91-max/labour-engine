import React, { useState } from 'react';
import type { PayrollResult, CalculationInputs } from '../types/payroll';
import { CCNL_DATASET } from '../data/ccnlData';
import { REGIONS, COMUNI } from '../data/geoData';
import { calculateLevelGap, calculateDismissalIndemnity } from '../utils/payrollEngine';
import { X, Printer, Copy, Check, Scale, ShieldCheck } from 'lucide-react';

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
  const [caseReference, setCaseReference] = useState('Pratica RG n. 2026/1042 — Lavoratore vs Datore');
  const [firmName, setFirmName] = useState('Studio Legale Giuslavoristico & Associati');
  const [copiedReport, setCopiedReport] = useState(false);

  if (!isOpen) return null;

  const currentCategory = CCNL_DATASET.find((c) => c.id === inputs.ccnlId) || CCNL_DATASET[0];
  const currentLevel = currentCategory.levels.find((l) => l.id === inputs.ccnlLevelId) || currentCategory.levels[0];
  const currentRegion = REGIONS.find((r) => r.code === inputs.regionCode) || REGIONS[0];
  const currentComune = COMUNI.find((c) => c.code === inputs.comuneCode) || COMUNI[0];

  const requiredMonthlyBase = inputs.ccnlId === 'custom' ? inputs.customMonthlyBase || 1800 : currentLevel.monthlyBasePay;
  const levelGap = calculateLevelGap(result.totalMonthlyGross, requiredMonthlyBase, result.months);
  const dismissalEstimate = calculateDismissalIndemnity(
    { hiringEra: 'post_2015', companySize: 'large', seniorityYears: 5, noticeMonths: 2 },
    result.totalMonthlyGross
  );

  const ccnlNameDisplay =
    inputs.mode === 'ccnl'
      ? inputs.ccnlId === 'custom'
        ? inputs.customCcnlName || 'CCNL Personalizzato'
        : `${currentCategory.name} — ${currentLevel.name}`
      : `Standard (${inputs.months} Mensilità)`;

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
- Retribuzione Annua Lorda (RAL): € ${Math.round(result.ral).toLocaleString('it-IT')}
- Paga Base Mensile: € ${result.monthlyBasePay.toFixed(2)}
- Superminimo Mensile: € ${result.monthlySuperminimo.toFixed(2)} (${inputs.superminimoType === 'absorbable' ? 'Assorbibile ex art. 2077 c.c.' : 'Ad personam non assorbibile'})
- Sede Lavorativa: Comune di ${currentComune.name} (${currentRegion.name})

2. VERIFICA CONGRUITÀ RETRIBUTIVA & DIFFERENZE (ART. 36 COST.):
- Minimo Tabellare di Diritto: € ${requiredMonthlyBase.toFixed(2)} /mese
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

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(fullReportText);
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
              <h2 className="text-base font-bold">Report Prospetto Retributivo & Parere Giuslavoristico</h2>
              <p className="text-xs text-slate-300">Layout formattato per atti giudiziari, verbali e relazioni per la Direzione HR</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Print Preview */}
        <div className="p-6 space-y-5 text-xs text-slate-800" id="printable-report">
          {/* Editable Header inputs for customization before printing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Riferimento Pratica / Parti</label>
              <input
                type="text"
                value={caseReference}
                onChange={(e) => setCaseReference(e.target.value)}
                className="w-full text-xs font-semibold py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Intestazione Studio / Consulente</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full text-xs font-semibold py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Formatted Report Card */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-xs space-y-4 font-sans print:border-none print:p-0">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-lg font-black text-slate-900">PROSPETTO RETRIBUTIVO & RELAZIONE GIURIDICA</h1>
                <p className="text-xs text-emerald-700 font-bold">{caseReference}</p>
                <p className="text-[11px] text-slate-500">{firmName} — Data: {new Date().toLocaleDateString('it-IT')}</p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  LegalPay Engine TUIR 2026
                </span>
              </div>
            </div>

            {/* Summary Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">RAL Totale</span>
                <div className="text-sm font-black font-mono text-slate-900">€ {Math.round(result.ral).toLocaleString('it-IT')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Netto Mensile</span>
                <div className="text-sm font-black font-mono text-emerald-700">€ {Math.round(result.netPayrollMonthly).toLocaleString('it-IT')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Costo Azienda Mese</span>
                <div className="text-sm font-black font-mono text-slate-900">€ {Math.round(result.totalEmployerCostMonthly).toLocaleString('it-IT')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Congruità Livello</span>
                <div className="text-xs font-bold text-slate-700 truncate">
                  {levelGap.status === 'underpaid_sottoinquadramento' ? 'Sotto-inquadrato' : 'Conforme'}
                </div>
              </div>
            </div>

            {/* Main Analytical Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-2 px-3">Voce</th>
                    <th className="py-2 px-3">Riferimento Normativo</th>
                    <th className="py-2 px-3 text-right">Mensile (€)</th>
                    <th className="py-2 px-3 text-right">Annuale (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-1.5 px-3">Paga Base CCNL + Contingenza</td>
                    <td className="py-1.5 px-3 text-slate-500">{ccnlNameDisplay}</td>
                    <td className="py-1.5 px-3 text-right font-mono">€ {result.monthlyBasePay.toFixed(2)}</td>
                    <td className="py-1.5 px-3 text-right font-mono">€ {(result.monthlyBasePay * result.months).toFixed(2)}</td>
                  </tr>

                  {result.monthlySuperminimo > 0 && (
                    <tr>
                      <td className="py-1.5 px-3 font-semibold">Superminimo Mensile</td>
                      <td className="py-1.5 px-3 text-slate-500">
                        {inputs.superminimoType === 'absorbable' ? 'Assorbibile ex art. 2077 c.c.' : 'Ad personam non assorbibile'}
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold">€ {result.monthlySuperminimo.toFixed(2)}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold">€ {(result.monthlySuperminimo * result.months).toFixed(2)}</td>
                    </tr>
                  )}

                  <tr className="bg-slate-50 font-bold">
                    <td className="py-1.5 px-3">RAL TOTALE LORDA</td>
                    <td className="py-1.5 px-3 text-slate-500 font-normal">{result.months} Mensilità ordinarie</td>
                    <td className="py-1.5 px-3 text-right font-mono">€ {result.totalMonthlyGross.toFixed(2)}</td>
                    <td className="py-1.5 px-3 text-right font-mono">€ {result.ral.toFixed(2)}</td>
                  </tr>

                  <tr>
                    <td className="py-1.5 px-3 text-rose-700">Contributi INPS Dipendente (9,19%)</td>
                    <td className="py-1.5 px-3 text-slate-500">L. 335/95 e s.m.i.</td>
                    <td className="py-1.5 px-3 text-right font-mono text-rose-700">-€ {result.inpsEmployeeMonthly.toFixed(2)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-rose-700">-€ {result.inpsEmployeeYearly.toFixed(2)}</td>
                  </tr>

                  <tr>
                    <td className="py-1.5 px-3 text-rose-700">IRPEF Netta Trattenuta</td>
                    <td className="py-1.5 px-3 text-slate-500">Scaglioni TUIR 2026 (al netto detrazioni)</td>
                    <td className="py-1.5 px-3 text-right font-mono text-rose-700">-€ {result.netIrpefMonthly.toFixed(2)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-rose-700">-€ {result.netIrpefYearly.toFixed(2)}</td>
                  </tr>

                  <tr className="bg-emerald-100/70 font-black text-slate-900">
                    <td className="py-2 px-3 text-emerald-950">NETTO BUSTA PAGA CEDOLINO</td>
                    <td className="py-2 px-3 text-emerald-800 font-semibold">{result.months} mensilità</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-700">€ {result.netPayrollMonthly.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-700">€ {result.netPayrollYearly.toFixed(2)}</td>
                  </tr>

                  <tr className="bg-slate-900 text-white font-black">
                    <td className="py-2 px-3">COSTO TOTALE AZIENDA (GLOBAL BUDGET)</td>
                    <td className="py-2 px-3 text-slate-300 font-normal">RAL + INPS/INAIL Datore + TFR</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-400">€ {result.totalEmployerCostMonthly.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-400">€ {result.totalEmployerCostYearly.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
              <span>LegalPay Engine v2.0 — Labor Law & Compensation Platform</span>
              <span>Documento ad uso legale e consulenziale</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between no-print">
          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-all cursor-pointer"
          >
            {copiedReport ? <Check className="w-4 h-4 mr-1.5 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
            {copiedReport ? 'Copiato in Appunti!' : 'Copia Testo Report'}
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Stampa / Salva PDF
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
