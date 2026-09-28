import schemes from './knowledge/schemes.json';

export function getRelevantSchemes(budgetStr: string, interest: string, location: string) {
  const budget = parseInt(budgetStr.replace(/[^0-9]/g, ''), 10) || 0;
  
  // Normalize location for matching
  const locUpper = location.toUpperCase();
  
  // Filter schemes based on Region (National + State Match)
  const matchedSchemes = schemes.filter(s => {
    const isNational = s.region === "National";
    const isStateMatch = locUpper.includes(s.region.toUpperCase());
    return isNational || isStateMatch;
  });

  // Filter based on budget
  const finalSchemes = matchedSchemes.filter(s => {
    if (s.id.includes('shishu') && budget > 50000) return false;
    return true;
  });

  return finalSchemes.slice(0, 4); // Return top 4 matched schemes
}

export function buildContext(userInput: any) {
  const matchedSchemes = getRelevantSchemes(userInput.budget, userInput.interest, userInput.location);
  
  return {
    schemes: matchedSchemes,
    marketData: "Local market data indicates strong demand for consumer staples and micro-services. Target break-even within 6-12 months.",
  };
}
