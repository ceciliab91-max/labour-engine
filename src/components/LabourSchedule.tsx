import React, { useState } from 'react';
import { Clock, Briefcase, Percent, CheckCircle2, Sliders } from 'lucide-react';

export type ContractType = 'full-time' | 'part-time';
export type PartTimeType = 'orizzontale' | 'verticale' | 'misto';

export interface LabourScheduleData {
  contractType: ContractType;
  partTimeType: PartTimeType | null;
  weeklyHours: number;
  percentage: number;
  coefficient: number;
}

interface LabourScheduleProps {
  initialData?: Partial<LabourScheduleData>;
  onChange?: (data: LabourScheduleData) => void;
}

export const LabourSchedule: React.FC<LabourScheduleProps> = ({
  initialData,
  onChange,
}) => {
  const [contractType, setContractType] = useState<ContractType>(
    initialData?.contractType || 'full-time'
  );
  const [partTimeType, setPartTimeType] = useState<PartTimeType>(
    initialData?.partTimeType || 'orizzontale'
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(
    initialData?.weeklyHours !== undefined ? initialData.weeklyHours : 40
  );
  const [percentage, setPercentage] = useState<number>(
    initialData?.percentage !== undefined ? initialData.percentage : 100
  );

  const STANDARD_BASE_HOURS = 40;

  // Handler: Change between Full-time and Part-time
  const handleContractTypeChange = (type: ContractType) => {
    setContractType(type);
    if (type === 'full-time') {
      setWeeklyHours(40);
      setPercentage(100);
      const data: LabourScheduleData = {
        contractType: 'full-time',
        partTimeType: null,
        weeklyHours: 40,
        percentage: 100,
        coefficient: 1.0,
      };
      onChange?.(data);
    } else {
      const newHours = weeklyHours >= 40 ? 20 : weeklyHours;
      const newPct = percentage >= 100 ? 50 : percentage;
      const coeff = Math.round((newPct / 100) * 100) / 100;
      setWeeklyHours(newHours);
      setPercentage(newPct);
      const data: LabourScheduleData = {
        contractType: 'part-time',
        partTimeType,
        weeklyHours: newHours,
        percentage: newPct,
        coefficient: coeff,
      };
      onChange?.(data);
    }
  };

  // Handler: Change Part-time articulation dropdown
  const handlePartTimeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as PartTimeType;
    setPartTimeType(newType);
    const coeff = Math.round((percentage / 100) * 100) / 100;
    const data: LabourScheduleData = {
      contractType: 'part-time',
      partTimeType: newType,
      weeklyHours,
      percentage,
      coefficient: coeff,
    };
    onChange?.(data);
  };

  // Handler: Modify Hours Input -> Calculates & updates Percentage
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value);
    if (isNaN(rawVal)) {
      setWeeklyHours(0);
      return;
    }
    const clampedHours = Math.max(1, Math.min(STANDARD_BASE_HOURS, rawVal));
    const computedPct = Math.round(((clampedHours / STANDARD_BASE_HOURS) * 100) * 10) / 10;
    const coeff = Math.round((computedPct / 100) * 1000) / 1000;

    setWeeklyHours(clampedHours);
    setPercentage(computedPct);

    const data: LabourScheduleData = {
      contractType: 'part-time',
      partTimeType,
      weeklyHours: clampedHours,
      percentage: computedPct,
      coefficient: coeff,
    };
    onChange?.(data);
  };

  // Handler: Modify Percentage Input -> Calculates & updates Hours
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseFloat(e.target.value);
    if (isNaN(rawVal)) {
      setPercentage(0);
      return;
    }
    const clampedPct = Math.max(1, Math.min(100, rawVal));
    const computedHours = Math.round(((clampedPct / 100) * STANDARD_BASE_HOURS) * 10) / 10;
    const coeff = Math.round((clampedPct / 100) * 1000) / 1000;

    setPercentage(clampedPct);
    setWeeklyHours(computedHours);

    const data: LabourScheduleData = {
      contractType: 'part-time',
      partTimeType,
      weeklyHours: computedHours,
      percentage: clampedPct,
      coefficient: coeff,
    };
    onChange?.(data);
  };

  const currentCoefficient =
    contractType === 'full-time' ? 1.0 : Math.round((percentage / 100) * 100) / 100;

  return (
    <div
      id="labour-schedule-card"
      data-tour="labour-schedule-card"
      className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300"
    >
      {/* Header */}
      <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-teal-100/80 text-teal-700 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Orario di Lavoro & Gestione Part-Time
          </h2>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
            contractType === 'full-time'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
          }`}
        >
          {contractType === 'full-time'
            ? 'Full-time (40h)'
            : `Part-time ${percentage}% (${weeklyHours}h)`}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Main Contract Type Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Tipologia Contrattuale Orario
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleContractTypeChange('full-time')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                contractType === 'full-time'
                  ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  contractType === 'full-time'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    Full-time
                  </span>
                  {contractType === 'full-time' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  40 ore settimanali (100%)
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleContractTypeChange('part-time')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                contractType === 'part-time'
                  ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  contractType === 'part-time'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Sliders className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    Part-time
                  </span>
                  {contractType === 'part-time' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Orario ridotto / articolato
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Part-time Animated Fields Section */}
        {contractType === 'part-time' && (
          <div className="pt-2 border-t border-slate-100 space-y-4 animate-fadeIn">
            {/* Articulation Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Articolazione dell'Orario Part-Time
              </label>
              <select
                value={partTimeType}
                onChange={handlePartTimeTypeChange}
                className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800 cursor-pointer"
              >
                <option value="orizzontale">
                  Orizzontale (riduzione giornaliera su 5/6 giorni)
                </option>
                <option value="verticale">
                  Verticale (attività a tempo pieno solo in determinati giorni/periodi)
                </option>
                <option value="misto">
                  Misto (combinazione orizzontale e verticale)
                </option>
              </select>
            </div>

            {/* Two Synchronized Linked Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-indigo-50/40 border border-indigo-100 rounded-xl p-3.5">
              {/* Input 1: Ore Settimanali */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-indigo-950">
                    Ore Settimanali
                  </label>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    Min 1h — Max 40h
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={40}
                    step={0.5}
                    value={weeklyHours}
                    onChange={handleHoursChange}
                    className="w-full text-xs font-bold font-mono py-2 pl-3 pr-16 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                  <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">
                    h / sett.
                  </span>
                </div>
              </div>

              {/* Input 2: Percentuale % */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-indigo-950">
                    Percentuale Part-Time
                  </label>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    Min 1% — Max 100%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={percentage}
                    onChange={handlePercentageChange}
                    className="w-full text-xs font-bold font-mono py-2 pl-3 pr-10 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                  <div className="absolute right-3 top-2 text-slate-400">
                    <Percent className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Coefficient Summary Badge */}
            <div className="bg-indigo-100/70 border border-indigo-200/90 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-900">
                Coefficiente di riproporzionamento:
              </span>
              <span className="font-black font-mono text-indigo-950 text-sm">
                {currentCoefficient.toFixed(2)}{' '}
                <span className="text-xs font-medium text-indigo-700">
                  ({percentage}%)
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
