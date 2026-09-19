export type Sector =
  | 'Agriculture'
  | 'Handicrafts'
  | 'Tailoring'
  | 'Food'
  | 'Retail'
  | 'Manufacturing'
  | 'Electronics'
  | 'Construction'
  | 'Beauty'
  | 'IT'
  | 'Transport'
  | 'Dairy'
  | 'Fisheries'
  | 'Any';

export interface SchemeProfile {
  id: string;
  name: string;
  level: 'Central' | 'State';
  state?: string;                   // Required if level === 'State'
  maxLoan: number;
  minLoan?: number;
  subsidyPercentage: string;
  collateralFree: boolean;
  eligibility: string[];            // Human-readable eligibility description
  documents: string[];
  officialUrl: string;

  // ---- Strict eligibility constraints for programmatic matching ----
  allowedSectors: Sector[];         // [] means open to all non-excluded sectors
  excludedSectors: Sector[];        // Sectors explicitly NOT covered
  minAge?: number;
  maxAge?: number;
  genderRestriction?: 'Women' | 'SC/ST' | 'Women/SC/ST'; // undefined = no restriction
  requiresExistingBusiness?: boolean; // true = for existing business expansion
  newBusinessOnly?: boolean;          // true = only for new/greenfield ventures
  minEducation?: string;              // e.g. '8th Pass', 'Degree/Diploma'
}

