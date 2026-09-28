export type Sector = 'Agriculture' | 'Food' | 'Retail' | 'Manufacturing' | 'Service' | 'Electronics' | 'Construction' | 'Beauty' | 'IT' | 'Transport' | 'Any';

export interface SchemeProfile {
  id: string;
  name: string;
  description: string;
  level: 'National' | 'State';
  state?: string;
  minLoan?: number;
  maxLoan: number;
  allowedSectors: Sector[];
  excludedSectors: Sector[];
}

export interface EligibilityResult {
  scheme: SchemeProfile;
  eligible: boolean;
  reasons: string[];
  disqualifiers: string[];
}

export interface LoanUnderwritingResult {
  totalProjectCost: number;
  userEquity: number;
  netBankLoan: number;
  monthlyEMI: number;
  monthlyRevenue: number;
  monthlyOperatingExpenses: number;
  netMonthlyCashFlow: number;
  dscr: number;
  verdict: 'Highly Affordable' | 'Moderate / Viable' | 'Unaffordable';
  verdictDescription: string;
  recommendedSchemes: SchemeProfile[];
  eligibilityDetails: EligibilityResult[];
}

// ─── Database of Schemes ─────────────────────────────────────────────────────
const schemesDatabase: SchemeProfile[] = [
  {
    id: 'pmegp_manufacturing',
    name: 'PMEGP (Manufacturing)',
    description: 'Prime Minister Employment Generation Programme for manufacturing units. Huge subsidy for rural areas.',
    level: 'National',
    maxLoan: 5000000,
    allowedSectors: ['Manufacturing', 'Food', 'Electronics', 'Construction'],
    excludedSectors: ['Agriculture', 'Retail'],
  },
  {
    id: 'pmegp_service',
    name: 'PMEGP (Service)',
    description: 'Prime Minister Employment Generation Programme for service sector and retail.',
    level: 'National',
    maxLoan: 2000000,
    allowedSectors: ['Retail', 'Beauty', 'IT', 'Transport', 'Food'],
    excludedSectors: ['Agriculture'],
  },
  {
    id: 'mudra_shishu',
    name: 'Pradhan Mantri MUDRA Yojana - Shishu',
    description: 'Micro-loans for starting a new very small business without collateral.',
    level: 'National',
    maxLoan: 50000,
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],
  },
  {
    id: 'mudra_kishore',
    name: 'Pradhan Mantri MUDRA Yojana - Kishore',
    description: 'Mid-sized micro-loans for growing businesses.',
    level: 'National',
    minLoan: 50000,
    maxLoan: 500000,
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],
  },
  {
    id: 'tnrtp',
    name: 'Tamil Nadu Rural Transformation Project (TNRTP)',
    description: 'Exclusive state grant matching scheme for rural entrepreneurs in Tamil Nadu.',
    level: 'State',
    state: 'Tamil Nadu',
    maxLoan: 300000,
    allowedSectors: ['Any'],
    excludedSectors: [],
  },
  {
    id: 'cmegp_mh',
    name: 'CMEGP Maharashtra',
    description: 'Chief Minister Employment Generation Programme exclusively for Maharashtra residents.',
    level: 'State',
    state: 'Maharashtra',
    maxLoan: 5000000,
    allowedSectors: ['Manufacturing', 'Retail', 'Service', 'Food'],
    excludedSectors: [],
  },
  {
    id: 'umesrh',
    name: 'UP Mukhyamantri Yuva Swarozgar Yojana',
    description: 'State scheme for youth in Uttar Pradesh to establish self-employment ventures.',
    level: 'State',
    state: 'Uttar Pradesh',
    maxLoan: 2500000,
    allowedSectors: ['Any'],
    excludedSectors: [],
  }
];

