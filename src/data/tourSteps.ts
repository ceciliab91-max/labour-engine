export interface TourStep {
  id: string;
  target: string; // CSS selector or data-tour identifier (e.g. '[data-tour="header-tabs"]')
  title: string;
  description: string;
  requiredTab?: 'hiring' | 'litigation';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'header-tabs',
    target: '[data-tour="header-tabs"]',
    title: '1. Navigazione Doppia Vista (Assunzioni vs Contenzioso)',
    description:
      'Passa facilmente dalla simulazione preventiva dei costi di assunzione alla gestione dei contenziosi di lavoro, licenziamenti e transazioni ex Art. 2113 c.c.',
    requiredTab: 'hiring',
    placement: 'bottom',
  },
  {
    id: 'parameter-form',
    target: '[data-tour="parameter-form"]',
    title: '2. Configurazione Retributiva & Sgravi Contributivi',
    description:
      'Imposta la RAL o il Netto desiderato, il CCNL applicabile, il livello contrattuale, la regione/comune e gli incentivi all\'assunzione 2026 (Under 35, Donne, Decontribuzione Sud).',
    requiredTab: 'hiring',
    placement: 'right',
  },
  {
    id: 'kpi-cost-summary',
    target: '[data-tour="kpi-cost-summary"]',
    title: '3. KPI di Sintesi & Ripartizione Grafica Costo Azienda',
    description:
      'Visualizza in tempo reale il Netto Mensile in busta paga, il Costo Aziendale Totale, il risparmio derivante dagli sgravi e la scomposizione grafica del cuneo fiscale (INPS, IRPEF, TFR).',
    requiredTab: 'hiring',
    placement: 'left',
  },
  {
    id: 'analytical-table',
    target: '[data-tour="analytical-table"]',
    title: '4. Prospetto Analitico Dettagliato (Voce per Voce)',
    description:
      'Esamina nel dettaglio il calcolo mensile e annuale: imponibile INPS, ritenute lavoratore, IRPEF per scaglioni 2026, addizionali regionali/comunali, detrazioni e TFR maturato.',
    requiredTab: 'hiring',
    placement: 'top',
  },
  {
    id: 'litigation-banner',
    target: '[data-tour="litigation-banner"]',
    title: '5. Banner Cessazioni & Transazione Art. 2113 c.c.',
    description:
      'Questa sezione valuta preventivamente il rischio di contenzioso giuslavoristico, calcola le indennità di licenziamento e permette di simulare accordi conciliativi tombali.',
    requiredTab: 'litigation',
    placement: 'bottom',
  },
  {
    id: 'level-gap-card',
    target: '[data-tour="level-gap-card"]',
    title: '6. Verifica Congruità & Sottoinquadramento (Art. 2103 c.c.)',
    description:
      'Mostra il confronto tra il minimo tabellare del CCNL e la retribuzione reale erogata. Il badge verde certifica la presenza di superminimo a copertura dei minimi contrattuali, escludendo rischi di arretrati retributivi.',
    requiredTab: 'litigation',
    placement: 'right',
  },
  {
    id: 'dismissal-parameters',
    target: '[data-tour="dismissal-parameters"]',
    title: '7. Parametri Normativi Licenziamento (Jobs Act vs Art. 18)',
    description:
      'La piattaforma adatta il calcolo in base al regime applicabile: Jobs Act (D.Lgs. 23/2015) o Art. 18 L. 300/1970, modulando le tutele per soglia dimensionale (sopra/sotto 15 dipendenti).',
    requiredTab: 'litigation',
    placement: 'left',
  },
  {
    id: 'dismissal-risk-exposure',
    target: '[data-tour="dismissal-risk-exposure"]',
    title: '8. Esposizione Risarcitoria & Mancato Preavviso (Risk Engine)',
    description:
      'Spiega la quantificazione del rischio economico: somma il risarcimento stimato (adeguato alle sentenze Corte Cost. 194/2018 e 150/2020) all\'indennità sostitutiva del preavviso contrattuale non goduto.',
    requiredTab: 'litigation',
    placement: 'top',
  },
  {
    id: 'legal-insights',
    target: '[data-tour="legal-insights"]',
    title: '9. Insights Giuslavoristici & Regime Fiscale (Art. 17 TUIR)',
    description:
      'Fornisce indicazioni operative per la conciliatione in sede protetta (ITL/sindacale), ricordando il beneficio della tassazione separata per gli incentivi all\'esodo e la gestione dell\'assorbibilità del superminimo.',
    requiredTab: 'litigation',
    placement: 'top',
  },
  {
    id: 'copilot-export-actions',
    target: '[data-tour="copilot-export-actions"]',
    title: '10. Legal Copilot IA & Esportazione Parere Tecnico',
    description:
      'Utilizza l\'assistente legale guidato da IA per quesiti giuslavoristici e genera report dettagliati in formato PDF o Word personalizzati per aziende e clienti.',
    placement: 'bottom',
  },
];