export const schemesDatabase: SchemeProfile[] = [

  // ─────────────────────────── CENTRAL SCHEMES ───────────────────────────

  {
    id: 'mudra-shishu',
    name: 'PM MUDRA Yojana – Shishu (₹0–₹50,000)',
    level: 'Central',
    maxLoan: 50000,
    subsidyPercentage: 'No direct subsidy — collateral-free refinance at bank rates',
    collateralFree: true,
    eligibility: [
      'Any Indian citizen (18+ years)',
      'Non-farm micro-enterprise (new or early-stage)',
      'No minimum education required',
    ],
    documents: ['Aadhaar', 'PAN / Voter ID', 'Quotations for Machinery / Equipment'],
    officialUrl: 'https://www.mudra.org.in',
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],   // MUDRA explicitly excludes farm loans
    minAge: 18,
    newBusinessOnly: false,
  },

  {
    id: 'mudra-kishore',
    name: 'PM MUDRA Yojana – Kishore (₹50,001–₹5,00,000)',
    level: 'Central',
    maxLoan: 500000,
    minLoan: 50001,
    subsidyPercentage: 'No direct subsidy — collateral-free at competitive bank rates',
    collateralFree: true,
    eligibility: [
      'Any Indian citizen (18+ years)',
      'Existing micro-enterprise expanding operations',
      'Good repayment track record preferred',
    ],
    documents: ['Aadhaar', 'PAN', 'Project Report', 'Bank Statement (6 months)'],
    officialUrl: 'https://www.mudra.org.in',
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],
    minAge: 18,
  },

  {
    id: 'mudra-tarun',
    name: 'PM MUDRA Yojana – Tarun (₹5,00,001–₹10,00,000)',
    level: 'Central',
    maxLoan: 1000000,
    minLoan: 500001,
    subsidyPercentage: 'No direct subsidy — collateral-free at bank rates',
    collateralFree: true,
    eligibility: [
      'Established business requiring major upgrade',
      'Clean credit history / CIBIL score required',
    ],
    documents: ['ITR for 2 years', 'Audited Balance Sheet', 'Project Report'],
    officialUrl: 'https://www.mudra.org.in',
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],
    minAge: 18,
    requiresExistingBusiness: true,
  },

  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    level: 'Central',
    maxLoan: 300000,
    subsidyPercentage: '2% interest subvention on loans up to ₹3 Lakhs',
    collateralFree: true,
    eligibility: [
      'Farmers (owner-cultivators, tenant farmers, share croppers)',
      'Allied activities: Animal Husbandry, Fisheries, Dairy',
      'No minimum loan for crop cultivation needs',
    ],
    documents: ['Land Holding / Khasra Documents', 'Aadhaar', 'PAN', 'Passport photo'],
    officialUrl: 'https://pmkisan.gov.in/',
    allowedSectors: ['Agriculture', 'Dairy', 'Fisheries'],
    excludedSectors: [],
    minAge: 18,
  },

  {
    id: 'pmegp',
    name: 'PM Employment Generation Programme (PMEGP)',
    level: 'Central',
    maxLoan: 5000000,
    subsidyPercentage: '15–35% capital subsidy (higher for SC/ST/Women/Rural)',
    collateralFree: false,
    eligibility: [
      'Any individual above 18 years',
      'Min. 8th Pass for Manufacturing projects above ₹10L or Service above ₹5L',
      'New/Greenfield projects only (no existing businesses)',
      'Household income below ₹3L/year (BPL priority)',
    ],
    documents: ['Aadhaar', 'Caste Certificate (if applicable)', 'Rural Area Certificate', 'EDP Training Certificate', 'Project Report'],
    officialUrl: 'https://www.kviconline.gov.in/pmegpeportal',
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],
    minAge: 18,
    newBusinessOnly: true,
    minEducation: '8th Pass (for large projects)',
  },

  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Yojana',
    level: 'Central',
    maxLoan: 300000,
    subsidyPercentage: '5% concessional interest rate; ₹15,000 toolkit grant',
    collateralFree: true,
    eligibility: [
      'Traditional artisans in 18 designated trades ONLY',
      'Trades: Blacksmith, Goldsmith, Potter, Carpenter, Weaver, Tailor, Cobbler, Sculptor, Barber, Washer-man, Toy Maker, Basket/Mat Maker, Fishing Net Maker, Hammer & Tool Kit Maker, Mason, Boat Maker, Armourer, Lock Maker',
      'Age 18+ years',
      'Should not have availed PMEGP / PM MUDRA in last 5 years',
    ],
    documents: ['Aadhaar', 'Bank Account', 'Trade / Artisan Self-Declaration'],
    officialUrl: 'https://pmvishwakarma.gov.in',
    allowedSectors: ['Handicrafts', 'Tailoring', 'Construction', 'Beauty'],
    excludedSectors: ['Agriculture', 'Retail', 'IT', 'Transport'],
    minAge: 18,
  },

  {
    id: 'stand-up-india',
    name: 'Stand-Up India',
    level: 'Central',
    maxLoan: 10000000,
    minLoan: 1000000,
    subsidyPercentage: 'Composite loan — 85% of project cost funded',
    collateralFree: false,
    eligibility: [
      'SC/ST and/or Women entrepreneurs ONLY',
      'Greenfield (first-time) enterprise only',
      'Manufacturing, Services, or Trading sector',
    ],
    documents: ['Identity Proof', 'Caste Certificate', 'Incorporation Certificate', 'Project Report', 'Lease Deed'],
    officialUrl: 'https://www.standupmitra.in',
    allowedSectors: ['Manufacturing', 'Retail', 'Food', 'IT', 'Electronics', 'Beauty'],
    excludedSectors: ['Agriculture'],
    genderRestriction: 'Women/SC/ST',
    minAge: 18,
    newBusinessOnly: true,
  },

  {
    id: 'nrlm-shg',
    name: 'DAY-NRLM (Self-Help Group Bank Linkage)',
    level: 'Central',
    maxLoan: 600000,
    subsidyPercentage: '7% interest rate cap; additional 3% subvention for prompt repayment',
    collateralFree: true,
    eligibility: [
      'Rural Women organized in Self-Help Groups (SHGs)',
      'Existing SHG with at least 6 months of operations',
      'Covers all non-farm livelihood activities',
    ],
    documents: ['SHG Registration Certificate', 'Bank passbook', 'Aadhaar of all members', 'Meeting Minutes'],
    officialUrl: 'https://aajeevika.gov.in',
    allowedSectors: ['Any'],
    excludedSectors: [],
    genderRestriction: 'Women',
    minAge: 18,
  },

  // ─────────────────────────── TAMIL NADU STATE SCHEMES ───────────────────────────

  {
    id: 'tn-needs',
    name: 'NEEDS – New Entrepreneur cum Enterprise Development Scheme (TN)',
    level: 'State',
    state: 'Tamil Nadu',
    maxLoan: 50000000,
    subsidyPercentage: '25% capital subsidy up to ₹75 Lakhs; 3% interest subvention',
    collateralFree: false,
    eligibility: [
      'First generation entrepreneur in Tamil Nadu',
      'Degree / Diploma / ITI / Vocational Training certificate mandatory',
      'Age 21–45 years',
      'New manufacturing or service enterprise only',
    ],
    documents: ['Educational Certificate', 'Project Report', 'Quotations', 'TN Domicile Proof'],
    officialUrl: 'https://www.msmeonline.tn.gov.in',
    allowedSectors: ['Manufacturing', 'Food', 'Electronics', 'IT', 'Beauty', 'Handicrafts'],
    excludedSectors: ['Agriculture'],
    minAge: 21,
    maxAge: 45,
    newBusinessOnly: true,
    minEducation: 'Degree/Diploma/ITI',
  },

  {
    id: 'tn-uyegp',
    name: 'UYEGP – Unemployed Youth Employment Generation Programme (TN)',
    level: 'State',
    state: 'Tamil Nadu',
    maxLoan: 1500000,
    subsidyPercentage: '25% subsidy (up to ₹2.5 Lakhs for general; higher for SC/ST/Women)',
    collateralFree: true,
    eligibility: [
      'Tamil Nadu resident (minimum 5 years)',
      '8th Standard Pass minimum',
      'Age 18–35 (up to 45 for special categories: SC/ST/Women/Differently-abled)',
      'For new micro/small enterprises',
    ],
    documents: ['Aadhaar', 'School Certificate (8th Pass)', 'Residence Proof', 'Quotations'],
    officialUrl: 'https://www.msmeonline.tn.gov.in',
    allowedSectors: ['Any'],
    excludedSectors: [],
    minAge: 18,
    maxAge: 45,
    newBusinessOnly: true,
    minEducation: '8th Pass',
  },

  {
    id: 'tn-iddp',
    name: 'IDDP – Industrial Development & Dispersal Programme (TN)',
    level: 'State',
    state: 'Tamil Nadu',
    maxLoan: 10000000,
    subsidyPercentage: '20% capital subsidy for backward district enterprises',
    collateralFree: false,
    eligibility: [
      'Manufacturing units in backward / industrially underdeveloped districts of TN',
      'Minimum fixed capital investment of ₹25 Lakhs',
    ],
    documents: ['Project Report', 'Land Documents', 'TN Domicile', 'DIC Approval'],
    officialUrl: 'https://www.msmeonline.tn.gov.in',
    allowedSectors: ['Manufacturing', 'Food', 'Handicrafts'],
    excludedSectors: ['Agriculture', 'Retail', 'IT'],
    minAge: 21,
  },

  // ─────────────────────────── UTTAR PRADESH ───────────────────────────

  {
    id: 'up-odop',
    name: 'ODOP – One District One Product (Uttar Pradesh)',
    level: 'State',
    state: 'Uttar Pradesh',
    maxLoan: 5000000,
    subsidyPercentage: '25% margin money subsidy on project cost',
    collateralFree: false,
    eligibility: [
      'UP domicile (15 years residence)',
      'Business must belong to the identified ODOP product for that specific district',
      'Examples: Agra=Leather, Varanasi=Silk, Moradabad=Brassware, Lucknow=Chikankari',
    ],
    documents: ['Domicile Certificate', 'Project Report', 'Bank Consent Letter', 'ODOP Category Proof'],
    officialUrl: 'https://odopup.in',
    allowedSectors: ['Handicrafts', 'Manufacturing', 'Retail'],
    excludedSectors: ['Agriculture', 'IT'],
    minAge: 18,
  },

  {
    id: 'up-mukhyamantri-swarozgar',
    name: 'Mukhyamantri Yuva Swarozgar Yojana (UP)',
    level: 'State',
    state: 'Uttar Pradesh',
    maxLoan: 2500000,
    subsidyPercentage: '25% margin money (up to ₹6.25 Lakhs)',
    collateralFree: false,
    eligibility: [
      'UP resident, Age 18–40 years',
      'Unemployed youth — 8th Pass minimum',
      'New enterprise only; family income below ₹2L/year',
    ],
    documents: ['Aadhaar', 'Income Certificate', 'Educational Certificate', 'Domicile', 'Project Report'],
    officialUrl: 'https://diupmsme.upsdc.gov.in',
    allowedSectors: ['Any'],
    excludedSectors: [],
    minAge: 18,
    maxAge: 40,
    newBusinessOnly: true,
  },

  // ─────────────────────────── MAHARASHTRA ───────────────────────────

  {
    id: 'mh-cmegp',
    name: 'CMEGP – Chief Minister Employment Generation Programme (Maharashtra)',
    level: 'State',
    state: 'Maharashtra',
    maxLoan: 5000000,
    subsidyPercentage: '15–35% based on category and rural/urban location',
    collateralFree: false,
    eligibility: [
      'Maharashtra resident (15 years)',
      'Age 18–45 years',
      '7th Standard Pass minimum',
      'New enterprise only',
    ],
    documents: ['Domicile Certificate', 'Aadhaar', 'Project Report', 'Category Certificate'],
    officialUrl: 'https://maha-cmegp.gov.in',
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],
    minAge: 18,
    maxAge: 45,
    newBusinessOnly: true,
  },

  // ─────────────────────────── KARNATAKA ───────────────────────────

  {
    id: 'ka-cmegp',
    name: 'CMEGP – Chief Minister Employment Generation Programme (Karnataka)',
    level: 'State',
    state: 'Karnataka',
    maxLoan: 5000000,
    subsidyPercentage: '25–35% subsidy; higher for SC/ST/Women',
    collateralFree: false,
    eligibility: [
      'Karnataka resident',
      'Age 18–45 years',
      'ITI / Skill Training Certificate preferred',
      'New enterprise only',
    ],
    documents: ['Aadhaar', 'Caste/Income Certificate', 'Skill Certificate', 'Project Report'],
    officialUrl: 'https://kum.karnataka.gov.in',
    allowedSectors: ['Any'],
    excludedSectors: ['Agriculture'],
    minAge: 18,
    maxAge: 45,
    newBusinessOnly: true,
  },

  // ─────────────────────────── RAJASTHAN ───────────────────────────

  {
    id: 'rj-rips',
    name: 'RIPS – Rajasthan Investment Promotion Scheme',
    level: 'State',
    state: 'Rajasthan',
    maxLoan: 10000000,
    subsidyPercentage: 'Up to 30% capital subsidy for MSMEs in designated sectors',
    collateralFree: false,
    eligibility: [
      'Rajasthan domicile',
      'Manufacturing or Agro-processing enterprise',
      'Minimum investment of ₹5 Lakhs',
    ],
    documents: ['Domicile Certificate', 'Project Report', 'Factory License', 'Land Documents'],
    officialUrl: 'https://invest.rajasthan.gov.in',
    allowedSectors: ['Manufacturing', 'Food', 'Agriculture', 'Dairy'],
    excludedSectors: ['IT', 'Retail'],
    minAge: 18,
  },

  // ─────────────────────────── GUJARAT ───────────────────────────

  {
    id: 'gj-pmegp-state',
    name: 'iKhedut – Gujarat Agriculture Portal Loan Scheme',
    level: 'State',
    state: 'Gujarat',
    maxLoan: 1000000,
    subsidyPercentage: '25–50% subsidy for farm mechanization and allied activities',
    collateralFree: true,
    eligibility: [
      'Gujarat farmer or agricultural entrepreneur',
      'Allied activities: Dairy, Horticulture, Fisheries also covered',
    ],
    documents: ['7/12 Land Extract', 'Aadhaar', 'Bank Passbook', 'Caste Certificate (if applicable)'],
    officialUrl: 'https://ikhedut.gujarat.gov.in',
    allowedSectors: ['Agriculture', 'Dairy', 'Fisheries'],
    excludedSectors: [],
    minAge: 18,
  },

  // ─────────────────────────── ANDHRA PRADESH ───────────────────────────

  {
    id: 'ap-ysrbc',
    name: 'YSR BC Corporations Loan Scheme (Andhra Pradesh)',
    level: 'State',
    state: 'Andhra Pradesh',
    maxLoan: 1000000,
    subsidyPercentage: '0% interest loan for SC/ST/BC/Minority communities',
    collateralFree: true,
    eligibility: [
      'SC / ST / BC / Minority communities in Andhra Pradesh',
      'Annual family income below ₹1.5L for rural / ₹2L for urban',
      'For self-employment and micro-enterprise',
    ],
    documents: ['Caste Certificate', 'Income Certificate', 'Aadhaar', 'Bank Account'],
    officialUrl: 'https://bccorporations.ap.gov.in',
    allowedSectors: ['Any'],
    excludedSectors: [],
    minAge: 18,
    genderRestriction: undefined,
  },
];
