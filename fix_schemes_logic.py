import re

# 1. Update schemesData.ts to add strict sector and keyword rules
with open("src/data/schemesData.ts", "r") as f:
    schemes = f.read()

# Add KCC for agriculture
if "Kisan Credit Card" not in schemes:
    new_scheme = """  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    level: 'Central',
    maxLoan: 300000,
    subsidyPercentage: '2% Interest Subvention (up to 3 Lakhs)',
    collateralFree: true,
    eligibility: ['Farmers', 'Tenant Farmers', 'Agriculture & Allied Activities'],
    documents: ['Land holding documents', 'Aadhaar', 'PAN'],
    officialUrl: 'https://pmkisan.gov.in/'
  },"""
    schemes = schemes.replace("// Central Schemes", "// Central Schemes\n" + new_scheme)

with open("src/data/schemesData.ts", "w") as f:
    f.write(schemes)

# 2. Rewrite loanEngine.ts matching logic completely
new_loan_engine = """import { SchemeProfile, schemesDatabase } from '../data/schemesData';

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
}

export function calculateLoanMetrics(
  budgetInput: string,
  stateRaw: string,
  aiRevenueEstimate: number,
  aiOpExEstimate: number,
  businessInterest: string = '',
  userSkills: string = '',
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
  let verdictDescription = '';
  
  if (dscr >= 1.75) {
    verdict = 'Highly Affordable';
    verdictDescription = '✅ Highly Affordable / Bank Approved - Low Default Risk';
  } else if (dscr >= 1.25) {
    verdict = 'Moderate / Viable';
    verdictDescription = '⚠️ Moderate / Viable - Tight Cash Reserves. Ensure strict expense control.';
  } else {
    verdict = 'Unaffordable';
    verdictDescription = '❌ Unaffordable - High Risk of Loan Default. Downscale initial equipment or increase self-contribution.';
  }

  const recommendedSchemes = matchSchemes(totalProjectCost, stateRaw, businessInterest, userSkills);

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
    recommendedSchemes
  };
}

function matchSchemes(projectCost: number, stateRaw: string, interest: string, skills: string): SchemeProfile[] {
  const stateNormalized = stateRaw.toLowerCase();
  const interestNormalized = interest.toLowerCase();
  const skillsNormalized = skills.toLowerCase();
  const combinedContext = interestNormalized + " " + skillsNormalized;
  
  const matched: SchemeProfile[] = [];

  const isAgri = combinedContext.includes('farm') || combinedContext.includes('agri') || combinedContext.includes('crop') || combinedContext.includes('tractor');
  const isArtisan = combinedContext.includes('tailor') || combinedContext.includes('craft') || combinedContext.includes('wood') || combinedContext.includes('carpenter') || combinedContext.includes('potter') || combinedContext.includes('weave');

  // 1. Match State Schemes Strictly by Name/Location
  const stateSchemes = schemesDatabase.filter(s => 
    s.level === 'State' && 
    s.state && 
    stateNormalized.includes(s.state.toLowerCase()) && 
    projectCost <= s.maxLoan
  );
  matched.push(...stateSchemes);

  // 2. Strict Conditional Central Schemes
  if (isAgri) {
    // Agriculture is explicitly excluded from MUDRA, they get KCC instead
    matched.push(schemesDatabase.find(s => s.id === 'kcc')!);
  } else {
    // Non-Farm gets MUDRA based on budget tiers
    if (projectCost <= 50000) {
      matched.push(schemesDatabase.find(s => s.id === 'mudra-shishu')!);
    } else if (projectCost <= 500000) {
      matched.push(schemesDatabase.find(s => s.id === 'mudra-kishore')!);
    } else if (projectCost <= 1000000) {
      matched.push(schemesDatabase.find(s => s.id === 'mudra-tarun')!);
    }
  }

  // 3. PM Vishwakarma is STRICTLY for Artisans (18 identified trades)
  if (isArtisan && projectCost <= 300000) {
    matched.push(schemesDatabase.find(s => s.id === 'pm-vishwakarma')!);
  }

  // 4. Large scale manufacturing / service (PMEGP & Stand-Up India)
  if (projectCost > 1000000 && !isAgri) {
    matched.push(schemesDatabase.find(s => s.id === 'pmegp')!);
    if (projectCost >= 1000000) {
      matched.push(schemesDatabase.find(s => s.id === 'stand-up-india')!);
    }
  }

  return matched.filter(Boolean);
}
"""

with open("src/lib/loanEngine.ts", "w") as f:
    f.write(new_loan_engine)
