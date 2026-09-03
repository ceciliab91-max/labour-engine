import React from 'react';
import type { PayrollResult } from '../types/payroll';
import { PieChart } from 'lucide-react';

interface VisualCostBarProps {
  result: PayrollResult;
}

export const VisualCostBar: React.FC<VisualCostBarProps> = ({ result }) => {
  const totalCost = result.totalEmployerCostYearly;
  if (!totalCost || totalCost <= 0) return null;

  const netPct = (result.netPayrollYearly / totalCost) * 100;
  const irpefPct = (result.netIrpefYearly / totalCost) * 100;
  const inpsEmpPct = (result.inpsEmployeeYearly / totalCost) * 100;
  const employerOnariYearly = result.employerInpsYearly + result.employerInailYearly + result.employerFundsYearly;
  const employerOnariPct = (employerOnariYearly / totalCost) * 100;
  const tfrPct = (result.tfrYearlyAccrual / totalCost) * 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ripartizione Visiva del Costo Globale Aziendale
            </h3>
            <p className="text-[11px] text-slate-500">
              Cuneo Fiscale Complessivo: <span className="font-bold text-slate-700">{result.cuneoFiscalePercentage.toFixed(1)}%</span> del Budget
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-extrabold font-mono text-slate-900">
            {Math.round(totalCost).toLocaleString('it-IT')} €
          </span>
          <span className="block text-[10px] text-slate-400">Budget Annuo Totale</span>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-4 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
        {/* Netto Lavoratore */}
        <div
          style={{ width: `${netPct}%` }}
          className="bg-emerald-500 hover:bg-emerald-600 transition-all cursor-pointer relative group"
          title={`Netto Dipendente: ${Math.round(result.netPayrollYearly).toLocaleString('it-IT')} € (${netPct.toFixed(1)}%)`}
        />
        {/* IRPEF Netta */}
        <div
          style={{ width: `${irpefPct}%` }}
          className="bg-amber-400 hover:bg-amber-500 transition-all cursor-pointer relative group"
          title={`IRPEF Netta + Addizionali: ${Math.round(result.netIrpefYearly).toLocaleString('it-IT')} € (${irpefPct.toFixed(1)}%)`}
        />
        {/* INPS Dipendente */}
        <div
          style={{ width: `${inpsEmpPct}%` }}
          className="bg-sky-400 hover:bg-sky-500 transition-all cursor-pointer relative group"
          title={`INPS Dipendente (9,19%): ${Math.round(result.inpsEmployeeYearly).toLocaleString('it-IT')} € (${inpsEmpPct.toFixed(1)}%)`}
        />
        {/* INPS / INAIL Datore */}
        <div
          style={{ width: `${employerOnariPct}%` }}
          className="bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer relative group"
          title={`INPS/INAIL Datore (~26%): ${Math.round(employerOnariYearly).toLocaleString('it-IT')} € (${employerOnariPct.toFixed(1)}%)`}
        />
        {/* Quota TFR */}
        <div
          style={{ width: `${tfrPct}%` }}
          className="bg-purple-500 hover:bg-purple-600 transition-all cursor-pointer relative group"
          title={`Quota TFR Accantonato: ${Math.round(result.tfrYearlyAccrual).toLocaleString('it-IT')} € (${tfrPct.toFixed(1)}%)`}
        />
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-slate-700 font-medium truncate">
            Netto: <strong className="font-mono">{netPct.toFixed(0)}%</strong>
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <span className="text-slate-700 font-medium truncate">
            IRPEF: <strong className="font-mono">{irpefPct.toFixed(0)}%</strong>
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
          <span className="text-slate-700 font-medium truncate">
            INPS Dip: <strong className="font-mono">{inpsEmpPct.toFixed(0)}%</strong>
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
          <span className="text-slate-700 font-medium truncate">
            Oneri Datore: <strong className="font-mono">{employerOnariPct.toFixed(0)}%</strong>
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
          <span className="text-slate-700 font-medium truncate">
            Quota TFR: <strong className="font-mono">{tfrPct.toFixed(0)}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
