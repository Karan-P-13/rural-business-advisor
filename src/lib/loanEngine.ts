import { SchemeProfile, Sector, schemesDatabase } from '../data/schemesData';

export interface UserProfile {
  location: string;     // Free text e.g. "Chennai, Tamil Nadu"
  budget: string;       // e.g. "₹50,000"
  skills: string;       // e.g. "Tailoring"
  interest: string;     // e.g. "Garment shop"
}

export interface EligibilityResult {
  scheme: SchemeProfile;
  eligible: boolean;
  reasons: string[];          // Why it matched
  disqualifiers: string[];    // Why it didn't match (shown when eligible=false)
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
  eligibilityDetails: EligibilityResult[];  // Full breakdown for every scheme
}

// ─── Sector Classification ──────────────────────────────────────────────────
// Map free-text skills/interests to our canonical Sector type
const SECTOR_KEYWORDS: Record<Sector, string[]> = {
  Agriculture: ['farm', 'agri', 'crop', 'kisan', 'soil', 'harvest', 'paddy', 'wheat', 'tractor', 'irrigation'],
  Dairy:       ['dairy', 'milk', 'cow', 'buffalo', 'cattle', 'poultry', 'goat', 'sheep'],
  Fisheries:   ['fish', 'prawn', 'shrimp', 'aqua', 'pond', 'marine'],
  Handicrafts: ['craft', 'pottery', 'weave', 'weaving', 'basket', 'cane', 'bamboo', 'embroid', 'zari', 'block print', 'sculptor', 'mat maker'],
  Tailoring:   ['tailor', 'sewing', 'stitch', 'garment', 'cloth', 'fabric', 'dress', 'boutique'],
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
  // Default to Retail if nothing detected (most common micro-business)
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

  // 1. State check
  if (scheme.level === 'State' && scheme.state) {
    if (detectedState !== scheme.state) {
      disqualifiers.push(`This scheme is exclusive to ${scheme.state} residents. Your location (${detectedState}) is not eligible.`);
    } else {
      reasons.push(`✅ Location in ${detectedState} matches the scheme's state requirement.`);
    }
  }

  // 2. Budget/Loan ceiling check
  if (projectCost > scheme.maxLoan) {
    disqualifiers.push(`Project cost ₹${projectCost.toLocaleString('en-IN')} exceeds scheme maximum of ₹${scheme.maxLoan.toLocaleString('en-IN')}.`);
  } else {
    reasons.push(`✅ Budget ₹${projectCost.toLocaleString('en-IN')} is within loan ceiling of ₹${scheme.maxLoan.toLocaleString('en-IN')}.`);
  }

  // 3. Minimum loan check
  if (scheme.minLoan && projectCost < scheme.minLoan) {
    disqualifiers.push(`Project cost ₹${projectCost.toLocaleString('en-IN')} is below this scheme's minimum of ₹${scheme.minLoan.toLocaleString('en-IN')}.`);
  }

  // 4. Sector eligibility
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

  // EMI: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
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

  // ── Classify the user's business context ─────────────────────────────────
  const combinedContext = `${skillsRaw} ${interestRaw}`;
  const userSectors = classifySectors(combinedContext);
  const detectedState = detectState(locationRaw);

  // ── Run eligibility engine against ALL schemes ─────────────────────────
  const eligibilityDetails: EligibilityResult[] = schemesDatabase.map(scheme =>
    checkEligibility(scheme, totalProjectCost, detectedState, userSectors)
  );

  // Only return truly eligible schemes
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