// ─── Classification Engines ──────────────────────────────────────────────────
const SECTOR_KEYWORDS = {
  Agriculture: ['farm', 'crop', 'agriculture', 'tractor', 'seed', 'dairy', 'poultry', 'animal', 'goat', 'cow'],
  Food:        ['cook', 'bake', 'cake', 'canteen', 'tiffin', 'catering', 'bakery', 'restaurant', 'food', 'snack', 'tea stall', 'chai'],
  Retail:      ['shop', 'store', 'sell', 'trader', 'kirana', 'grocery', 'retail', 'merchant', 'dealership'],
  Manufacturing: ['manufactur', 'factory', 'produce', 'assembl', 'packag', 'processing', 'unit', 'paper', 'plastic', 'rubber'],
  Electronics: ['electronic', 'phone', 'mobile', 'tv', 'repair', 'appliance', 'circuit', 'wire', 'electric', 'led'],
  Construction: ['build', 'mason', 'cement', 'paint', 'plumb', 'carpenter', 'woodwork', 'furniture', 'tiles'],
  Beauty:      ['salon', 'hair', 'beauty', 'makeup', 'parlour', 'barber', 'spa', 'skin', 'nails'],
  IT:          ['computer', 'software', 'data', 'digital', 'online', 'internet', 'typing', 'cyber', 'tech'],
  Transport:   ['driver', 'truck', 'delivery', 'logistics', 'auto', 'bike', 'taxi', 'cab', 'vehicle'],
  Any:         [],
};

function classifySectors(text: string): Set<Sector> {
  const lower = text.toLowerCase();
  const detected = new Set<Sector>();
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS) as [Sector, string[]][]) {
    if (sector === 'Any') continue;
    if (keywords.some(kw => lower.includes(kw))) {
      detected.add(sector);
    }
  }
  if (detected.size === 0) detected.add('Retail');
  return detected;
}

function detectState(locationText: string): string {
  const loc = locationText.toLowerCase();
  const statePatterns: [string, string][] = [
    ['Tamil Nadu', 'tamil'],
    ['Tamil Nadu', 'chennai'],
    ['Tamil Nadu', 'coimbatore'],
    ['Tamil Nadu', 'madurai'],
    ['Tamil Nadu', 'tirunelveli'],
    ['Tamil Nadu', 'trichy'],
    ['Uttar Pradesh', 'lucknow'],
    ['Uttar Pradesh', 'agra'],
    ['Uttar Pradesh', 'varanasi'],
    ['Uttar Pradesh', 'kanpur'],
    ['Uttar Pradesh', 'uttar pradesh'],
    ['Maharashtra', 'mumbai'],
    ['Maharashtra', 'pune'],
    ['Maharashtra', 'nagpur'],
    ['Maharashtra', 'maharashtra'],
    ['Karnataka', 'bengaluru'],
    ['Karnataka', 'bangalore'],
    ['Karnataka', 'mysuru'],
    ['Karnataka', 'mysore'],
    ['Karnataka', 'karnataka'],
    ['Rajasthan', 'jaipur'],
    ['Rajasthan', 'jodhpur'],
    ['Rajasthan', 'rajasthan'],
    ['Gujarat', 'ahmedabad'],
    ['Gujarat', 'surat'],
    ['Gujarat', 'gujarat'],
    ['Andhra Pradesh', 'hyderabad'],
    ['Andhra Pradesh', 'vijayawada'],
    ['Andhra Pradesh', 'andhra'],
    ['West Bengal', 'kolkata'],
    ['West Bengal', 'west bengal'],
    ['Madhya Pradesh', 'bhopal'],
    ['Madhya Pradesh', 'indore'],
    ['Madhya Pradesh', 'madhya pradesh'],
    ['Kerala', 'kochi'],
    ['Kerala', 'thiruvananthapuram'],
    ['Kerala', 'kerala'],
  ];
  for (const [state, keyword] of statePatterns) {
    if (loc.includes(keyword)) return state;
  }
  return 'Unknown';
}

