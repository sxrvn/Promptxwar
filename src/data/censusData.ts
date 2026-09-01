// Illustrative sample data (derived from publicly known 2011/2021 trends) for demo visualization.
// NOT official/live Census 2027 figures.

export const populationByDecade = [
  { year: '1951', population: 361 },
  { year: '1961', population: 439 },
  { year: '1971', population: 548 },
  { year: '1981', population: 683 },
  { year: '1991', population: 846 },
  { year: '2001', population: 1029 },
  { year: '2011', population: 1211 },
  { year: '2021*', population: 1380 },
  { year: '2027*', population: 1470 },
];

// Expanded to 16 states for a richer chart. Sorted descending by literacy.
export const literacyRateByState = [
  { state: 'Kerala',           literacy: 96.2, urbanPct: 47.7 },
  { state: 'Delhi',            literacy: 88.7, urbanPct: 97.5 },
  { state: 'Himachal Pradesh', literacy: 83.8, urbanPct: 10.0 },
  { state: 'Maharashtra',      literacy: 82.3, urbanPct: 45.2 },
  { state: 'Goa',              literacy: 88.7, urbanPct: 62.2 },
  { state: 'Tamil Nadu',       literacy: 80.1, urbanPct: 48.4 },
  { state: 'Karnataka',        literacy: 77.2, urbanPct: 38.6 },
  { state: 'Telangana',        literacy: 72.8, urbanPct: 39.0 },
  { state: 'West Bengal',      literacy: 76.3, urbanPct: 31.9 },
  { state: 'Andhra Pradesh',   literacy: 67.4, urbanPct: 29.6 },
  { state: 'Jharkhand',        literacy: 67.6, urbanPct: 24.1 },
  { state: 'Uttar Pradesh',    literacy: 67.7, urbanPct: 22.3 },
  { state: 'Odisha',           literacy: 73.5, urbanPct: 16.7 },
  { state: 'Madhya Pradesh',   literacy: 70.6, urbanPct: 27.6 },
  { state: 'Rajasthan',        literacy: 66.1, urbanPct: 24.9 },
  { state: 'Bihar',            literacy: 61.8, urbanPct: 11.3 },
];

export const urbanRuralSplit = [
  { name: 'Urban', value: 37 },
  { name: 'Rural', value: 63 },
];

export const genderRatioTrend = [
  { year: '1991', ratio: 927 },
  { year: '2001', ratio: 933 },
  { year: '2011', ratio: 943 },
  { year: '2021*', ratio: 948 },
  { year: '2027*', ratio: 952 },
];

export const ageDistribution = [
  { group: '0-14', pct: 26.2 },
  { group: '15-24', pct: 18.1 },
  { group: '25-54', pct: 40.3 },
  { group: '55-64', pct: 7.7 },
  { group: '65+', pct: 7.7 },
];

// State-level multidimensional data — used by the DataExplorer drill-down panel.
export interface StateSummary {
  state: string;
  literacy: number;
  urbanPct: number;
  sexRatio: number; // females per 1000 males (2011)
  pop2011: number;  // millions
}

export const stateSummaries: StateSummary[] = [
  { state: 'Kerala',           literacy: 96.2, urbanPct: 47.7, sexRatio: 1084, pop2011: 33.4  },
  { state: 'Delhi',            literacy: 88.7, urbanPct: 97.5, sexRatio: 868,  pop2011: 16.8  },
  { state: 'Himachal Pradesh', literacy: 83.8, urbanPct: 10.0, sexRatio: 972,  pop2011: 6.9   },
  { state: 'Goa',              literacy: 88.7, urbanPct: 62.2, sexRatio: 973,  pop2011: 1.5   },
  { state: 'Maharashtra',      literacy: 82.3, urbanPct: 45.2, sexRatio: 929,  pop2011: 112.4 },
  { state: 'Tamil Nadu',       literacy: 80.1, urbanPct: 48.4, sexRatio: 996,  pop2011: 72.1  },
  { state: 'Karnataka',        literacy: 77.2, urbanPct: 38.6, sexRatio: 973,  pop2011: 61.1  },
  { state: 'West Bengal',      literacy: 76.3, urbanPct: 31.9, sexRatio: 950,  pop2011: 91.3  },
  { state: 'Gujarat',          literacy: 79.3, urbanPct: 42.6, sexRatio: 919,  pop2011: 60.4  },
  { state: 'Odisha',           literacy: 73.5, urbanPct: 16.7, sexRatio: 979,  pop2011: 42.0  },
  { state: 'Telangana',        literacy: 72.8, urbanPct: 39.0, sexRatio: 988,  pop2011: 35.0  },
  { state: 'Madhya Pradesh',   literacy: 70.6, urbanPct: 27.6, sexRatio: 931,  pop2011: 72.6  },
  { state: 'Jharkhand',        literacy: 67.6, urbanPct: 24.1, sexRatio: 948,  pop2011: 33.0  },
  { state: 'Andhra Pradesh',   literacy: 67.4, urbanPct: 29.6, sexRatio: 993,  pop2011: 49.4  },
  { state: 'Uttar Pradesh',    literacy: 67.7, urbanPct: 22.3, sexRatio: 912,  pop2011: 199.8 },
  { state: 'Rajasthan',        literacy: 66.1, urbanPct: 24.9, sexRatio: 928,  pop2011: 68.6  },
  { state: 'Bihar',            literacy: 61.8, urbanPct: 11.3, sexRatio: 918,  pop2011: 104.1 },
];
