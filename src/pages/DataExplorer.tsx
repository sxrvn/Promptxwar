import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  populationByDecade, literacyRateByState, urbanRuralSplit,
  genderRatioTrend, ageDistribution, stateSummaries, type StateSummary,
} from '../data/censusData';
import { stateSchedules } from '../data/stateDates';
import { useLang } from '../i18n/LangContext';

const COLORS = ['#115E59', '#F59E0B', '#0D1B2A', '#334155', '#94A3B8', '#E11D48', '#7C3AED'];

function getSchedule(stateName: string) {
  return stateSchedules.find(s => s.state === stateName) ?? null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Build a combined dataset for the RadarChart — each row is a dimension, columns are states.
// RadarChart in Recharts 3.x takes a single data array; each Radar's dataKey maps to a series.
function buildRadarData(states: StateSummary[]) {
  const dims = [
    { subject: 'Literacy',    get: (s: StateSummary) => s.literacy },
    { subject: 'Urban %',     get: (s: StateSummary) => s.urbanPct },
    { subject: 'Sex Ratio',   get: (s: StateSummary) => Math.round((s.sexRatio / 1100) * 100) },
    { subject: 'Population',  get: (s: StateSummary) => Math.min(100, Math.round((s.pop2011 / 200) * 100)) },
  ];
  return dims.map(d => {
    const row: Record<string, number | string> = { subject: d.subject };
    states.forEach(s => { row[s.state] = d.get(s); });
    return row;
  });
}

export default function DataExplorer() {
  const { t } = useLang();
  const [selectedState, setSelectedState] = useState<StateSummary | null>(null);

  return (
    <div className="flex flex-col gap-8 mt-4">
      <section className="border-b-4 border-gray-900 pb-8">
        <p className="font-semibold tracking-widest uppercase mb-4 text-[#115E59]">Data Archive</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 display-text text-gray-900">{t('dataPageTitle')}</h1>
        <p className="text-xl text-gray-800 max-w-3xl leading-relaxed">{t('dataPageIntro')}</p>
      </section>

      <div className="grid lg:grid-cols-2 gap-0 border-t-2 border-l-2 border-gray-900">

        {/* ── 1. Population growth ────────────────────────────────────────── */}
        <ChartCard title="Population Growth by Decade (millions)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={populationByDecade}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="year" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="population" stroke="#FF9933" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── 2. Urban vs Rural ───────────────────────────────────────────── */}
        <ChartCard title="Urban vs Rural Population Split (2021)">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={urbanRuralSplit} dataKey="value" nameKey="name" outerRadius={90} label={true}>
                {urbanRuralSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── 3. Literacy — interactive ───────────────────────────────────── */}
        <ChartCard title="Literacy Rate by State (%) — click a bar to explore" full>
          <p className="text-xs text-gray-400 mb-2">Click any bar to see the full state profile →</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={literacyRateByState}
              layout="vertical"
              margin={{ left: 20, right: 16 }}
              onClick={(data: any) => {
                if (!data?.activeLabel) return;
                const stateName = data.activeLabel as string;
                const s = stateSummaries.find(x => x.state === stateName) ?? null;
                setSelectedState(prev => prev?.state === stateName ? null : s);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" domain={[0, 100]} fontSize={12} />
              <YAxis type="category" dataKey="state" width={130} fontSize={11} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Literacy']} />
              <Bar dataKey="literacy" radius={[0, 4, 4, 0]} cursor="pointer">
                {literacyRateByState.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={selectedState?.state === entry.state ? '#FF9933' : '#138808'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Drill-down panel */}
          {selectedState && (
            <DrillDownPanel state={selectedState} onClose={() => setSelectedState(null)} />
          )}
        </ChartCard>

        {/* ── 4. Sex ratio trend ─────────────────────────────────────────── */}
        <ChartCard title="Sex Ratio Trend (females per 1000 males)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={genderRatioTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="year" fontSize={12} />
              <YAxis domain={[900, 970]} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="ratio" stroke="#000080" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── 5. Age distribution ─────────────────────────────────────────── */}
        <ChartCard title="Age Group Distribution (%)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="group" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
              <Bar dataKey="pct" fill="#5B8DEF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── 6. Multi-indicator radar (top 5 by literacy) ────────────────── */}
        <ChartCard title="State Comparison — Top 5 by Literacy (multi-indicator)">
          <p className="text-xs text-gray-400 mb-2">Literacy · Urban % · Sex Ratio (scaled) · Population (scaled)</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={buildRadarData(stateSummaries.slice(0, 5))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" fontSize={11} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
              {stateSummaries.slice(0, 5).map((s, i) => (
                <Radar
                  key={s.state}
                  name={s.state}
                  dataKey={s.state}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.12}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function ChartCard({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`p-8 border-r-2 border-b-2 border-gray-900 bg-white ${full ? 'lg:col-span-2' : ''}`}>
      <h2 className="font-bold text-xl mb-6 text-gray-900 display-text uppercase tracking-wide border-b-2 border-gray-900 pb-2 inline-block">{title}</h2>
      {children}
    </div>
  );
}

function DrillDownPanel({ state, onClose }: { state: StateSummary; onClose: () => void }) {
  const schedule = getSchedule(state.state);

  return (
    <div className="mt-8 p-6 bg-white border-4 border-gray-900 relative" role="region" aria-label={`${state.state} profile`}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-900 font-bold hover:bg-gray-100 text-xl leading-none focus:outline-none focus:ring-4 focus:ring-amber-400 p-2"
        aria-label="Close state profile"
      >
        ×
      </button>
      <h3 className="font-bold text-2xl mb-6 text-gray-900 display-text uppercase tracking-wider">{state.state} PROFILE</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t-2 border-l-2 border-gray-900 mb-6">
        <Stat label="Literacy Rate"    value={`${state.literacy}%`} />
        <Stat label="Urban Population" value={`${state.urbanPct}%`} />
        <Stat label="Sex Ratio"        value={`${state.sexRatio}`}  />
        <Stat label="Population (2011)" value={`${state.pop2011}M`} />
      </div>
      {schedule && (
        <div className="border-t-4 border-gray-900 pt-4 text-sm text-gray-900">
          <p className="font-bold mb-2 uppercase tracking-wide text-[#115E59]">Official Census 2027 Schedule</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <p>Self-Enumeration:<br/> <strong className="text-lg">{formatDate(schedule.selfEnumerationStart)}</strong> – <strong className="text-lg">{formatDate(schedule.selfEnumerationEnd)}</strong></p>
            <p>Survey Window:<br/> <strong className="text-lg">{formatDate(schedule.surveyStart)}</strong> – <strong className="text-lg">{formatDate(schedule.surveyEnd)}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 border-r-2 border-b-2 border-gray-900 text-center">
      <p className="text-2xl font-bold text-[#115E59] display-text">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-900 mt-1">{label}</p>
    </div>
  );
}
