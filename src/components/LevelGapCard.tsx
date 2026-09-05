import React from 'react';
import type { CalculationInputs, PayrollResult } from '../types/payroll';
import { calculateLevelGap } from '../utils/payrollEngine';
import { CCNL_DATASET } from '../data/ccnlData';
import { AlertTriangle, CheckCircle2, Scale, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface LevelGapCardProps {
  inputs: CalculationInputs;
  result: PayrollResult;
}

export const LevelGapCard: React.FC<LevelGapCardProps> = ({
  inputs,
  result,
}) => {
  const currentCategory = CCNL_DATASET.find((c) => c.id === inputs.ccnlId) || CCNL_DATASET[0];
  const currentLevel = currentCategory.levels.find((l) => l.id === inputs.ccnlLevelId) || currentCategory.levels[0];

  const requiredMonthlyBase = inputs.ccnlId === 'custom' ? inputs.customMonthlyBase || 1800 : currentLevel.monthlyBasePay;
  const actualMonthlyPay = result.totalMonthlyGross;

  const gapResult = calculateLevelGap(actualMonthlyPay, requiredMonthlyBase, result.months);

  return (
    <div data-tour="level-gap-card" className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50/80 px-4 sm:px-5 py-3 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Verifica Congruità & Differenze Retributive da Livello
            </h3>
            <p className="text-[11px] text-slate-500">
              Confronto retribuzione erogata vs Minimo Tabellare spettante per mansioni
            </p>
          </div>
        </div>

        {gapResult.status === 'underpaid_sottoinquadramento' ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-rose-700" />
            Sotto-inquadramento Rilevato
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" />
            Retribuzione Conforme / Superminimo
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Minimo Tabellare Spettante</span>
            <div className="text-sm font-extrabold font-mono text-slate-900 mt-0.5">
              {requiredMonthlyBase.toLocaleString('it-IT')} €/mese
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Livello: <strong className="text-slate-800">{currentLevel.name}</strong> ({currentCategory.code})
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Retribuzione Effettiva Erogata</span>
            <div className="text-sm font-extrabold font-mono text-slate-900 mt-0.5">
              {actualMonthlyPay.toLocaleString('it-IT')} €/mese
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              RAL Totale: <strong className="text-slate-800">{Math.round(result.ral).toLocaleString('it-IT')} €/anno</strong>
            </p>
          </div>
        </div>

        {/* Delta Analysis Card */}
        {gapResult.status === 'underpaid_sottoinquadramento' ? (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-rose-950 font-bold">
              <ArrowDownRight className="w-5 h-5 text-rose-700 shrink-0" />
              <h4 className="text-xs uppercase tracking-wider">Allarme Giuslavoristico: Sotto-inquadramento Retributivo</h4>
            </div>

            <p className="text-[11px] text-rose-900 leading-relaxed">
              La retribuzione erogata risulta inferiore di <strong className="font-mono">{Math.abs(Math.round(gapResult.monthlyDelta))} €/mese</strong> rispetto ai minimi inderogabili stabiliti dalla contrattazione collettiva di settore ex art. 36 Cost.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-rose-200">
                <span className="text-[10px] text-rose-900 font-bold uppercase">Scostamento Mensile</span>
                <div className="text-sm font-black font-mono text-rose-700">
                  -{Math.abs(Math.round(gapResult.monthlyDelta)).toLocaleString('it-IT')} €/mese
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-rose-200">
                <span className="text-[10px] text-rose-900 font-bold uppercase">Credito Lordo Annuo</span>
                <div className="text-sm font-black font-mono text-rose-700">
                  -{Math.abs(Math.round(gapResult.yearlyDelta)).toLocaleString('it-IT')} €/anno
                </div>
              </div>

              <div className="bg-rose-600 text-white p-2.5 rounded-lg shadow-xs">
                <span className="text-[10px] text-rose-100 font-bold uppercase">Credito Arretrati 5 Anni</span>
                <div className="text-base font-black font-mono">
                  {Math.abs(Math.round(gapResult.fiveYearPrescriptionDelta)).toLocaleString('it-IT')} €
                </div>
              </div>
            </div>

            <div className="text-[10px] text-rose-950 bg-white/80 p-2 rounded border border-rose-200">
              <strong>Prescrizione Quinquennale (Art. 2948 n. 4 c.c.):</strong> I crediti di lavoro arretrati per differenze retributive si prescrivono in 5 anni dal momento del pagamento o dalla cessazione del rapporto nei rapporti non assistiti da stabilità reale.
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-950 font-bold">
                <ArrowUpRight className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Superminimo / Eccedenza Retributiva Erogata</span>
              </div>
              <span className="text-xs font-black font-mono text-emerald-800">
                +{Math.round(gapResult.monthlyDelta).toLocaleString('it-IT')} €/mese
              </span>
            </div>

            <p className="text-[11px] text-emerald-900">
              La retribuzione corrisposta copre interamente i minimi contrattuali di settore ed eroga un surplus lordo di <strong className="font-mono">+{Math.round(gapResult.yearlyDelta).toLocaleString('it-IT')} €/anno</strong> a titolo di superminimo o elemento retributivo individuale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
