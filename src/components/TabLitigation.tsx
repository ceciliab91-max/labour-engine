import React from 'react';
import type { CalculationInputs, PayrollResult } from '../types/payroll';
import { LevelGapCard } from './LevelGapCard';
import { DismissalSimulatorCard } from './DismissalSimulatorCard';
import { LegalInsights } from './LegalInsights';
import { Gavel, Calculator } from 'lucide-react';

interface TabLitigationProps {
  inputs: CalculationInputs;
  result: PayrollResult;
  onOpenSettlementModal: () => void;
}

export const TabLitigation: React.FC<TabLitigationProps> = ({
  inputs,
  result,
  onOpenSettlementModal,
}) => {
  return (
    <div className="space-y-8">
      {/* Banner Top Summary for Disputes */}
      <div
        data-tour="litigation-banner"
        className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-xl">
              <Gavel className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Modulo Cessazioni, Transazioni Art. 2113 c.c. & Contenzioso Lavoro
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Valutazione preventiva del rischio giudiziale, calcolo incentivi all'esodo con tassazione separata ed analisi delle differenze retributive.
          </p>
        </div>

        <button
          onClick={onOpenSettlementModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calcola Transazione 2113 c.c.
        </button>
      </div>

      {/* Grid 2-Columns for Litigation Tools */}
      <div data-tour="litigation-tools" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Level Gap & Legal Notes (6 cols) */}
        <div className="lg:col-span-6 space-y-8">
          {/* Level Gap & Back-Pay Card */}
          <LevelGapCard inputs={inputs} result={result} />

          {/* Legal Insights Card */}
          <LegalInsights
            inputs={inputs}
            result={result}
            onOpenSettlementModal={onOpenSettlementModal}
          />
        </div>

        {/* Right Column: Dismissal Simulator (6 cols) */}
        <div className="lg:col-span-6 space-y-8">
          {/* Jobs Act & Art. 18 Dismissal Simulator */}
          <DismissalSimulatorCard monthlyBaseSalary={result.totalMonthlyGross} />
        </div>
      </div>
    </div>
  );
};
