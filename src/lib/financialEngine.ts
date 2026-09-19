export function calculateFinancialBaseline(budgetStr: string) {
  const cleanedBudget = budgetStr.replace(/[^0-9]/g, '');
  const budget = cleanedBudget ? parseInt(cleanedBudget, 10) : 50000;

  // Simple heuristic baselines for rural businesses
  const initialInvestment = budget;
  
  // Rule of thumb: monthly expenses are roughly 20-30% of initial investment for micro-businesses
  const estimatedMonthlyExpenses = Math.round(initialInvestment * 0.25);
  
  // Rule of thumb: target 15-25% net profit margin. 
  // Let's assume a break-even around 6-12 months.
  // Revenue = Expenses + Profit
  // If break-even is 8 months, Profit needs to cover Investment / 8 eventually.
  
  const targetMonthlyProfit = Math.round(initialInvestment / 8); 
  const estimatedMonthlyRevenue = estimatedMonthlyExpenses + targetMonthlyProfit;

  return {
    budget,
    guidelines: `Ensure the total investment is around ${initialInvestment}. Monthly expenses should be roughly ${estimatedMonthlyExpenses}. Projected monthly revenue should be around ${estimatedMonthlyRevenue}, yielding a net profit of ${targetMonthlyProfit}. Break-even should ideally be between 6 to 12 months.`
  };
}
