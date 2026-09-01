import { useMemo, useState, useEffect } from 'react';
import { stateSchedules, regions } from '../data/stateDates';
import { getEnumerationStatus, daysUntil, type EnumerationStatus } from '../lib/scheduleUtils';

type Status = EnumerationStatus;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_META: Record<Status, { label: string; classes: string; dot: string }> = {
  open:     { label: 'Open',     classes: 'bg-green-100  text-green-800  border-green-300',  dot: 'bg-green-500'  },
  upcoming: { label: 'Upcoming', classes: 'bg-amber-100  text-amber-800  border-amber-300',  dot: 'bg-amber-500'  },
  closed:   { label: 'Closed',   classes: 'bg-gray-100   text-gray-500   border-gray-300',   dot: 'bg-gray-400'   },
};

function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${m.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot} ${status === 'open' ? 'animate-pulse' : ''}`} aria-hidden="true" />
      {m.label}
    </span>
  );
}

export default function StateDates() {
  const [region, setRegion] = useState<(typeof regions)[number]>('All');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  // Force a re-render once a minute so status badges stay accurate.
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  useMemo(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  const filtered = useMemo(() => {
    return stateSchedules.filter((s) => {
      const matchesRegion = region === 'All' || s.region === region;
      const matchesQuery = s.state.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesRegion && matchesQuery;
    });
  }, [region, debouncedQuery]);

  const openCount     = stateSchedules.filter(s => getEnumerationStatus(s.selfEnumerationStart, s.selfEnumerationEnd) === 'open').length;
  const upcomingCount = stateSchedules.filter(s => getEnumerationStatus(s.selfEnumerationStart, s.selfEnumerationEnd) === 'upcoming').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">State-wise Schedule</h1>
      <p className="text-gray-600 mb-6 max-w-3xl">
        Self-enumeration and in-person survey windows for all states and Union Territories.
        Status updates automatically — all dates are illustrative sample data.
      </p>

      {/* Status summary strip */}
      <div className="flex flex-wrap gap-3 mb-6" aria-label="Status summary">
        <div className="flex items-center gap-2 px-4 py-2 border border-green-300 bg-green-50 rounded-lg text-sm font-semibold text-green-800">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
          {openCount} currently open
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-amber-300 bg-amber-50 rounded-lg text-sm font-semibold text-amber-800">
          <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
          {upcomingCount} upcoming
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm font-semibold text-gray-600">
          {stateSchedules.length - openCount - upcomingCount} closed
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <label className="flex-1 flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Search state or UT</span>
          <input
            type="text"
            placeholder="e.g. Kerala, Delhi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </label>
        <label className="sm:w-56 flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Filter by region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as typeof region)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {regions.map((r) => (
              <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <caption className="sr-only">State-wise self-enumeration and survey dates</caption>
          <thead className="bg-gray-50 text-left">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">State / UT</th>
              <th scope="col" className="px-4 py-3 font-semibold">Region</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Self-Enumeration Window</th>
              <th scope="col" className="px-4 py-3 font-semibold">Survey Window</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const status = getEnumerationStatus(s.selfEnumerationStart, s.selfEnumerationEnd);
              const days = status === 'upcoming' ? daysUntil(s.selfEnumerationStart) : null;
              return (
                <tr key={s.state} className="border-t border-gray-100 hover:bg-orange-50/50">
                  <th scope="row" className="px-4 py-3 font-medium text-left">
                    <div>{s.state}</div>
                    {days !== null && (
                      <div className="text-xs text-amber-600 font-normal mt-0.5">Opens in {days} day{days !== 1 ? 's' : ''}</div>
                    )}
                  </th>
                  <td className="px-4 py-3 text-gray-600">{s.region}</td>
                  <td className="px-4 py-3"><StatusBadge status={status} /></td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(s.selfEnumerationStart)} – {formatDate(s.selfEnumerationEnd)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(s.surveyStart)} – {formatDate(s.surveyEnd)}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No states match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-400">All dates are illustrative sample data for demonstration purposes, not official Census of India figures.</p>
    </div>
  );
}
