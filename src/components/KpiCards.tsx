import React from 'react';
import type { PayrollResult } from '../types/payroll';
import { Wallet, Calendar, HeartHandshake, Building } from 'lucide-react';

interface KpiCardsProps {
  result: PayrollResult;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: NETTO MENSILE CEDOLINO */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white rounded-xl border border-emerald-300/80 p-4 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Netto Mensile Cedolino
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                {result.months} Mensilità
              </span>
            </div>
          </div>
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-black text-emerald-600 font-mono tracking-tight">
            {Math.round(result.netPayrollMonthly).toLocaleString('it-IT')} €
            <span className="text-xs font-bold text-slate-500 font-sans ml-1">/mese</span>
          </div>
          <p className="text-[11px] font-medium text-slate-600 mt-1">
            Erogato in busta paga (IRPEF ed INPS detratte)
          </p>
        </div>
      </div>

      {/* KPI 2: NETTO ANNUALE TOTALE */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Netto Annuale Busta Paga
            </span>
            <div className="text-xs font-medium text-slate-400 mt-0.5">
              Disponibile Netto Lavoratore
            </div>
          </div>
          <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {Math.round(result.netPayrollYearly).toLocaleString('it-IT')} €
            <span className="text-xs font-bold text-slate-500 font-sans ml-1">/anno</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            RAL ({Math.round(result.ral).toLocaleString('it-IT')}€) meno trattenute totali
          </p>
        </div>
      </div>

      {/* KPI 3: ASSEGNO UNICO / NETTO REALE */}
      <div className="bg-white rounded-xl border border-indigo-200 p-4 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900">
              Netto Reale + Assegno Unico
            </span>
            <div className="text-[11px] font-semibold text-indigo-700 mt-0.5">
              Accreditato da INPS fuori busta
            </div>
          </div>
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
            <HeartHandshake className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-black text-indigo-950 font-mono tracking-tight">
            {Math.round(result.realTotalMonthlyNet).toLocaleString('it-IT')} €
            <span className="text-xs font-bold text-slate-500 font-sans ml-1">/mese</span>
          </div>
          <p className="text-[11px] font-medium text-slate-600 mt-1">
            Incl. +{Math.round(result.assegnoUnicoMonthlyEstimate)}€/mese Assegno Unico INPS
          </p>
        </div>
      </div>

      {/* KPI 4: COSTO TOTALE AZIENDA */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Costo Totale Azienda
            </span>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">
              Employer Global Budget
            </div>
          </div>
          <div className="p-2 bg-slate-800 text-white rounded-xl shadow-xs">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {Math.round(result.totalEmployerCostMonthly).toLocaleString('it-IT')} €
            <span className="text-xs font-bold text-slate-500 font-sans ml-1">/mese</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1">
            Totale annuo: {Math.round(result.totalEmployerCostYearly).toLocaleString('it-IT')} €
          </p>
        </div>
      </div>
    </div>
  );
};
