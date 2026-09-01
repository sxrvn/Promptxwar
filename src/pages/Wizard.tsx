import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { askCensusGuide, type ChatMessage } from '../lib/gemini';
import { useLang } from '../i18n/LangContext';

// ─── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  headOfHouseholdName: string;
  address: string;
  district: string;
  state: string;
  buildingType: string;
  ownershipStatus: string;
  numRooms: string;
  drinkingWaterSource: string;
  memberCount: string;
  memberNames: string;
}

type AiStatus = 'unknown' | 'online' | 'offline';

// ─── Constants ───────────────────────────────────────────────────────────────
const LS_FORM_KEY  = 'census2027-wizard-form';
const LS_STEP_KEY  = 'census2027-wizard-step';

const initialFormData: FormData = {
  headOfHouseholdName: '', address: '', district: '', state: '',
  buildingType: '', ownershipStatus: '', numRooms: '', drinkingWaterSource: '',
  memberCount: '', memberNames: '',
};

const steps = [
  { id: 1, title: 'Verify Household',            desc: 'Confirm your address and household head details.' },
  { id: 2, title: 'Phase 1: House Listing',       desc: 'Provide building, ownership, and amenity details.' },
  { id: 3, title: 'Phase 2: Population Details',  desc: 'Add each usual resident and their individual details.' },
  { id: 4, title: 'Review & Submit',              desc: 'Check your responses and submit securely.' },
];

const SUGGESTED_PROMPTS = [
  'What documents do I need?',
  'What does Phase 1 collect?',
  'Is my data kept private?',
  'What if I make a mistake?',
];

const stepFields: Record<number, (keyof FormData)[]> = {
  1: ['headOfHouseholdName', 'address', 'district', 'state'],
  2: ['buildingType', 'ownershipStatus', 'numRooms', 'drinkingWaterSource'],
  3: ['memberCount', 'memberNames'],
  4: [],
};

const fieldLabels: Record<keyof FormData, string> = {
  headOfHouseholdName: 'Head of household name',
  address:             'Address',
  district:            'District',
  state:               'State',
  buildingType:        'Building type',
  ownershipStatus:     'Ownership status',
  numRooms:            'Number of dwelling rooms',
  drinkingWaterSource: 'Drinking water source',
  memberCount:         'Number of usual residents',
  memberNames:         'Names of residents',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function safeLocalStorage<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; }
  catch { return fallback; }
}

