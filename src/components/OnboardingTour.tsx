import React, { useState, useEffect, useCallback } from 'react';
import { TOUR_STEPS } from '../data/tourSteps';
import { ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'hiring' | 'litigation';
  onTabChange: (tab: 'hiring' | 'litigation') => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Auto-switch tab if step requires a specific tab
  useEffect(() => {
    if (isOpen && step && step.requiredTab && step.requiredTab !== activeTab) {
      onTabChange(step.requiredTab);
    }
  }, [isOpen, currentStepIndex, step, activeTab, onTabChange]);

  // Update target rect on step change, tab change, scroll or resize
  const updateTargetRect = useCallback(() => {
    if (!isOpen || !step) return;

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen || !step) return;

    // Scroll target into view if needed
    const timeoutId = setTimeout(() => {
      const element = document.querySelector(step.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        setTimeout(() => updateTargetRect(), 300);
      } else {
        updateTargetRect();
      }
    }, 150);

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isOpen, currentStepIndex, step, updateTargetRect]);

  if (!isOpen || !step) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Compute position of card relative to target rect
  const getCardStyle = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const cardWidth = 380;
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    const preferredPlacement = step.placement || 'bottom';

    if (preferredPlacement === 'bottom') {
      top = targetRect.bottom + padding;
      left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
      if (top + 260 > viewportHeight) {
        top = targetRect.top - 260 - padding;
      }
    } else if (preferredPlacement === 'top') {
      top = targetRect.top - 260 - padding;
      left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
      if (top < 10) {
        top = targetRect.bottom + padding;
      }
    } else if (preferredPlacement === 'right') {
      top = targetRect.top + targetRect.height / 2 - 120;
      left = targetRect.right + padding;
      if (left + cardWidth > viewportWidth - 20) {
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        top = targetRect.bottom + padding;
      }
    } else if (preferredPlacement === 'left') {
      top = targetRect.top + targetRect.height / 2 - 120;
      left = targetRect.left - cardWidth - padding;
      if (left < 20) {
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        top = targetRect.bottom + padding;
      }
    }

    // Horizontal boundaries clamp
    left = Math.max(16, Math.min(left, viewportWidth - cardWidth - 16));
    top = Math.max(16, Math.min(top, viewportHeight - 280));

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
    };
  };

  const highlightPadding = 8;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Background Dimmed Overlay with Cutout Spotlight */}
      {targetRect ? (
        <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300">
          <defs>
            <mask id="tour-spotlight-mask">
              {/* Fill white background (full screen mask) */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Cutout black hole for targeted element */}
              <rect
                x={targetRect.left - highlightPadding}
                y={targetRect.top - highlightPadding}
                width={targetRect.width + highlightPadding * 2}
                height={targetRect.height + highlightPadding * 2}
                rx="16"
                fill="black"
              />
            </mask>
          </defs>
          {/* Backdrop rect with mask applied */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.65)"
            mask="url(#tour-spotlight-mask)"
          />
          {/* Spotlight glowing boundary ring */}
          <rect
            x={targetRect.left - highlightPadding}
            y={targetRect.top - highlightPadding}
            width={targetRect.width + highlightPadding * 2}
            height={targetRect.height + highlightPadding * 2}
            rx="16"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            className="animate-pulse"
          />
        </svg>
      ) : (
        <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity duration-300" />
      )}

      {/* Floating Dynamic Tooltip Card */}
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 space-y-4 transition-all duration-300 ease-out font-sans"
        style={getCardStyle()}
      >
        {/* Header Row: Badge & Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
              Passaggio {currentStepIndex + 1} di {TOUR_STEPS.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors cursor-pointer"
            title="Chiudi tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
            {step.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {step.description}
          </p>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%`,
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-1 py-1"
          >
            Salta tour
          </button>

          <div className="flex items-center space-x-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Precedente
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Termina
                </>
              ) : (
                <>
                  Avanti
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
