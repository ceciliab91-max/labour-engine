import React, { useState } from 'react';
import type { DismissalInputs } from '../types/payroll';
import { calculateDismissalIndemnity } from '../utils/payrollEngine';
import { Gavel, ShieldAlert } from 'lucide-react';

interface DismissalSimulatorCardProps {
  monthlyBaseSalary: number;
}

export const DismissalSimulatorCard: React.FC<DismissalSimulatorCardProps> = ({
  monthlyBaseSalary,
}) => {
  const [inputs, setInputs] = useState<DismissalInputs>({
    hiringEra: 'post_2015',
    companySize: 'large',
    seniorityYears: 5,
    noticeMonths: 2,
  });

  const result = calculateDismissalIndemnity(inputs, monthlyBaseSalary);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50/80 px-4 sm:px-5 py-3 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Simulatore Indennità Licenziamento (Jobs Act & Tutele Crescenti)
            </h3>
            <p className="text-[11px] text-slate-500">
              Calcolo risarcimento per licenziamento illegittimo post sentenze Corte Cost. 194/2018 e 150/2020
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
          Risk & Damages Engine
        </span>
      </div>

      {/* Controls */}
      <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-800">
        <div data-tour="dismissal-parameters" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Regime Assunzione */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Data di Assunzione</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, hiringEra: 'post_2015' })}
                  className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                    inputs.hiringEra === 'post_2015'
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Post 7/3/2015 (Jobs Act)
                </button>
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, hiringEra: 'pre_2015' })}
                  className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                    inputs.hiringEra === 'pre_2015'
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Ante 7/3/2015 (Art. 18)
                </button>
              </div>
            </div>

            {/* Dimensione Aziendale */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dimensione Aziendale</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, companySize: 'large' })}
                  className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                    inputs.companySize === 'large'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  &gt; 15 Dip. (Grandi Imprese)
                </button>
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, companySize: 'small' })}
                  className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                    inputs.companySize === 'small'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ≤ 15 Dip. (Piccole Imprese)
                </button>
              </div>
            </div>
          </div>

          {/* Anzianità e Preavviso */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Anzianità di Servizio (Anni)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={inputs.seniorityYears}
                  onChange={(e) => setInputs({ ...inputs, seniorityYears: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full text-xs font-bold font-mono py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Preavviso CCNL (Mesi)</label>
              <select
                value={inputs.noticeMonths}
                onChange={(e) => setInputs({ ...inputs, noticeMonths: Number(e.target.value) || 0 })}
                className="w-full text-xs font-semibold py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value={0}>0 Mesi Preavviso</option>
                <option value={1}>1 Mese Preavviso</option>
                <option value={2}>2 Mesi Preavviso</option>
                <option value={3}>3 Mesi Preavviso</option>
                <option value={4}>4 Mesi Preavviso</option>
                <option value={6}>6 Mesi Preavviso</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Retribuzione Mensile Utile (€)</label>
              <input
                type="number"
                step={100}
                value={Math.round(result.monthlyBaseSalary)}
                onChange={(e) => setInputs({ ...inputs, customMonthlySalary: Number(e.target.value) || 0 })}
                className="w-full text-xs font-bold font-mono py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div data-tour="dismissal-risk-exposure" className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-[11px] font-bold text-slate-700">Riferimento Normativo Applicato:</span>
            <span className="text-[11px] font-bold text-rose-900 bg-rose-100/80 px-2 py-0.5 rounded">
              {result.normativeReference}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Forchetta Mensilità</span>
              <div className="text-sm font-extrabold font-mono text-slate-900">
                {result.minMonths} - {result.maxMonths} Mensilità
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Stima media: <strong className="text-slate-800">{result.estimatedMonths} mensilità</strong>
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Indennità Mancato Preavviso</span>
              <div className="text-sm font-extrabold font-mono text-indigo-900">
                +{result.noticePayAmount.toLocaleString('it-IT')} €
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Per {result.noticeMonths} mesi di preavviso
              </p>
            </div>

            <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-300">
              <span className="text-[10px] text-rose-900 font-extrabold uppercase">Esposizione Totale Stimata</span>
              <div className="text-base font-black font-mono text-rose-700">
                {result.totalEstimatedExposure.toLocaleString('it-IT')} €
              </div>
              <p className="text-[10px] text-rose-800 font-medium mt-0.5">
                Risarcimento + Preavviso
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Valutazione di Rischio Giuslavoristico:</strong> In caso di contenzioso giudiziale per licenziamento privo di giustificato motivo oggettivo o soggettivo, il giudice quantifica l'indennità risarcitoria compresa tra <strong>{result.minIndemnityAmount.toLocaleString('it-IT')} €</strong> ({result.minMonths} mensilità) ed <strong>{result.maxIndemnityAmount.toLocaleString('it-IT')} €</strong> ({result.maxMonths} mensilità).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