// ─── Core Eligibility Engine ─────────────────────────────────────────────────
export function checkEligibility(
  scheme: SchemeProfile,
  projectCost: number,
  detectedState: string,
  userSectors: Set<Sector>,
): EligibilityResult {
  const reasons: string[] = [];
  const disqualifiers: string[] = [];

  if (scheme.level === 'State' && scheme.state) {
    if (detectedState !== scheme.state) {
      disqualifiers.push(`This scheme is exclusive to ${scheme.state} residents. Your location (${detectedState}) is not eligible.`);
    } else {
      reasons.push(`✅ Location in ${detectedState} matches the scheme's state requirement.`);
    }
  }

  if (projectCost > scheme.maxLoan) {
    disqualifiers.push(`Project cost ₹${projectCost.toLocaleString('en-IN')} exceeds scheme maximum of ₹${scheme.maxLoan.toLocaleString('en-IN')}.`);
  } else {
    reasons.push(`✅ Budget ₹${projectCost.toLocaleString('en-IN')} is within loan ceiling of ₹${scheme.maxLoan.toLocaleString('en-IN')}.`);
  }

  if (scheme.minLoan && projectCost < scheme.minLoan) {
    disqualifiers.push(`Project cost ₹${projectCost.toLocaleString('en-IN')} is below this scheme's minimum of ₹${scheme.minLoan.toLocaleString('en-IN')}.`);
  }

  const sectorAllowed = scheme.allowedSectors.includes('Any') ||
    [...userSectors].some(s => scheme.allowedSectors.includes(s));

  const sectorExcluded = [...userSectors].some(s => scheme.excludedSectors.includes(s));

  if (sectorExcluded) {
    const excluded = [...userSectors].filter(s => scheme.excludedSectors.includes(s));
    disqualifiers.push(`Your business sector (${excluded.join(', ')}) is explicitly excluded from this scheme.`);
  } else if (!sectorAllowed) {
    disqualifiers.push(`Your business sector is not covered by this scheme. Eligible sectors: ${scheme.allowedSectors.join(', ')}.`);
  } else {
    reasons.push(`✅ Your business type matches the sectors covered by this scheme.`);
  }

  const eligible = disqualifiers.length === 0;

  return { scheme, eligible, reasons, disqualifiers };
}

// ─── Main Exported Function ──────────────────────────────────────────────────
export function calculateLoanMetrics(
  budgetInput: string,
  locationRaw: string,
  aiRevenueEstimate: number,
  aiOpExEstimate: number,
  skillsRaw: string = '',
  interestRaw: string = '',
  interestRate: number = 10.5,
  tenureMonths: number = 60
): LoanUnderwritingResult {

  const numericBudget = parseInt(budgetInput.replace(/[^0-9]/g, ''), 10) || 50000;
  const totalProjectCost = numericBudget;
  const userEquity = totalProjectCost * 0.10;
  const netBankLoan = totalProjectCost - userEquity;

  const r = (interestRate / 100) / 12;
  const n = tenureMonths;
  const monthlyEMI = netBankLoan > 0
    ? Math.round((netBankLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
    : 0;

  const netMonthlyCashFlow = aiRevenueEstimate - aiOpExEstimate;
  const dscr = monthlyEMI > 0 ? Number((netMonthlyCashFlow / monthlyEMI).toFixed(2)) : 999;

  let verdict: 'Highly Affordable' | 'Moderate / Viable' | 'Unaffordable';
  let verdictDescription: string;

  if (dscr >= 1.75) {
    verdict = 'Highly Affordable';
    verdictDescription = '✅ Highly Affordable / Bank Approved — Low Default Risk';
  } else if (dscr >= 1.25) {
    verdict = 'Moderate / Viable';
    verdictDescription = '⚠️ Moderate / Viable — Tight Cash Reserves. Ensure strict expense control.';
  } else {
    verdict = 'Unaffordable';
    verdictDescription = '❌ High Risk — Loan Default Probable. Consider reducing initial investment or increasing self-contribution.';
  }

  const combinedContext = `${skillsRaw} ${interestRaw}`;
  const userSectors = classifySectors(combinedContext);
  const detectedState = detectState(locationRaw);

  const eligibilityDetails: EligibilityResult[] = schemesDatabase.map(scheme =>
    checkEligibility(scheme, totalProjectCost, detectedState, userSectors)
  );

  const recommendedSchemes = eligibilityDetails
    .filter(r => r.eligible)
    .map(r => r.scheme);

  return {
    totalProjectCost,
    userEquity,
    netBankLoan,
    monthlyEMI,
    monthlyRevenue: aiRevenueEstimate,
    monthlyOperatingExpenses: aiOpExEstimate,
    netMonthlyCashFlow,
    dscr,
    verdict,
    verdictDescription,
    recommendedSchemes,
    eligibilityDetails,
  };
}
