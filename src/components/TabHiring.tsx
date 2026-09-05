import React from 'react';
import type { CalculationInputs, PayrollResult, HiringIncentiveType } from '../types/payroll';
import { ParameterForm } from './ParameterForm';
import { VisualCostBar } from './VisualCostBar';
import { AnalyticalTable } from './AnalyticalTable';
import { Wallet, Calendar, Sparkles, Building, Award } from 'lucide-react';

interface TabHiringProps {
  inputs: CalculationInputs;
  onInputChange: (updated: Partial<CalculationInputs>) => void;
  result: PayrollResult;
}

export const TabHiring: React.FC<TabHiringProps> = ({
  inputs,
  onInputChange,
  result,
}) => {
  return (
    <div className="space-y-8">
      {/* Hiring Incentives & Configuration Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parameter Form (5 cols) */}
        <div data-tour="parameter-form" className="lg:col-span-5 space-y-6">
          {/* Card Sgravi Contributivi Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sgravi Contributivi all'Assunzione</h3>
                <p className="text-xs text-slate-500">Incentivi occupazionali e Decontribuzione Sud 2026</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-700">Seleziona Agevolazione Applicabile</label>
              <select
                value={inputs.incentiveType || 'none'}
                onChange={(e) => onInputChange({ incentiveType: e.target.value as HiringIncentiveType })}
                className="w-full text-xs font-bold py-2.5 px-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 cursor-pointer shadow-xs"
              >
                <option value="none">Nessuno / Aliquota INPS Datore Ordinaria (~24%)</option>
                <option value="under35">Under 35 — Esonero 100% Contributi Datore (Max 500 €/mese)</option>
                <option value="donne">Donne Svantaggiate — Esonero 100% Contributi Datore (Max 500 €/mese)</option>
                <option value="sud">Decontribuzione Sud — Riduzione 30% Contributi Datore</option>
              </select>

              {inputs.incentiveType !== 'none' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900">Risparmio Aziendale Stimato:</span>
                  <span className="font-black font-mono text-amber-950 text-sm">
                    -{Math.round(result.incentiveDiscountYearly).toLocaleString('it-IT')} €/anno
                  </span>
                </div>
              )}
            </div>
          </div>

          <ParameterForm
            inputs={inputs}
            onChange={onInputChange}
            calculatedRal={result.ral}
            calculatedMonthlyNet={result.netPayrollMonthly}
          />
        </div>

        {/* Right Column: Output Metrics 2x2 & Visual Costs (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* KPI Cards & Visual Cost Bar container */}
          <div data-tour="kpi-cost-summary" className="space-y-8">
            {/* Spacious 2x2 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1: NETTO MENSILE CEDOLINO */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white rounded-2xl border border-emerald-300/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                      Netto Mensile Cedolino
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {result.months} Mensilità
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-xs">
                    <Wallet className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-4xl font-black text-emerald-600 font-mono tracking-tight">
                    {Math.round(result.netPayrollMonthly).toLocaleString('it-IT')} €
                    <span className="text-sm font-bold text-slate-500 font-sans ml-1">/mese</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-1.5">
                    Importo netto corrisposto in busta paga al lavoratore
                  </p>
                </div>
              </div>

              {/* Card 2: RAL TOTALE ANNUALE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Retribuzione Annua Lorda
                    </span>
                    <div className="text-xs font-medium text-slate-400 mt-1">
                      RAL Contrattuale Totale
                    </div>
                  </div>
                  <div className="p-3 bg-slate-100 text-slate-700 rounded-2xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {Math.round(result.ral).toLocaleString('it-IT')} €
                    <span className="text-sm font-bold text-slate-500 font-sans ml-1">/anno</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1.5">
                    Imponibile lordo base ({result.months} mensilità ordinarie)
                  </p>
                </div>
              </div>

              {/* Card 3: RISPARMIO SGRAVI CONTRIBUTIVI */}
              <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                      Risparmio Sgravi Assunzione
                    </span>
                    <div className="text-xs font-semibold text-amber-700 mt-1">
                      Abbattimento INPS Datore
                    </div>
                  </div>
                  <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-black text-amber-900 font-mono tracking-tight">
                    +{Math.round(result.incentiveDiscountMonthly).toLocaleString('it-IT')} €
                    <span className="text-sm font-bold text-amber-700 font-sans ml-1">/mese</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-1.5">
                    Totale risparmio annuo: <strong className="text-amber-950">+{Math.round(result.incentiveDiscountYearly).toLocaleString('it-IT')} €</strong>
                  </p>
                </div>
              </div>

              {/* Card 4: COSTO TOTALE AZIENDA EFFETTIVO */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Costo Azienda Effettivo
                    </span>
                    <div className="text-xs font-semibold text-slate-400 mt-1">
                      Employer Budget Scontato
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xs">
                    <Building className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {Math.round(result.totalEmployerCostMonthly).toLocaleString('it-IT')} €
                    <span className="text-sm font-bold text-slate-500 font-sans ml-1">/mese</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1.5">
                    Budget totale annuo: {Math.round(result.totalEmployerCostYearly).toLocaleString('it-IT')} €
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Cost Breakdown Bar */}
            <VisualCostBar result={result} />
          </div>

          {/* Analytical Payroll Table */}
          <div data-tour="analytical-table">
            <AnalyticalTable result={result} inputs={inputs} />
          </div>
        </div>
      </div>
    </div>
  );
};
