import React from 'react';
import type { CalculationInputs } from '../types/payroll';
import { CCNL_DATASET } from '../data/ccnlData';
import { REGIONS, COMUNI } from '../data/geoData';
import { LabourSchedule } from './LabourSchedule';
import type { LabourScheduleData } from './LabourSchedule';
import {
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  Building2,
} from 'lucide-react';

interface ParameterFormProps {
  inputs: CalculationInputs;
  onChange: (updated: Partial<CalculationInputs>) => void;
  calculatedRal: number;
  calculatedMonthlyNet: number;
}

export const ParameterForm: React.FC<ParameterFormProps> = ({
  inputs,
  onChange,
  calculatedRal,
}) => {
  const currentCategory =
    CCNL_DATASET.find((c) => c.id === inputs.ccnlId) || CCNL_DATASET[0];

  const handleScheduleChange = (schedule: LabourScheduleData) => {
    onChange({
      contractType: schedule.contractType,
      partTimeType: schedule.partTimeType,
      weeklyHours: schedule.weeklyHours,
      partTimePercentage: schedule.percentage,
      workCoefficient: schedule.coefficient,
      partTimeFactor: schedule.coefficient,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCcnlId = e.target.value;
    const cat = CCNL_DATASET.find((c) => c.id === newCcnlId) || CCNL_DATASET[0];
    onChange({
      ccnlId: newCcnlId,
      ccnlLevelId: cat.levels[0]?.id || '',
      months: cat.defaultMonths,
    });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegionCode = e.target.value;
    const availableComuni = COMUNI.filter((c) => c.regionCode === newRegionCode);
    const newComuneCode = availableComuni.length > 0 ? availableComuni[0].code : 'STD';
    onChange({
      regionCode: newRegionCode,
      comuneCode: newComuneCode,
    });
  };

  return (
    <div className="space-y-5">
      {/* CARD 1: INQUADRAMENTO RETRIBUTIVO & CCNL */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-100/70 text-emerald-700 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              1. Modalità Retribuzione & CCNL
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {inputs.mode === 'ral' ? 'Modalità RAL Totale' : 'Modalità CCNL'}
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => onChange({ mode: 'ral' })}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                inputs.mode === 'ral'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Da RAL Totale</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ mode: 'ccnl' })}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                inputs.mode === 'ccnl'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Da Minimo CCNL</span>
            </button>
          </div>

          {/* Mode 1: RAL Input & Slider */}
          {inputs.mode === 'ral' && (
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Retribuzione Annua Lorda (RAL)
                  </label>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">
                    {inputs.ral.toLocaleString('it-IT')} €
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={15000}
                  max={120000}
                  step={500}
                  value={inputs.ral}
                  onChange={(e) => onChange({ ral: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>15.000 €</span>
                  <span>35.000 €</span>
                  <span>60.000 €</span>
                  <span>120.000 €</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Input Numerico RAL (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={500}
                      min={12000}
                      max={200000}
                      value={inputs.ral}
                      onChange={(e) => onChange({ ral: Number(e.target.value) || 0 })}
                      className="w-full text-xs font-bold font-mono py-2 pl-3 pr-7 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-semibold text-slate-400">€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Numero Mensilità
                  </label>
                  <select
                    value={inputs.months}
                    onChange={(e) => onChange({ months: Number(e.target.value) as 13 | 14 })}
                    className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 cursor-pointer"
                  >
                    <option value={13}>13 Mensilità</option>
                    <option value={14}>14 Mensilità</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: CCNL Tables & Level Selection */}
          {inputs.mode === 'ccnl' && (
            <div className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Settore & Contratto Collettivo (CCNL)
                </label>
                <select
                  value={inputs.ccnlId}
                  onChange={handleCategoryChange}
                  className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 cursor-pointer"
                >
                  {CCNL_DATASET.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {currentCategory.notes && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    {currentCategory.notes}
                  </p>
                )}
              </div>

              {/* Level Selector */}
              {inputs.ccnlId !== 'custom' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Livello di Inquadramento
                  </label>
                  <select
                    value={inputs.ccnlLevelId}
                    onChange={(e) => onChange({ ccnlLevelId: e.target.value })}
                    className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 cursor-pointer"
                  >
                    {currentCategory.levels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name} — {lvl.monthlyBasePay.toLocaleString('it-IT')} €/mese
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Nome CCNL Custom
                    </label>
                    <input
                      type="text"
                      value={inputs.customCcnlName}
                      onChange={(e) => onChange({ customCcnlName: e.target.value })}
                      placeholder="Es. CCNL Credito"
                      className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Paga Base Mensile (€)
                    </label>
                    <input
                      type="number"
                      step={50}
                      value={inputs.customMonthlyBase}
                      onChange={(e) =>
                        onChange({ customMonthlyBase: Number(e.target.value) || 0 })
                      }
                      className="w-full text-xs font-mono font-bold py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Superminimo and Absorbability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Superminimo Mensile (€/mese)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={25}
                      min={0}
                      value={inputs.superminimoMonthly}
                      onChange={(e) =>
                        onChange({ superminimoMonthly: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="w-full text-xs font-bold font-mono py-2 pl-3 pr-7 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-semibold text-slate-400">€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Mensilità Contrattuali
                  </label>
                  <select
                    value={inputs.months}
                    onChange={(e) => onChange({ months: Number(e.target.value) as 13 | 14 })}
                    className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value={13}>13 Mensilità</option>
                    <option value={14}>14 Mensilità</option>
                  </select>
                </div>
              </div>

              {/* Absorbability Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Clausola Assorbibilità Superminimo
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => onChange({ superminimoType: 'absorbable' })}
                    className={`py-1.5 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      inputs.superminimoType === 'absorbable'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Assorbibile (Art. 2077 c.c.)
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange({ superminimoType: 'non_absorbable' })}
                    className={`py-1.5 px-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      inputs.superminimoType === 'non_absorbable'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Ad Personam Non Assorbibile
                  </button>
                </div>
              </div>

              {/* Auto Computed RAL Badge */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">
                  RAL Calcolata da Tabella + Superminimo:
                </span>
                <span className="text-sm font-extrabold text-emerald-900 font-mono">
                  {calculatedRal.toLocaleString('it-IT')} €/anno
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: ORARIO DI LAVORO & GESTIONE PART-TIME */}
      <LabourSchedule
        initialData={{
          contractType: inputs.contractType || 'full-time',
          partTimeType: inputs.partTimeType || 'orizzontale',
          weeklyHours: inputs.weeklyHours !== undefined ? inputs.weeklyHours : 40,
          percentage: inputs.partTimePercentage !== undefined ? inputs.partTimePercentage : 100,
          coefficient: inputs.workCoefficient !== undefined ? inputs.workCoefficient : 1.0,
        }}
        onChange={handleScheduleChange}
      />

      {/* CARD 3: SELEZIONE GEOGRAFICA & ADDIZIONALI */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-sky-100/70 text-sky-700 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Sede di Lavoro & Addizionali Irpef
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Regione Sede Lavorativa
            </label>
            <select
              value={inputs.regionCode}
              onChange={handleRegionChange}
              className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-800 cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} (Aliquota ~{r.rate}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Comune Sede Lavorativa
            </label>
            <select
              value={inputs.comuneCode}
              onChange={(e) => onChange({ comuneCode: e.target.value })}
              className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-800 cursor-pointer"
            >
              {COMUNI.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} (Aliquota {c.rate}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CARD 3: CARICHI DI FAMIGLIA & ASSEGNO UNICO */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-100/70 text-indigo-700 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              3. Carichi di Famiglia & Detrazioni
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Art. 12 TUIR</span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Coniuge a Carico */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <div>
              <div className="text-xs font-bold text-slate-800">Coniuge a Carico</div>
              <div className="text-[11px] text-slate-500">Detrazione IRPEF in busta paga fino a 800€</div>
            </div>
            <button
              type="button"
              onClick={() => onChange({ spouseDependent: !inputs.spouseDependent })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                inputs.spouseDependent
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-300'
              }`}
            >
              {inputs.spouseDependent ? 'Sì, A Carico' : 'No'}
            </button>
          </div>

          {/* Figli < 21 anni & Assegno Unico */}
          <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
                  <span>Figli a Carico &lt; 21 anni</span>
                  <span className="text-[10px] font-semibold bg-indigo-200/60 text-indigo-900 px-1.5 py-0.5 rounded">
                    Assegno Unico INPS
                  </span>
                </div>
                <div className="text-[11px] text-indigo-700">Accreditato da INPS fuori dal cedolino</div>
              </div>

              {/* Counter */}
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-indigo-200 p-1">
                <button
                  type="button"
                  onClick={() =>
                    onChange({ childrenUnder21: Math.max(0, inputs.childrenUnder21 - 1) })
                  }
                  className="w-6 h-6 rounded flex items-center justify-center text-indigo-700 font-bold hover:bg-indigo-50 cursor-pointer"
                >
                  -
                </button>
                <span className="w-5 text-center text-xs font-extrabold text-indigo-950 font-mono">
                  {inputs.childrenUnder21}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ childrenUnder21: Math.min(5, inputs.childrenUnder21 + 1) })
                  }
                  className="w-6 h-6 rounded flex items-center justify-center text-indigo-700 font-bold hover:bg-indigo-50 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {inputs.childrenUnder21 > 0 && (
              <div className="pt-2 border-t border-indigo-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-0.5">
                    Fascia ISEE Indicativa
                  </label>
                  <select
                    value={inputs.iseeTier}
                    onChange={(e) =>
                      onChange({ iseeTier: e.target.value as 'low' | 'medium' | 'base' })
                    }
                    className="w-full text-xs font-semibold py-1.5 px-2 bg-white border border-indigo-200 rounded-lg text-slate-800 cursor-pointer"
                  >
                    <option value="low">Sotto 17.090 € ISEE (~199€/figlio)</option>
                    <option value="medium">17.090 € - 43.240 € ISEE (~140€/figlio)</option>
                    <option value="base">Sopra 43.240 € o Senza ISEE (~57€/figlio)</option>
                  </select>
                </div>

                <div className="bg-white p-2 rounded-lg border border-indigo-200 text-right">
                  <div className="text-[10px] text-indigo-600 font-medium">Stima Assegno Unico:</div>
                  <div className="text-xs font-extrabold text-indigo-900 font-mono">
                    +{(
                      inputs.childrenUnder21 *
                      (inputs.iseeTier === 'low' ? 199 : inputs.iseeTier === 'medium' ? 140 : 57)
                    ).toLocaleString('it-IT')} €/mese
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Figli >= 21 anni */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <div>
              <div className="text-xs font-bold text-slate-800">Figli a Carico ≥ 21 anni</div>
              <div className="text-[11px] text-slate-500">Detrazione IRPEF in cedolino (Art. 12 TUIR)</div>
            </div>

            <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-300 p-1">
              <button
                type="button"
                onClick={() =>
                  onChange({ children21OrOver: Math.max(0, inputs.children21OrOver - 1) })
                }
                className="w-6 h-6 rounded flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
              >
                -
              </button>
              <span className="w-5 text-center text-xs font-extrabold text-slate-900 font-mono">
                {inputs.children21OrOver}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({ children21OrOver: Math.min(5, inputs.children21OrOver + 1) })
                }
                className="w-6 h-6 rounded flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Altri Familiari */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <div>
              <div className="text-xs font-bold text-slate-800">Altri Familiari a Carico</div>
              <div className="text-[11px] text-slate-500">Genitori o conviventi (750€ riparametrati)</div>
            </div>

            <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-300 p-1">
              <button
                type="button"
                onClick={() =>
                  onChange({ otherDependents: Math.max(0, inputs.otherDependents - 1) })
                }
                className="w-6 h-6 rounded flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
              >
                -
              </button>
              <span className="w-5 text-center text-xs font-extrabold text-slate-900 font-mono">
                {inputs.otherDependents}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({ otherDependents: Math.min(3, inputs.otherDependents + 1) })
                }
                className="w-6 h-6 rounded flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
