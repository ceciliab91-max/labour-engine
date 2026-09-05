import React from 'react';
import type { CalculationInputs, PayrollResult } from '../types/payroll';
import { Scale, BookOpen, AlertTriangle, FileCheck } from 'lucide-react';

interface LegalInsightsProps {
  inputs: CalculationInputs;
  result: PayrollResult;
  onOpenSettlementModal: () => void;
}

export const LegalInsights: React.FC<LegalInsightsProps> = ({
  inputs,
  result,
  onOpenSettlementModal,
}) => {
  return (
    <div data-tour="legal-insights" className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Legal & HR Insights (Note Giuslavoristiche & Conciliazioni)
            </h3>
            <p className="text-[11px] text-slate-500">
              Riferimenti normativi per studi legali, conciliazioni art. 2113 c.c. e contenzioso
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettlementModal}
          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <FileCheck className="w-3.5 h-3.5 mr-1" />
          Calcola Transazione 2113 c.c.
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Card 1: Minimo Tabellare & Assorbibilità */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-900">
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <h4>Minimi Tabellari & Assorbibilità Superminimo</h4>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            In forza dell'<strong>art. 2077 c.c.</strong>, i miglioramenti retributivi individuali (superminimi) sono presunti <strong>assorbibili</strong> dai futuri aumenti dei minimi contrattuali CCNL, salvo espressa pattuizione contraria (clausola <em>ad personam non assorbibile</em>) o intenzione negoziale derivante da specifica meritevolezza professionale.
          </p>
          <div className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-700">
            <strong>Stato attuale:</strong> Superminimo mensile di{' '}
            <span className="font-bold text-slate-900">{result.monthlySuperminimo} €/mese</span>{' '}
            impostato come{' '}
            <span className="font-bold text-emerald-700">
              {inputs.superminimoType === 'absorbable' ? 'Assorbibile' : 'Non Assorbibile'}
            </span>.
          </div>
        </div>

        {/* Card 2: Incentive Severance & Separate Tax */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <h4>Incentivi all'Esodo & Transazioni (Art. 17 TUIR)</h4>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Le somme erogate a titolo di <strong>incentivo all'esodo</strong> (art. 17, c. 1, lett. a, TUIR) o in sede di transazione novativa risarcitoria ex <strong>art. 2113 c.c. / art. 410 c.p.c.</strong> non costituiscono imponibile INPS e beneficiano della <strong>tassazione separata</strong> (aliquota media del quinquennio precedente ex art. 19 TUIR).
          </p>
          <div className="bg-amber-50/70 p-2 rounded border border-amber-200 text-[11px] text-amber-900">
            <strong>Suggerimento Prospetto:</strong> Nei verbali di conciliazione protetta in sede sindacale o ITL, distinguere nettamente le competenze di fine rapporto (TFR) dalle somme a titolo risarcitorio o transattivo tombale.
          </div>
        </div>
      </div>
    </div>
  );
};
