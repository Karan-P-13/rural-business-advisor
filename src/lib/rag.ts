import schemes from './knowledge/schemes.json';
import marketContext from './knowledge/marketContext.json';

export interface UserInput {
  location: string;
  budget: string;
  skills: string;
  interest: string;
}

export function getRelevantSchemes(budgetStr: string, interest: string) {
  // Simple heuristic for demo:
  // Clean budget string to number
  const cleanedBudget = budgetStr.replace(/[^0-9]/g, '');
  const budget = cleanedBudget ? parseInt(cleanedBudget, 10) : 50000;

  const relevantSchemes = [];
  
  const interestLower = interest.toLowerCase();

  // Rules based on budget and interest
  if (budget <= 50000) {
    relevantSchemes.push(schemes.find(s => s.id === 'mudra_shishu'));
  } else if (budget > 50000 && budget <= 500000) {
    relevantSchemes.push(schemes.find(s => s.id === 'mudra_kishore'));
  }

  if (budget >= 500000) {
    relevantSchemes.push(schemes.find(s => s.id === 'pmegp'));
  }

  if (
    interestLower.includes('tailor') || 
    interestLower.includes('carpenter') || 
    interestLower.includes('artisan') ||
    interestLower.includes('craft')
  ) {
    relevantSchemes.push(schemes.find(s => s.id === 'pm_vishwakarma'));
  }

  if (budget >= 1000000) {
     relevantSchemes.push(schemes.find(s => s.id === 'standup_india'));
  }

  // Deduplicate and filter out undefined
  return Array.from(new Set(relevantSchemes.filter(Boolean)));
}

export function getMarketContext(location: string, interest: string) {
  const locLower = location.toLowerCase();
  const interestLower = interest.toLowerCase();

  if (interestLower.includes('farm') || interestLower.includes('agri') || interestLower.includes('dairy') || locLower.includes('village')) {
    return marketContext['rural_agricultural'];
  } else if (interestLower.includes('craft') || interestLower.includes('art') || interestLower.includes('cloth')) {
    return marketContext['artisan_cluster'];
  } else {
    return marketContext['semi_urban_tier3'];
  }
}

export function retrieveRAGContext(userInput: UserInput) {
  const schemes = getRelevantSchemes(userInput.budget, userInput.interest);
  const market = getMarketContext(userInput.location, userInput.interest);

  return {
    schemes,
    marketContext: market
  };
}
