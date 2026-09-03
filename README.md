# ⚖️ Labour Engine / LegalPay 2.0

> Piattaforma analitica avanzata a doppia vista per la simulazione del costo del lavoro (normativa **TUIR 2026**), sgravi contributivi, calcolo del contenzioso giuslavoristico e conciliazioni transattive.

Progettata specificamente per **Studi Legali Giuslavoristi**, **Consulenti del Lavoro**, **Direzioni HR** ed **Executive Headhunter**.

---

## 📌 Indice

- [Panoramica](#-panoramica)
- [Funzionalità Principali](#-funzionalità-principali)
  - [1. Engine Fiscale & Costo Lavoro (TUIR 2026)](#1-engine-fiscale--costo-lavoro-tuir-2026)
  - [2. Vista Assunzione & Costo Aziendale](#2-vista-assunzione--costo-aziendale)
  - [3. Vista Contenzioso & Vertenze](#3-vista-contenzioso--vertenze)
  - [4. Legal Copilot AI & Esportazione](#4-legal-copilot-ai--esportazione)
- [Stack Tecnologico](#-stack-tecnologico)
- [Struttura della Repository](#-struttura-della-repository)
- [Guida all'Avvio Rapido](#-guida-allavvio-rapido)
- [Configurazione & Script](#-configurazione--script)

---

## 🎯 Panoramica

**Labour Engine (LegalPay 2.0)** unisce la precisione del calcolo contabile e previdenziale italiano con la valutazione del rischio legale in materia giuslavoristica.

L'architettura è interamente **client-side reactive**: ogni variazione di parametro (superminimo, CCNL, detrazioni, sgravi o scaglioni) ricalcola istantaneamente l'intero prospetto finanziario e di contenzioso tramite pipeline in memoria, garantendo zero latenza di rete e massima riservatezza dei dati retributivi inseriti.

---

## 🚀 Funzionalità Principali

### 1. Engine Fiscale & Costo Lavoro (TUIR 2026)

- **Scaglioni IRPEF 2026**: Calcolo progressivo ad aliquote aggiornate (23%, 35%, 43%).

- **Detrazioni TUIR**: Algoritmo dinamico per lavoro dipendente (Art. 13 TUIR) e carichi di famiglia (Art. 12 TUIR: coniuge a carico, figli > 21 anni, altri familiari).
- **Addizionali Locali**: Integrazione automatica di addizionali regionali e comunali per territorio.
- **CCNL & Tabelle Retributive**: Minimi contrattuali integrati per *Terziario & Commercio (Confcommercio)*, *Metalmeccanica Industria*, *Credito/Bancari*, *Chimica* e supporto a *CCNL Personalizzato*.
- **Superminimo**: Trattamento separato tra clausole di **assorbibilità** e superminimo non assorbibile.
- **Incentivi & Sgravi 2026**: Simulazione decontribuzione per Giovani Under 35, Donne Svantaggiate e Decontribuzione Sud.
- **TFR & Contributi**: Calcolo quota accantonamento annuale/mensile TFR, contributi INPS IVS a carico dipendente/datore e premio assicurativo INAIL.
- **Cash Flow Integrato**: Proiezione dell'Assegno Unico e Universale (AUU) per calcolare l'entrata netta reale del lavoratore.

---

### 2. Vista Assunzione & Costo Aziendale (`TabHiring`)

- **Parameter Form**: Configurazione rapida per RAL diretta o per selezione CCNL + Livello contrattuale, mensilità (13ª / 14ª), residenza fiscale e carichi familiari.

- **KPI Dashboard**: Metriche chiave immediate su *Costo Totale Azienda*, *Netto Mensile*, *Cuneo Fiscale %* e *Cash Flow Complessivo*.
- **Visual Cost Breakdown**: Barra grafica interattiva con incidenza percentuale di Netto, IRPEF, Oneri INPS dipendente/azienda e TFR.
- **Prospetto Analitico Dettagliato**: Tabella finanziaria voce per voce con visualizzazione commutabile tra base **Annuale** e **Mensile**.

---

### 3. Vista Contenzioso & Vertenze (`TabLitigation`)

- **Level Gap & Sottoinquadramento**:
  - Confronto differenziale tra inquadramento formale e mansioni effettivamente svolte (Art. 2103 c.c.).
  - Calcolo del differenziale mensile, annuo e proiezione quinquennale (prescrizione ex Art. 2948 c.c.).

- **Simulatore Rischio Licenziamento**:
  - Stima dell'indennità risarcitoria secondo il regime applicabile: **Tutele Crescenti (D.Lgs. 23/2015)** vs **Art. 18 Statuto dei Lavoratori (L. 300/1970 ante-2015)**.
  - Modulazione per soglia dimensionale (imprese sopra/sotto i 15 dipendenti) e anzianità di servizio.
  - Quantificazione economica dell'indennità sostitutiva del preavviso contrattuale.
- **Calcolatore Transattivo & Conciliazioni**:
  - Simulazione di accordi conciliativi in sede protetta (Art. 2113 c.c. / Art. 410 c.p.c.).
  - Confronto fiscale tra **Incentivo all'Esodo** (tassazione separata) e **Transazione Novativa/Generica** (tassazione ordinaria), con calcolo puntuale del netto incassato e costo deducibile per il datore.

---

### 4. Legal Copilot AI & Esportazione

- **Legal Copilot Drawer**: Pannello laterale per consultazioni rapide su giurisprudenza, clausole di assorbimento e pareri di conformità.

- **Export Legal Prospetto**: Generatore di report e pareri legali formattati, pronti per la condivisione, stampa o allegato via email al cliente finale.

---

## 🛠️ Stack Tecnologico

| Area | Tecnologia | Note |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Utilizzo di functional components e hooks ad alte prestazioni |
| **Linguaggio** | [TypeScript 6](https://www.typescriptlang.org/) | Tipizzazione statica rigorosa per tutti i domini contabili e fiscali |
| **Bundler & Dev Server** | [Vite 8](https://vitejs.dev/) | HMR istantaneo e build ottimizzata |
| **CSS Framework** | [Tailwind CSS v4](https://tailwindcss.com/) | Configurato con `@tailwindcss/vite` |
| **Icone** | [Lucide React](https://lucide.dev/) | Icone SVG coerenti e leggere |
| **Linter** | [Oxlint](https://oxc-project.github.io/) | Linter Rust-based ultra-veloce |
| **Calculation Engine** | Client-side reactive | Algoritmi memorizzati con `useMemo` senza chiamate API esterne |

---

## 📂 Struttura della Repository

```text
src/
├── components/
│   ├── AnalyticalTable.tsx          # Tabella dettagliata voci costo/netto (annuo/mensile)
│   ├── DismissalSimulatorCard.tsx   # Simulatore indennità licenziamento (D.Lgs 23/15 vs Art. 18)
│   ├── ExportLegalModal.tsx         # Generatore ed esportazione parere tecnico/legale
│   ├── Header.tsx                   # Barra superiore, selettore tab e azioni globali
│   ├── KpiCards.tsx                 # Card metriche chiave (Costo azienda, Netto, Cuneo)
│   ├── LegalCopilotDrawer.tsx       # Pannello laterale assistente AI giuslavoristico
│   ├── LevelGapCard.tsx             # Analisi sottoinquadramento e differenziali Art. 2948 c.c.
│   ├── ParameterForm.tsx            # Form configurazione retributiva, CCNL e carichi
│   ├── SettlementCalculatorModal.tsx# Calcolatore transazioni e conciliazioni (Art. 2113 c.c.)
│   ├── TabHiring.tsx                # Container principale vista Assunzioni & Costo Lavoro
│   ├── TabLitigation.tsx             # Container principale vista Contenzioso & Vertenze
│   └── VisualCostBar.tsx            # Breakdown visivo delle componenti di costo
├── data/
│   ├── ccnlData.ts                  # Minimi retributivi, scatti e contingenza per CCNL
│   └── geoData.ts                   # Addizionali IRPEF regionali e comunali
├── types/
│   └── payroll.ts                   # Definizioni TypeScript per input, payroll e contenziosi
├── utils/
│   └── payrollEngine.ts             # Motore matematico e fiscale (TUIR 2026, INPS, TFR)
├── App.tsx                          # Root component e state machine dell'applicazione
└── main.tsx                         # Entrypoint dell'applicazione React
