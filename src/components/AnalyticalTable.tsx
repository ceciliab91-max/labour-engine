import React from 'react';
import type { PayrollResult, CalculationInputs } from '../types/payroll';
import { CCNL_DATASET } from '../data/ccnlData';
import { REGIONS, COMUNI } from '../data/geoData';
import { Table, CheckCircle2 } from 'lucide-react';

interface AnalyticalTableProps {
  result: PayrollResult;
  inputs: CalculationInputs;
}

export const AnalyticalTable: React.FC<AnalyticalTableProps> = ({
  result,
  inputs,
}) => {
  const currentCategory =
    CCNL_DATASET.find((c) => c.id === inputs.ccnlId) || CCNL_DATASET[0];
  const currentLevel =
    currentCategory.levels.find((l) => l.id === inputs.ccnlLevelId) ||
    currentCategory.levels[0];
  const currentRegion =
    REGIONS.find((r) => r.code === inputs.regionCode) || REGIONS[0];
  const currentComune =
    COMUNI.find((c) => c.code === inputs.comuneCode) || COMUNI[0];

  const ccnlNameDisplay =
    inputs.mode === 'ccnl'
      ? inputs.ccnlId === 'custom'
        ? inputs.customCcnlName || 'CCNL Personalizzato'
        : `${currentCategory.code} — ${currentLevel.name}`
      : `Standard (${inputs.months} Mensilità)`;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="bg-slate-50/80 px-4 sm:px-5 py-3 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Prospetto Retributivo Analitico (Cedolino & Costo Azienda)
            </h3>
            <p className="text-[11px] text-slate-500">
              Inquadramento: <strong className="text-slate-700">{ccnlNameDisplay}</strong>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            TUIR 2026 Calculated
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-4">Voce Retributiva / Fiscale</th>
              <th className="py-2.5 px-4">Riferimento Normativo / CCNL</th>
              <th className="py-2.5 px-4 text-right">Importo Mensile (€)</th>
              <th className="py-2.5 px-4 text-right">Importo Annuale (€)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {/* Minimo Tabellare */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 font-semibold text-slate-900">Minimo Tabellare CCNL</td>
              <td className="py-2.5 px-4 text-slate-500">{ccnlNameDisplay}</td>
              <td className="py-2.5 px-4 text-right font-mono">
                {result.monthlyBasePay.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono">
                {(result.monthlyBasePay * result.months).toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* Superminimo */}
            {result.monthlySuperminimo > 0 && (
              <tr className="hover:bg-slate-50/60 transition-colors bg-amber-50/30">
                <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center space-x-1.5">
                  <span>Superminimo Mensile</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      inputs.superminimoType === 'absorbable'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {inputs.superminimoType === 'absorbable' ? 'Assorbibile' : 'Non Assorbibile'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-500">Art. 2077 c.c. / Accordo individuale</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-amber-900">
                  +{result.monthlySuperminimo.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-amber-900">
                  +{(result.monthlySuperminimo * result.months).toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
            )}

            {/* RAL Totale */}
            <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
              <td className="py-2.5 px-4 text-slate-900 uppercase">Retribuzione Annua Lorda (RAL)</td>
              <td className="py-2.5 px-4 text-slate-600 font-normal">Totale lordo contrattuale ({result.months} mensilità)</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-900">
                {result.totalMonthlyGross.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-900">
                {result.ral.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* INPS Dipendente */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 text-slate-700">Contributi IVS INPS Dipendente</td>
              <td className="py-2.5 px-4 text-slate-500">Aliquota standard 9,19% ex L. 335/95</td>
              <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                -{result.inpsEmployeeMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                -{result.inpsEmployeeYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* Imponibile Fiscale */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 font-semibold text-slate-800">Imponibile Fiscale IRPEF</td>
              <td className="py-2.5 px-4 text-slate-500">RAL - Contributi INPS dipendente</td>
              <td className="py-2.5 px-4 text-right font-mono">
                {result.taxableIrpefMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono font-semibold">
                {result.taxableIrpefYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* IRPEF Lorda */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 text-slate-700">Imposta IRPEF Lorda</td>
              <td className="py-2.5 px-4 text-slate-500">3 Scaglioni TUIR 2026 (23% / 35% / 43%)</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                {result.grossIrpefMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                {result.grossIrpefYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* Detrazione Lavoro Dipendente */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 text-emerald-800 font-semibold">Detrazione Lavoro Dipendente</td>
              <td className="py-2.5 px-4 text-slate-500">Art. 13 TUIR (Scalettato fino a 50.000€)</td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                -{(result.employmentDeductionYearly / result.months).toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                -{result.employmentDeductionYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* Detrazioni Familiari */}
            {result.totalFamilyDeductionsYearly > 0 && (
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-4 text-emerald-800 font-semibold">Detrazioni Carichi di Famiglia</td>
                <td className="py-2.5 px-4 text-slate-500">Art. 12 TUIR (Coniuge / Figli ≥ 21 / Altri)</td>
                <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                  -{(result.totalFamilyDeductionsYearly / result.months).toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                  -{result.totalFamilyDeductionsYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
            )}

            {/* Addizionale Regionale */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 text-slate-700">Addizionale Regionale IRPEF</td>
              <td className="py-2.5 px-4 text-slate-500">Regione {currentRegion.name} ({result.regionalAddizionaleRate}%)</td>
              <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                +{result.regionalAddizionaleMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                +{result.regionalAddizionaleYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* Addizionale Comunale */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 text-slate-700">Addizionale Comunale IRPEF</td>
              <td className="py-2.5 px-4 text-slate-500">Comune di {currentComune.name} ({result.municipalAddizionaleRate}%)</td>
              <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                +{result.municipalAddizionaleMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-rose-700">
                +{result.municipalAddizionaleYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* IRPEF Netta Totale */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 font-semibold text-slate-800">IRPEF Netta Trattenuta</td>
              <td className="py-2.5 px-4 text-slate-500">Lorda - Detrazioni + Addizionali Locali</td>
              <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">
                -{result.netIrpefMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">
                -{result.netIrpefYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* ROW HIGHLIGHTED: NETTO BUSTA PAGA */}
            <tr className="bg-emerald-500/10 border-y-2 border-emerald-400 font-extrabold text-slate-900">
              <td className="py-3 px-4 text-emerald-950 text-sm uppercase">NETTO BUSTA PAGA (Cedolino)</td>
              <td className="py-3 px-4 text-emerald-800 text-xs font-semibold">Netto Mensile ({result.months} Mensilità)</td>
              <td className="py-3 px-4 text-right font-mono text-emerald-700 text-base">
                {result.netPayrollMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-3 px-4 text-right font-mono text-emerald-700 text-base">
                {result.netPayrollYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* Assegno Unico Extra */}
            {result.assegnoUnicoMonthlyEstimate > 0 && (
              <tr className="bg-indigo-50/60 hover:bg-indigo-50 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-indigo-950 flex items-center space-x-1">
                  <span>Assegno Unico Universale INPS</span>
                  <span className="text-[9px] bg-indigo-200 text-indigo-900 px-1 rounded">Fuori Busta</span>
                </td>
                <td className="py-2.5 px-4 text-indigo-700 text-xs">Accreditato da INPS su IBAN lavoratore</td>
                <td className="py-2.5 px-4 text-right font-mono text-indigo-900 font-bold">
                  +{result.assegnoUnicoMonthlyEstimate.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-indigo-900 font-bold">
                  +{result.assegnoUnicoYearlyEstimate.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
            )}

            {/* NETTO REALE COMPLESSIVO */}
            {result.assegnoUnicoMonthlyEstimate > 0 && (
              <tr className="bg-indigo-100/70 border-b border-indigo-300 font-black">
                <td className="py-3 px-4 text-indigo-950 text-xs uppercase">Netto Mensile Reale Complessivo</td>
                <td className="py-3 px-4 text-indigo-800 text-xs font-semibold">Busta Paga + Assegno Unico INPS</td>
                <td className="py-3 px-4 text-right font-mono text-indigo-950 text-base">
                  {result.realTotalMonthlyNet.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
                <td className="py-3 px-4 text-right font-mono text-indigo-950 text-base">
                  {(result.netPayrollYearly + result.assegnoUnicoYearlyEstimate).toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
            )}

            {/* Quota TFR */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 font-semibold text-purple-900">Quota Accantonamento TFR Annuo</td>
              <td className="py-2.5 px-4 text-slate-500">Art. 2120 c.c. (RAL / 13,5 - 0,5% IVS)</td>
              <td className="py-2.5 px-4 text-right font-mono text-purple-900 font-semibold">
                {result.tfrMonthlyAccrual.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-purple-900 font-semibold">
                {result.tfrYearlyAccrual.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* Contributi Datore */}
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-2.5 px-4 text-slate-700">Contributi INPS / INAIL a Carico Datore</td>
              <td className="py-2.5 px-4 text-slate-500">INPS Datore ~24% + INAIL ~0,5% + Fondi ~1,5%</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                {((result.employerInpsYearly + result.employerInailYearly + result.employerFundsYearly) / result.months).toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                {(result.employerInpsYearly + result.employerInailYearly + result.employerFundsYearly).toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>

            {/* COSTO TOTALE AZIENDA */}
            <tr className="bg-slate-900 text-white font-black">
              <td className="py-3 px-4 text-white text-xs uppercase tracking-wider">COSTO TOTALE AZIENDA (Employer Budget)</td>
              <td className="py-3 px-4 text-slate-300 text-xs font-normal">RAL + INPS/INAIL Datore + TFR Accantonato</td>
              <td className="py-3 px-4 text-right font-mono text-emerald-400 text-sm">
                {result.totalEmployerCostMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
              <td className="py-3 px-4 text-right font-mono text-emerald-400 text-sm">
                {result.totalEmployerCostYearly.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
