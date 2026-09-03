import React, { useState } from 'react';
import type { PayrollResult, CalculationInputs, ChatMessage } from '../types/payroll';
import { CCNL_DATASET } from '../data/ccnlData';
import { calculateSettlement } from '../utils/payrollEngine';
import { LEGAL_COPILOT_SYSTEM_PROMPT } from '../constants/prompts';
import { X, Bot, Send, Copy, Check, Sparkles, BookOpen } from 'lucide-react';

interface LegalCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  result: PayrollResult;
  inputs: CalculationInputs;
}

export const LegalCopilotDrawer: React.FC<LegalCopilotDrawerProps> = ({
  isOpen,
  onClose,
  result,
  inputs,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSystemPromptModal, setShowSystemPromptModal] = useState(false);

  const currentCategory = CCNL_DATASET.find((c) => c.id === inputs.ccnlId) || CCNL_DATASET[0];
  const currentLevel = currentCategory.levels.find((l) => l.id === inputs.ccnlLevelId) || currentCategory.levels[0];

  const ccnlNameDisplay =
    inputs.mode === 'ccnl'
      ? inputs.ccnlId === 'custom'
        ? inputs.customCcnlName || 'CCNL Personalizzato'
        : `${currentCategory.name} — ${currentLevel.name}`
      : `Standard (${inputs.months} Mensilità)`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Salve! Sono LegalPay Copilot, il tuo assistente AI esperto in Diritto del Lavoro italiano, relazioni industriali e fiscalità del lavoro (TUIR).

Quadro normativo vincolante attivo sul contesto:
• Retribuzione Annua Lorda (RAL): € ${Math.round(result.ral).toLocaleString('it-IT')} (${result.months} Mensilità)
• Inquadramento Contrattuale: ${ccnlNameDisplay}
• Imponibile Fiscale IRPEF: € ${Math.round(result.taxableIrpefYearly).toLocaleString('it-IT')} /anno
• Costo Totale Azienda Effettivo: € ${Math.round(result.totalEmployerCostMonthly).toLocaleString('it-IT')} /mese

Puoi cliccare uno dei generatori di atti sotto o scrivermi un quesito normativo (es. Art. 2113 c.c., Jobs Act D.Lgs. 23/2015, Art. 2077 c.c., Art. 17-19 TUIR).`,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    const userQuery = inputMessage.toLowerCase();
    setInputMessage('');

    setTimeout(() => {
      let aiText = `In relazione al quesito posto ed in applicazione del quadro normativo vincolante:\n\n`;

      if (userQuery.includes('transazion') || userQuery.includes('2113') || userQuery.includes('conciliaz')) {
        aiText += `1. INOPPUGNABILITÀ (Art. 2113 c.c. & Artt. 410, 411, 412-ter c.p.c.):\nLe rinunzie e transazioni aventi ad oggetto diritti del prestatore derivanti da disposizioni inderogabili di legge o di CCNL sono inoppugnabili solo se sottoscritte in sede protetta (ITL, commissioni sindacali o organi di certificazione).\n\n2. ESENZIONE CONTRIBUTIVA & REGIME FISCALE:\nLe somme a titolo transattivo o di incentivo all'esodo sono esenti da contributi INPS sia lavoratore che datore (Art. 12 L. 153/1969) e sono assoggettate a tassazione separata ex Art. 17, c. 1, lett. a) TUIR ed Art. 19 TUIR (aliquota media del lavoratore).`;
      } else if (userQuery.includes('licenziam') || userQuery.includes('jobs act') || userQuery.includes('18')) {
        aiText += `1. REGIME JOBS ACT (D.Lgs. 23/2015 - Post 7/3/2015):\nPer le aziende sopra i 15 dipendenti, l'indennità risarcitoria è determinata fra 6 e 36 mensilità (D.L. 87/2018), secondo i criteri delle sentenze della Corte Costituzionale n. 194/2018 e n. 150/2020 (anzianità, dimensioni aziendali, comportamento parti). Nelle piccole imprese (≤15 dipendenti) la forbice è ridotta a 3-6 mensilità (Art. 9 D.Lgs. 23/2015).\n\n2. REGIME ANTE 2015 (Art. 18 L. 300/1970 post L. 92/2012):\nTutela risarcitoria tra 12 e 24 mensilità o reintegrazione ove prevista.`;
      } else if (userQuery.includes('superminimo') || userQuery.includes('assorbi') || userQuery.includes('2077')) {
        aiText += `1. REGOLA DELL'ASSORBIBILITÀ (Art. 2077 c.c.):\nI superminimi individuali concessi al lavoratore si presumono assorbibili in occasione dei futuri aumenti dei minimi tabellari del CCNL ${currentCategory.code}.\n\n2. DEROGA AD PERSONAM:\nL'assorbimento è escluso soltanto in presenza di espressa pattuizione scritta ("superminimo ad personam non assorbibile") o qualora si dimostri la specifica meritevolezza del dipendente.`;
      } else if (userQuery.includes('tfr') || userQuery.includes('2120')) {
        aiText += `1. ACCANTONAMENTO TFR (Art. 2120 c.c.):\nLa quota annua si calcola dividendo la retribuzione utile per 13,5 e detraendo il contributo IVS dello 0,50%.\nIn caso di transazione in sede protetta, le competenze di fine rapporto (TFR) mantengono il regime di tassazione separata ex Art. 19 TUIR.`;
      } else {
        aiText += `Sulla posizione retributiva in esame (${ccnlNameDisplay}, RAL € ${Math.round(result.ral).toLocaleString('it-IT')}):\n• Imponibile IRPEF: € ${Math.round(result.taxableIrpefYearly).toLocaleString('it-IT')}\n• Trattenuta INPS IVS (9,19%): € ${Math.round(result.inpsEmployeeYearly).toLocaleString('it-IT')}\n• IRPEF Netta Trattenuta: € ${Math.round(result.netIrpefYearly).toLocaleString('it-IT')}\n\nSi conferma l'applicazione della riforma IRPEF a 3 scaglioni (23%, 35%, 43%) con detrazioni ex Art. 13 TUIR ed eventuale tutela per figli <21 anni tramite Assegno Unico Universale INPS fuori cedolino.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  // Quick Action 1: Genera Bozza Clausola Verbale Conciliazione 2113 c.c.
  const generateClause2113 = () => {
    const settlement = calculateSettlement({ grossOfferAmount: 20000, seniorityYears: 5, taxCategory: 'transazione_2113' });
    const text = `VERBALE DI CONCILIAZIONE IN SEDE PROTECTA (EX ART. 2113 C.C. / ARTT. 410, 411 C.P.C.)

Le Parti convenute avanti alla Commissione di Conciliazione concordano la risoluzione tombale di ogni ed qualsiasi pretesa derivante dall'intercorso rapporto di lavoro, mediante l'erogazione in favore del Lavoratore della somma lorda omnicomprensiva di € ${settlement.grossOfferAmount.toLocaleString('it-IT')},00 a titolo di transazione novativa risarcitoria.

DISCIPLINA FISCALE E PREVIDENZIALE:
1. Ai sensi dell'Art. 17, comma 1, lett. a) TUIR e dell'Art. 19 TUIR, sulla predetta somma si applica la ritenuta d'imposta a titolo di tassazione separata con aliquota media presunta del ${settlement.estimatedTaxRate}%, pari ad € ${settlement.taxAmount.toLocaleString('it-IT')},00, per un importo netto erogato in favore del Lavoratore di € ${settlement.netSettlementAmount.toLocaleString('it-IT')},00.
2. Le Parti danno atto che la predetta somma risarcitoria è interamente esente da contributi previdenziali ed assistenziali INPS ed INAIL (0,00 €) sia a carico del Lavoratore che a carico della Società, ai sensi dell'Art. 12, L. 153/1969 e s.m.i.
3. Il presente verbale rende la transazione inoppugnabile ai sensi dell'Art. 2113, comma 4, c.c.`;

    const aiMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      text,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      isDocument: true,
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  // Quick Action 2: Genera Lettera di Assunzione e Superminimo
  const generateHiringLetter = () => {
    const text = `LETTERA DI ASSUNZIONE E DISCIPLINA DEL SUPERMINIMO (EX ART. 2077 C.C.)

Spett.le Lavoratore,
Con la presente Le confermiamo l'assunzione alle dipendenze della Scrivente Società alle seguenti condizioni economiche e normative:

1. INQUADRAMENTO CONTRATTUALE:
- Contratto Collettivo Applicabile: ${ccnlNameDisplay}
- Mensilità Contrattuali: ${result.months}
- Paga Base Tabellare Mensile: € ${result.monthlyBasePay.toFixed(2)}
- Superminimo Mensile Individuale: € ${result.monthlySuperminimo.toFixed(2)}
- Retribuzione Annua Lorda (RAL): € ${Math.round(result.ral).toLocaleString('it-IT')}

2. CLAUSOLA DI ASSORBIBILITÀ DEL SUPERMINIMO (ART. 2077 C.C.):
Il superminimo mensile pattuito di € ${result.monthlySuperminimo.toFixed(2)} viene concesso a titolo ${inputs.superminimoType === 'absorbable' ? 'ASSORBIBILE ex Art. 2077 c.c. Pertanto, tale compenso verrà riassorbito, in tutto o in parte, in occasione di futuri aumenti dei minimi contrattuali di categoria o di scatti retributivi' : 'AD PERSONAM NON ASSORBIBILE. Le Parti pattuiscono espressamente che tale compenso non potrà essere riassorbito da futuri aumenti contrattuali o scatti di livello del CCNL applicato'}.`;

    const aiMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      text,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      isDocument: true,
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  // Quick Action 3: Parere Fiscale Transazione 2113 vs Retribuzione
  const generateFiscalOpinion = () => {
    const text = `PARERE TECNICO-GIURIDICO: VALUTAZIONE DI CONVENIENZA ECONOMICO-FISCALE (TRANSAZIONE EX ART. 2113 C.C. VS RETRIBUZIONE ORDINARIA)

1. RETRIBUZIONE ORDINARIA O PREMIALE IN BUSTA PAGA:
Un'erogazione retributiva in cedolino comporta l'assoggettamento a contributi IVS INPS dipendente (9,19%) ed oneri datoriali (~24%), oltre ad IRPEF progressiva per scaglioni ex Art. 13 TUIR (fino al 43%).
• Incidenza cuneo fiscale complessivo: ~${result.cuneoFiscalePercentage.toFixed(1)}% del budget aziendale.

2. SOMME TRANSATTIVE IN SEDE PROTECTA (ART. 2113 C.C. / ART. 17 TUIR):
Le somme corrisposte a titolo di transazione novativa risarcitoria o incentivo all'esodo in sede protetta (ITL / Commissione Sindacale ex Art. 410 c.p.c.):
- Beneficiano dell'ESENZIONE CONTRIBUTIVA INPS (0,00 €) ex Art. 12 L. 153/1969.
- Beneficiano della TASSAZIONE SEPARATA IRPEF ex Art. 17, c. 1, lett. a) ed Art. 19 TUIR (aliquota media quinquennale, es. 23%-27%).

CONCLUSIONE FORENSE: L'accordo transattivo in sede protetta garantisce all'azienda l'eliminazione del costo contributivo datoriale (~24%) ed assicura al lavoratore un rendimento netto superiore a parità di somma lorda pattuita.`;

    const aiMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      text,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      isDocument: true,
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-extrabold">LegalPay Copilot</h2>
              <button
                type="button"
                onClick={() => setShowSystemPromptModal(!showSystemPromptModal)}
                className="text-[9px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono flex items-center space-x-1 cursor-pointer"
                title="Visualizza Prompt di Sistema Giuslavoristico"
              >
                <BookOpen className="w-2.5 h-2.5 mr-0.5" />
                <span>Normativa</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-300">Assistente Giuslavoristico & Redattore Atti Forensi</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* System Prompt View Modal */}
      {showSystemPromptModal && (
        <div className="bg-slate-800 text-slate-200 p-3 border-b border-slate-700 text-[10px] space-y-1 font-mono">
          <div className="flex justify-between items-center font-bold text-emerald-400">
            <span>QUADRO NORMATIVO DI RIFERIMENTO VINCOLANTE:</span>
            <button onClick={() => setShowSystemPromptModal(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <p className="text-[9px] leading-relaxed max-h-36 overflow-y-auto text-slate-300">
            {LEGAL_COPILOT_SYSTEM_PROMPT}
          </p>
        </div>
      )}

      {/* Quick Action Buttons Toolbar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Generatori Rapidi di Atti Forensi</div>
        <div className="flex flex-col space-y-1.5">
          <button
            type="button"
            onClick={generateClause2113}
            className="w-full text-left text-xs font-semibold p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-slate-800 flex items-center justify-between cursor-pointer"
          >
            <span className="truncate">📝 Bozza Verbale Conciliazione 2113 c.c.</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
          </button>

          <button
            type="button"
            onClick={generateHiringLetter}
            className="w-full text-left text-xs font-semibold p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-slate-800 flex items-center justify-between cursor-pointer"
          >
            <span className="truncate">📄 Lettera Assunzione & Art. 2077 c.c.</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
          </button>

          <button
            type="button"
            onClick={generateFiscalOpinion}
            className="w-full text-left text-xs font-semibold p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-slate-800 flex items-center justify-between cursor-pointer"
          >
            <span className="truncate">💡 Parere Fiscale Transazione 2113</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
          </button>
        </div>
      </div>

      {/* Chat History Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-[10px] font-bold text-slate-400">
                {msg.sender === 'user' ? 'Tu' : 'LegalPay Copilot'}
              </span>
              <span className="text-[9px] text-slate-300">{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : msg.isDocument
                  ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-mono text-[11px] rounded-bl-none shadow-xs'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.isDocument && (
                <div className="mt-2.5 pt-2 border-t border-emerald-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="inline-flex items-center px-2 py-1 bg-emerald-600 text-white font-bold rounded text-[10px] hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedId === msg.id ? 'Copiato!' : 'Copia Testo Atto'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Chiedi un parere giuslavoristico..."
          className="flex-1 text-xs py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
