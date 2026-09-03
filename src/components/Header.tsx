import React from 'react';
import { Scale, ShieldCheck, FileText, RefreshCw, Bot, Briefcase, Gavel } from 'lucide-react';

interface HeaderProps {
  activeTab: 'hiring' | 'litigation';
  onTabChange: (tab: 'hiring' | 'litigation') => void;
  onOpenCopilot: () => void;
  onOpenExportModal: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenCopilot,
  onOpenExportModal,
  onReset,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-700/20 shrink-0">
              <Scale className="h-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">
                  Legal<span className="text-emerald-600">Pay</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                  Labor Law & Compensation Platform
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Piattaforma per Studi Legali Giuslavoristi e Direzioni HR
              </p>
            </div>
          </div>

          {/* Central Two-Tab Navigation */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs font-bold self-center lg:self-auto">
            <button
              type="button"
              onClick={() => onTabChange('hiring')}
              className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'hiring'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assunzioni & Costo Azienda</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('litigation')}
              className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'litigation'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gavel className="w-3.5 h-3.5 text-rose-600" />
              <span>Cessazioni & Contenzioso</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 shrink-0 justify-end">
            <button
              onClick={onOpenCopilot}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all cursor-pointer border border-slate-800"
            >
              <Bot className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Legal Copilot IA
            </button>

            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-slate-600" />
              Esporta Report
            </button>

            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Ripristina valori predefiniti"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