function safeSave(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function safeClear(...keys: string[]) {
  try { keys.forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ }
}

function formIsNonEmpty(fd: FormData) {
  return Object.values(fd).some(v => v.trim() !== '');
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Wizard() {
  const { t } = useLang();

  // Restore saved progress from localStorage on first render.
  const [activeStep, setActiveStep] = useState<number>(
    () => safeLocalStorage<number>(LS_STEP_KEY, 1)
  );
  const [formData, setFormData] = useState<FormData>(
    () => safeLocalStorage<FormData>(LS_FORM_KEY, initialFormData)
  );
  const [hasSavedProgress] = useState(() => {
    const saved = safeLocalStorage<FormData>(LS_FORM_KEY, initialFormData);
    const step  = safeLocalStorage<number>(LS_STEP_KEY, 1);
    return formIsNonEmpty(saved) || step > 1;
  });
  const [showResumeBanner, setShowResumeBanner] = useState(hasSavedProgress);
  const [submitted,        setSubmitted]        = useState(false);
  const [validationError,  setValidationError]  = useState<string | null>(null);

  // AI chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm your Census 2027 self-enumeration guide. Ask me anything about the steps below, or click a suggested question to get started." },
  ]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [aiStatus,  setAiStatus]  = useState<AiStatus>('unknown');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Probe AI status on mount — send a lightweight ping.
  useEffect(() => {
    fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'ping', history: [] }) })
      .then(r => setAiStatus(r.ok || r.status === 429 ? 'online' : 'offline'))
      .catch(() => setAiStatus('offline'));
  }, []);

  // Persist form changes to localStorage.
  useEffect(() => { safeSave(LS_FORM_KEY, formData); }, [formData]);
  useEffect(() => { safeSave(LS_STEP_KEY, activeStep); }, [activeStep]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const reply = await askCensusGuide(messages, text);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      // If we got a stub/offline reply, mark status accordingly.
      if (aiStatus === 'unknown') setAiStatus('offline');
    } finally {
      setLoading(false);
    }
  }

  function handleChatSubmit(e: FormEvent) { e.preventDefault(); sendMessage(input); }

  function updateField(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError(null);
  }

  function validateCurrentStep(): boolean {
    const missing = (stepFields[activeStep] ?? []).filter(f => !formData[f].trim());
    if (missing.length > 0) {
      setValidationError(`Please fill in: ${missing.map(f => fieldLabels[f]).join(', ')}`);
      return false;
    }
    setValidationError(null);
    return true;
  }

  function goNext() { if (validateCurrentStep()) setActiveStep(p => Math.min(steps.length, p + 1)); }
  function goBack() { setValidationError(null); setActiveStep(p => Math.max(1, p - 1)); }

  function handleFinalSubmit() {
    if (!validateCurrentStep()) return;
    safeClear(LS_FORM_KEY, LS_STEP_KEY);
    setSubmitted(true);
  }

  function clearSavedData() {
    safeClear(LS_FORM_KEY, LS_STEP_KEY);
    setFormData(initialFormData);
    setActiveStep(1);
    setShowResumeBanner(false);
    setValidationError(null);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('wizardPageTitle')}</h1>
      <p className="text-gray-600 mb-4 max-w-3xl">{t('wizardPageIntro')}</p>

      {/* Resume banner */}
      {showResumeBanner && (
        <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl text-sm" role="status">
          <span className="text-amber-800 font-medium">
            🔖 You have saved progress — continuing from Step {activeStep}.
          </span>
          <button
            onClick={clearSavedData}
            className="text-amber-700 underline hover:text-amber-900 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
          >
            Start fresh
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        {/* ── Step tracker + form ─────────────────────────────────────────── */}
        <div>
          <ol className="space-y-3 mb-6" aria-label="Self-enumeration steps">
            {steps.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActiveStep(s.id)}
                  aria-current={activeStep === s.id ? 'step' : undefined}
                  className={`w-full text-left flex gap-3 p-4 rounded-xl border transition-colors ${
                    activeStep === s.id
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-semibold text-sm ${
                      activeStep === s.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                    aria-hidden="true"
                  >
                    {s.id}
                  </span>
                  <span>
                    <span className="block font-semibold">{s.title}</span>
                    <span className="block text-sm text-gray-600">{s.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-5 rounded-xl border border-gray-200 bg-white"
            aria-label={steps[activeStep - 1].title}
          >
            {submitted ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3" aria-hidden="true">✅</div>
                <h2 className="font-semibold text-lg mb-1">Submitted (Demo)</h2>
                <p className="text-gray-600 text-sm">
                  In a real deployment, this data would be encrypted and transmitted to the
                  official census system. Nothing was actually sent — this is a demo flow.
                </p>
              </div>
            ) : (
              <>
                {activeStep === 1 && (
                  <div className="space-y-4">
                    <TextField label={fieldLabels.headOfHouseholdName} name="headOfHouseholdName" value={formData.headOfHouseholdName} onChange={updateField} />
                    <TextField label={fieldLabels.address}             name="address"             value={formData.address}             onChange={updateField} />
                    <div className="grid grid-cols-2 gap-4">
                      <TextField label={fieldLabels.district} name="district" value={formData.district} onChange={updateField} />
                      <TextField label={fieldLabels.state}    name="state"    value={formData.state}    onChange={updateField} />
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <SelectField label={fieldLabels.buildingType}        name="buildingType"        value={formData.buildingType}        onChange={updateField} options={['Pucca (permanent)', 'Semi-pucca', 'Kutcha (temporary)']} />
                    <SelectField label={fieldLabels.ownershipStatus}     name="ownershipStatus"     value={formData.ownershipStatus}     onChange={updateField} options={['Owned', 'Rented', 'Other']} />
                    <TextField  label={fieldLabels.numRooms}             name="numRooms"            value={formData.numRooms}            onChange={updateField} type="number" />
                    <SelectField label={fieldLabels.drinkingWaterSource} name="drinkingWaterSource" value={formData.drinkingWaterSource} onChange={updateField} options={['Piped water', 'Borewell/handpump', 'Public tap', 'Other']} />
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <TextField label={fieldLabels.memberCount} name="memberCount" value={formData.memberCount} onChange={updateField} type="number" />
                    <div>
                      <label htmlFor="memberNames" className="block text-sm font-medium text-gray-700 mb-1">
                        {fieldLabels.memberNames}
                      </label>
                      <textarea
                        id="memberNames"
                        name="memberNames"
                        value={formData.memberNames}
                        onChange={updateField}
                        rows={3}
                        placeholder="One name per line"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div>
                    <h2 className="font-semibold mb-3">Review your responses</h2>
                    <dl className="space-y-2 text-sm">
                      {(Object.keys(formData) as (keyof FormData)[]).map(key => (
                        <div key={key} className="flex justify-between gap-4 border-b border-gray-100 pb-1">
                          <dt className="text-gray-500">{fieldLabels[key]}</dt>
                          <dd className="text-gray-800 text-right">{formData[key] || '—'}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {validationError && (
                  <p role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {validationError}
                  </p>
                )}
              </>
            )}
          </form>

          {!submitted && (
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={goBack} disabled={activeStep === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40">
                Back
              </button>
              {activeStep < steps.length ? (
                <button type="button" onClick={goNext}
                  className="px-4 py-2 rounded-lg bg-[var(--color-teal)] text-white">
                  Next
                </button>
              ) : (
                <button type="button" onClick={handleFinalSubmit}
                  className="px-4 py-2 rounded-lg bg-[var(--color-teal)] text-white">
                  Submit (Demo)
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── AI chat guide ────────────────────────────────────────────────── */}
        <div className="border border-gray-200 rounded-xl flex flex-col h-[540px]">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              🤖 {t('aiGuideLabel')}
              <span className="text-xs font-normal text-gray-500">(powered by Gemini)</span>
            </span>
            {/* AI status indicator */}
            <AiStatusPill status={aiStatus} />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === 'user' ? 'ml-auto bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-sm text-gray-400 px-4">Typing…</div>}
          </div>

          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50"
              >
                {p}
              </button>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 flex gap-2">
            <label className="sr-only" htmlFor="chat-input">Ask the census guide</label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button type="submit" disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-40">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AiStatusPill({ status }: { status: AiStatus }) {
  if (status === 'unknown') return null;
  const online = status === 'online';
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
        online ? 'bg-green-50 border-green-300 text-green-700' : 'bg-amber-50 border-amber-300 text-amber-700'
      }`}
      title={online ? 'Gemini AI is reachable' : 'AI offline — using built-in answers'}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} aria-hidden="true" />
      {online ? 'AI Online' : 'Offline Mode'}
    </span>
  );
}

function TextField({ label, name, value, onChange, type = 'text' }: {
  label: string; name: string; value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: {
  label: string; name: string; value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select id={name} name={name} value={value} onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300">
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
