import React, { useState } from 'react';
import { calculateSettlement } from '../utils/payrollEngine';
import type { SettlementInputs } from '../types/payroll';
import { X, Calculator, Copy, Check, Scale } from 'lucide-react';

interface SettlementCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTaxRate?: number;
}

export const SettlementCalculatorModal: React.FC<SettlementCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultTaxRate = 23,
}) => {
  const [inputs, setInputs] = useState<SettlementInputs>({
    grossOfferAmount: 20000,
    seniorityYears: 5,
    taxCategory: 'transazione_2113',
    averageTaxRateOverride: Math.round(defaultTaxRate),
  });

  const [copiedClause, setCopiedClause] = useState(false);

  if (!isOpen) return null;

  const result = calculateSettlement(inputs);

  const handleCopyClause = () => {
    navigator.clipboard.writeText(result.clauseText);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Simulatore Transazioni & Incentivi Esodo (Art. 2113 c.c. / Art. 17 TUIR)</h2>
              <p className="text-xs text-slate-300">Calcolo netto lavoratore, esenzione INPS e costo reale azienda</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Somma Lorda Transattiva / Incentivo (€)</label>
              <input
                type="number"
                step={500}
                value={inputs.grossOfferAmount}
                onChange={(e) => setInputs({ ...inputs, grossOfferAmount: Number(e.target.value) || 0 })}
                className="w-full text-sm font-extrabold font-mono py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Anzianità Aziendale (Anni)</label>
              <input
                type="number"
                min={0}
                max={40}
                value={inputs.seniorityYears}
                onChange={(e) => setInputs({ ...inputs, seniorityYears: Number(e.target.value) || 0 })}
                className="w-full text-sm font-bold font-mono py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tipologia di Erogazione Conciliativa</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInputs({ ...inputs, taxCategory: 'transazione_2113' })}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  inputs.taxCategory === 'transazione_2113'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">Transazione Novativa (Art. 2113 c.c.)</div>
                <div className="text-[10px] text-slate-500 font-normal">Accordo tombale in sede protetta</div>
              </button>

              <button
                type="button"
                onClick={() => setInputs({ ...inputs, taxCategory: 'incentivo_esodo' })}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  inputs.taxCategory === 'incentivo_esodo'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">Incentivo Esodo (Art. 17 c. 1 TUIR)</div>
                <div className="text-[10px] text-slate-500 font-normal">Erogazione per risoluzione consensuale</div>
              </button>
            </div>
          </div>

          {/* Slider Aliquota Tassazione Separata */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700">
                Aliquota Presunta Tassazione Separata (%)
              </label>
              <span className="text-sm font-extrabold font-mono text-emerald-700">
                {inputs.averageTaxRateOverride || 23}%
              </span>
            </div>

            <input
              type="range"
              min={15}
              max={43}
              step={0.5}
              value={inputs.averageTaxRateOverride || 23}
              onChange={(e) => setInputs({ ...inputs, averageTaxRateOverride: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>15% (Minimo)</span>
              <span>23% (Stima IRPEF base)</span>
              <span>35%</span>
              <span>43% (Massimo)</span>
            </div>
          </div>

          {/* Detailed Financial & Tax Results Box */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Importo Lordo</span>
                <div className="text-sm font-black font-mono text-slate-900 mt-0.5">
                  {result.grossOfferAmount.toLocaleString('it-IT')} €
                </div>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[9px] text-emerald-800 font-bold uppercase">Contributi INPS</span>
                <div className="text-sm font-black font-mono text-emerald-700 mt-0.5">
                  0,00 €
                </div>
                <span className="text-[9px] font-bold text-emerald-600">Esente Ex Lege</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Irpef ({result.estimatedTaxRate}%)</span>
                <div className="text-sm font-black font-mono text-rose-600 mt-0.5">
                  -{result.taxAmount.toLocaleString('it-IT')} €
                </div>
              </div>

              <div className="bg-emerald-600 text-white p-2.5 rounded-lg shadow-xs">
                <span className="text-[9px] text-emerald-100 font-bold uppercase">Netto Lavoratore</span>
                <div className="text-base font-black font-mono mt-0.5">
                  {result.netSettlementAmount.toLocaleString('it-IT')} €
                </div>
              </div>
            </div>

            {/* Employer Cost Line */}
            <div className="bg-slate-900 text-white p-2.5 rounded-lg flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Costo Reale Datore di Lavoro (Employer Payout):</span>
              <span className="font-black font-mono text-emerald-400 text-sm">
                {result.employerCost.toLocaleString('it-IT')} € (Esente da oneri INPS datoriali)
              </span>
            </div>

            <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200">
              <strong>Nota Giuslavoristica:</strong> {result.legalNote}
            </div>
          </div>

          {/* Copyable Clause for Legal Briefs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clausola per Verbale di Conciliazione (Sede Protetta Ex Art. 410 c.p.c.)</span>
              </span>

              <button
                type="button"
                onClick={handleCopyClause}
                className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                {copiedClause ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedClause ? 'Copiata!' : 'Copia Clausola'}
              </button>
            </div>

            <p className="p-3 bg-slate-100/80 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed italic">
              "{result.clauseText}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
          >
            Chiudi Simulatore
          </button>
        </div>
      </div>
    </div>
  );
};
