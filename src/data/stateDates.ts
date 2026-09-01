export interface StateSchedule {
  state: string;
  selfEnumerationStart: string;
  selfEnumerationEnd: string;
  surveyStart: string;
  surveyEnd: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Northeast' | 'Central' | 'UT';
  /** Population in millions — 2011 census, used for demo data card. */
  population2011: number;
}

// Illustrative sample schedule for demo purposes — not official Census of India dates.
export const stateSchedules: StateSchedule[] = [
  // ── South ──────────────────────────────────────────────────────────────
  { state: 'Andhra Pradesh',   selfEnumerationStart: '2027-01-15', selfEnumerationEnd: '2027-02-15', surveyStart: '2027-03-01', surveyEnd: '2027-03-28', region: 'South',     population2011: 49.4  },
  { state: 'Karnataka',        selfEnumerationStart: '2027-01-15', selfEnumerationEnd: '2027-02-15', surveyStart: '2027-02-25', surveyEnd: '2027-03-22', region: 'South',     population2011: 61.1  },
  { state: 'Kerala',           selfEnumerationStart: '2027-01-12', selfEnumerationEnd: '2027-02-12', surveyStart: '2027-02-20', surveyEnd: '2027-03-18', region: 'South',     population2011: 33.4  },
  { state: 'Tamil Nadu',       selfEnumerationStart: '2027-01-10', selfEnumerationEnd: '2027-02-10', surveyStart: '2027-02-20', surveyEnd: '2027-03-18', region: 'South',     population2011: 72.1  },
  { state: 'Telangana',        selfEnumerationStart: '2027-01-16', selfEnumerationEnd: '2027-02-16', surveyStart: '2027-02-26', surveyEnd: '2027-03-24', region: 'South',     population2011: 35.0  },
  // ── North ──────────────────────────────────────────────────────────────
  { state: 'Delhi',            selfEnumerationStart: '2027-01-05', selfEnumerationEnd: '2027-02-05', surveyStart: '2027-02-15', surveyEnd: '2027-03-10', region: 'North',     population2011: 16.8  },
  { state: 'Haryana',          selfEnumerationStart: '2027-01-18', selfEnumerationEnd: '2027-02-18', surveyStart: '2027-03-01', surveyEnd: '2027-03-26', region: 'North',     population2011: 25.4  },
  { state: 'Himachal Pradesh', selfEnumerationStart: '2027-01-25', selfEnumerationEnd: '2027-02-25', surveyStart: '2027-03-08', surveyEnd: '2027-04-02', region: 'North',     population2011: 6.9   },
  { state: 'Jammu & Kashmir',  selfEnumerationStart: '2027-02-01', selfEnumerationEnd: '2027-03-01', surveyStart: '2027-03-15', surveyEnd: '2027-04-10', region: 'North',     population2011: 12.5  },
  { state: 'Punjab',           selfEnumerationStart: '2027-01-22', selfEnumerationEnd: '2027-02-22', surveyStart: '2027-03-05', surveyEnd: '2027-03-30', region: 'North',     population2011: 27.7  },
  { state: 'Rajasthan',        selfEnumerationStart: '2027-01-14', selfEnumerationEnd: '2027-02-14', surveyStart: '2027-02-24', surveyEnd: '2027-03-22', region: 'North',     population2011: 68.6  },
  { state: 'Uttar Pradesh',    selfEnumerationStart: '2027-01-05', selfEnumerationEnd: '2027-02-05', surveyStart: '2027-02-12', surveyEnd: '2027-03-15', region: 'North',     population2011: 199.8 },
  { state: 'Uttarakhand',      selfEnumerationStart: '2027-01-20', selfEnumerationEnd: '2027-02-20', surveyStart: '2027-03-02', surveyEnd: '2027-03-28', region: 'North',     population2011: 10.1  },
  // ── West ───────────────────────────────────────────────────────────────
  { state: 'Goa',              selfEnumerationStart: '2027-01-12', selfEnumerationEnd: '2027-02-12', surveyStart: '2027-02-20', surveyEnd: '2027-03-15', region: 'West',      population2011: 1.5   },
  { state: 'Gujarat',          selfEnumerationStart: '2027-01-20', selfEnumerationEnd: '2027-02-20', surveyStart: '2027-03-01', surveyEnd: '2027-03-25', region: 'West',      population2011: 60.4  },
  { state: 'Maharashtra',      selfEnumerationStart: '2027-01-08', selfEnumerationEnd: '2027-02-08', surveyStart: '2027-02-18', surveyEnd: '2027-03-15', region: 'West',      population2011: 112.4 },
  // ── East ───────────────────────────────────────────────────────────────
  { state: 'Bihar',            selfEnumerationStart: '2027-01-10', selfEnumerationEnd: '2027-02-10', surveyStart: '2027-02-20', surveyEnd: '2027-03-20', region: 'East',      population2011: 104.1 },
  { state: 'Jharkhand',        selfEnumerationStart: '2027-01-18', selfEnumerationEnd: '2027-02-18', surveyStart: '2027-03-01', surveyEnd: '2027-03-28', region: 'East',      population2011: 33.0  },
  { state: 'Odisha',           selfEnumerationStart: '2027-02-05', selfEnumerationEnd: '2027-03-05', surveyStart: '2027-03-18', surveyEnd: '2027-04-12', region: 'East',      population2011: 42.0  },
  { state: 'West Bengal',      selfEnumerationStart: '2027-01-25', selfEnumerationEnd: '2027-02-25', surveyStart: '2027-03-08', surveyEnd: '2027-04-02', region: 'East',      population2011: 91.3  },
  // ── Central ────────────────────────────────────────────────────────────
  { state: 'Chhattisgarh',     selfEnumerationStart: '2027-01-20', selfEnumerationEnd: '2027-02-20', surveyStart: '2027-03-02', surveyEnd: '2027-03-30', region: 'Central',   population2011: 25.5  },
  { state: 'Madhya Pradesh',   selfEnumerationStart: '2027-01-18', selfEnumerationEnd: '2027-02-18', surveyStart: '2027-03-01', surveyEnd: '2027-03-28', region: 'Central',   population2011: 72.6  },
  // ── Northeast ──────────────────────────────────────────────────────────
  { state: 'Arunachal Pradesh', selfEnumerationStart: '2027-02-10', selfEnumerationEnd: '2027-03-10', surveyStart: '2027-03-25', surveyEnd: '2027-04-18', region: 'Northeast', population2011: 1.4  },
  { state: 'Assam',            selfEnumerationStart: '2027-02-01', selfEnumerationEnd: '2027-03-01', surveyStart: '2027-03-15', surveyEnd: '2027-04-10', region: 'Northeast', population2011: 31.2  },
  { state: 'Manipur',          selfEnumerationStart: '2027-02-08', selfEnumerationEnd: '2027-03-08', surveyStart: '2027-03-22', surveyEnd: '2027-04-15', region: 'Northeast', population2011: 2.9   },
  { state: 'Meghalaya',        selfEnumerationStart: '2027-02-12', selfEnumerationEnd: '2027-03-12', surveyStart: '2027-03-26', surveyEnd: '2027-04-20', region: 'Northeast', population2011: 3.0   },
  { state: 'Mizoram',          selfEnumerationStart: '2027-02-15', selfEnumerationEnd: '2027-03-15', surveyStart: '2027-03-28', surveyEnd: '2027-04-22', region: 'Northeast', population2011: 1.1   },
  { state: 'Nagaland',         selfEnumerationStart: '2027-02-10', selfEnumerationEnd: '2027-03-10', surveyStart: '2027-03-25', surveyEnd: '2027-04-18', region: 'Northeast', population2011: 2.0   },
  { state: 'Sikkim',           selfEnumerationStart: '2027-02-18', selfEnumerationEnd: '2027-03-18', surveyStart: '2027-04-01', surveyEnd: '2027-04-25', region: 'Northeast', population2011: 0.6   },
  { state: 'Tripura',          selfEnumerationStart: '2027-02-05', selfEnumerationEnd: '2027-03-05', surveyStart: '2027-03-18', surveyEnd: '2027-04-12', region: 'Northeast', population2011: 3.7   },
  // ── Union Territories ──────────────────────────────────────────────────
  { state: 'Andaman & Nicobar', selfEnumerationStart: '2027-02-20', selfEnumerationEnd: '2027-03-20', surveyStart: '2027-04-02', surveyEnd: '2027-04-25', region: 'UT',      population2011: 0.4   },
  { state: 'Chandigarh',       selfEnumerationStart: '2027-01-08', selfEnumerationEnd: '2027-02-08', surveyStart: '2027-02-18', surveyEnd: '2027-03-12', region: 'UT',       population2011: 1.1   },
  { state: 'Dadra & Nagar Haveli', selfEnumerationStart: '2027-01-15', selfEnumerationEnd: '2027-02-15', surveyStart: '2027-03-01', surveyEnd: '2027-03-22', region: 'UT',  population2011: 0.6   },
  { state: 'Lakshadweep',      selfEnumerationStart: '2027-02-22', selfEnumerationEnd: '2027-03-22', surveyStart: '2027-04-05', surveyEnd: '2027-04-28', region: 'UT',       population2011: 0.1   },
  { state: 'Puducherry',       selfEnumerationStart: '2027-01-10', selfEnumerationEnd: '2027-02-10', surveyStart: '2027-02-22', surveyEnd: '2027-03-18', region: 'UT',       population2011: 1.2   },
];

export const regions = ['All', 'North', 'South', 'East', 'West', 'Northeast', 'Central', 'UT'] as const;
