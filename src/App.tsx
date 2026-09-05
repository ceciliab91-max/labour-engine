import { useState, useMemo, useEffect } from 'react';
import type { CalculationInputs } from './types/payroll';
import { calculatePayroll } from './utils/payrollEngine';
import { Header } from './components/Header';
import { TabHiring } from './components/TabHiring';
import { TabLitigation } from './components/TabLitigation';
import { LegalCopilotDrawer } from './components/LegalCopilotDrawer';
import { SettlementCalculatorModal } from './components/SettlementCalculatorModal';
import { ExportLegalModal } from './components/ExportLegalModal';
import { OnboardingTour } from './components/OnboardingTour';
import { Scale } from 'lucide-react';

const DEFAULT_INPUTS: CalculationInputs = {
  mode: 'ral',
  ral: 32000,
  ccnlId: 'terziario',
  ccnlLevelId: 'terziario-l3',
  months: 14,
  superminimoMonthly: 0,
  superminimoType: 'absorbable',
  incentiveType: 'none',
  regionCode: 'LOM',
  comuneCode: 'MI',
  spouseDependent: false,
  childrenUnder21: 0,
  children21OrOver: 0,
  otherDependents: 0,
  iseeTier: 'base',
  customMonthlyBase: 1800,
  customCcnlName: 'CCNL Personalizzato',
};

const TOUR_STORAGE_KEY = 'legalpay_tour_completed';

export function App() {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<'hiring' | 'litigation'>('hiring');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);

  // Auto-start tour on first visit
  useEffect(() => {
    const isCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsTourActive(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStartTour = () => {
    setActiveTab('hiring');
    setIsTourActive(true);
  };

  const handleCloseTour = () => {
    setIsTourActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  const handleInputChange = (updated: Partial<CalculationInputs>) => {
    setInputs((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
  };

  const result = useMemo(() => {
    return calculatePayroll(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onReset={handleReset}
        onStartTour={handleStartTour}
      />

      {/* Main Spacious Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'hiring' ? (
          <TabHiring
            inputs={inputs}
            onInputChange={handleInputChange}
            result={result}
          />
        ) : (
          <TabLitigation
            inputs={inputs}
            result={result}
            onOpenSettlementModal={() => setIsSettlementModalOpen(true)}
          />
        )}
      </main>

      {/* Modals & Slide-over Drawers */}
      <SettlementCalculatorModal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        defaultTaxRate={result.effectiveIrpefTaxRate}
      />

      <ExportLegalModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        result={result}
        inputs={inputs}
      />

      <LegalCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        result={result}
        inputs={inputs}
      />

      {/* Onboarding Interactive Tour */}
      <OnboardingTour
        isOpen={isTourActive}
        onClose={handleCloseTour}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">LegalPay 2.0 — Labor Law & Compensation Platform</span>
            <span>© 2026</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Piattaforma professionale a doppia vista per Studi Legali Giuslavoristi e Direzioni HR. Compliant TUIR 2026.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

