# 📋 Piano di Sviluppo & Roadmap — LegalPay 2.0 / Labour Engine

> Documento di pianificazione tecnica e roadmap delle funzionalità per la piattaforma **LegalPay 2.0**.

---

## 🎯 Obiettivo del Progetto

Fornire a **Studi Legali Giuslavoristi**, **Consulenti del Lavoro**, **Direzioni HR** ed **Executive Headhunter** uno strumento di simulazione ad alta precisione per:
1. **Calcolo preventivo del costo del lavoro** compliant con la normativa fiscale e contributiva **TUIR 2026**.
2. **Valutazione preventiva del rischio di contenzioso** (differenze retributive Art. 2103 c.c. e licenziamenti Jobs Act vs Art. 18).
3. **Simulazione di conciliazioni tombali** ex Art. 2113 c.c. ed esportazione di pareri tecnici in formato PDF/Word.
4. **Onboarding guidato ed interattivo** per facilitare l'utilizzo da parte dei professionisti.

---

## 🏁 Milestone Completate

### ✅ FASE 1: Core Engine Fiscale & Retributivo (TUIR 2026)
- [x] Implementazione motore di calcolo `payrollEngine.ts` con scaglioni IRPEF 2026.
- [x] Gestione aliquote contributive INPS Lavoratore (~9.19%) e Datore (~24%).
- [x] Gestione detrazioni da lavoro dipendente, carichi familiari e detrazioni figli.
- [x] Addizionali Regionali e Comunali per tutte le regioni e comuni capoluogo.
- [x] Calcolo maturazione annua e accantonamento TFR.

### ✅ FASE 2: Vista Assunzioni & Costo Azienda
- [x] Form interattivo parametri retributivi (`ParameterForm.tsx`).
- [x] Integrazione Sgravi Contributivi 2026 (Under 35, Donne Svantaggiate, Decontribuzione Sud).
- [x] KPI Cards trasparenti per Netto Mensile, RAL Annua, Risparmio Sgravi e Costo Azienda.
- [x] Grafico a barre dinamico per la ripartizione del costo azienda (`VisualCostBar.tsx`).
- [x] Prospetto analitico dettagliato voce per voce (`AnalyticalTable.tsx`).

### ✅ FASE 3: Vista Cessazioni, Contenzioso & Transazioni 2113 c.c.
- [x] Scheda verifica sottoinquadramento e differenziali retributivi Art. 2103 c.c. (`LevelGapCard.tsx`).
- [x] Simulatore rischio ed esposizione risarcitoria licenziamenti Jobs Act vs Art. 18 (`DismissalSimulatorCard.tsx`).
- [x] Modal calcolatore transazioni in sede protetta ex Art. 2113 c.c. (`SettlementCalculatorModal.tsx`).
- [x] Note e suggerimenti giuslavoristici operativi su assorbibilità e Art. 17 TUIR (`LegalInsights.tsx`).

### ✅ FASE 4: Assistenza IA & Esportazione Report
- [x] Drawer laterale **Legal Copilot IA** per quesiti normativi giuslavoristici (`LegalCopilotDrawer.tsx`).
- [x] Modal di esportazione parere tecnico per clienti e direzioni HR (`ExportLegalModal.tsx`).

### ✅ FASE 5: Tutorial Interattivo & Onboarding Guidato
- [x] Componente overlay spotlight **Onboarding Tour** (`OnboardingTour.tsx`).
- [x] Mappatura completa in 10 passaggi guidati (`tourSteps.ts`):
  - Step 1-4: Navigazione doppia vista, parametri retributivi, KPI costo azienda, tabella analitica.
  - Step 5-9: Banner contenzioso, verifica congruità 2103 c.c., parametri licenziamento, risk engine risarcitorio, insights fiscali Art. 17 TUIR.
  - Step 10: Legal Copilot ed esportazione report.
- [x] Pulsante di avvio manuale nell'Header ("Tutorial") e salvataggio stato di completamento su `localStorage`.

---

## 🔮 Roadmap Futura & Sviluppi Proposti

### 🚀 FASE 6: Funzionalità Avanzate (Prossimi Step)
- [ ] **Confronto Multi-Scenario**: Possibilità di affiancare due simulazioni di assunzione (es. Tempo Indeterminato vs Determinato o CCNL Terziario vs Metalmeccanica).
- [ ] **Esportazione PDF Nativa**: Generazione diretta del file PDF formattato con carta intestata dello Studio Legale / Azienda.
- [ ] **Storico Simulazioni & Salvataggio Locale**: Salvataggio dei prospetti calcolati nella memoria locale per consultazione rapida.
- [ ] **Estensione Dataset CCNL**: Integrazione di ulteriori contratti collettivi nazionali (es. Chimico, Alimentare, Credito).
