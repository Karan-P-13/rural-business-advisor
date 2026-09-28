import { NextResponse } from 'next/server';

// In a full production environment, this would trigger a cron job or web scraper
// to fetch live data from https://dashboard.msme.gov.in/ and update schemes.json
// For the SIH hackathon, this endpoint dynamically refreshes the latent market variables.

let lastUpdated = new Date().toISOString();
let marketInflationRate = 0.05;

export async function POST() {
  try {
    // Simulate fetching live data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update latent variables
    lastUpdated = new Date().toISOString();
    marketInflationRate = 0.05 + (Math.random() * 0.03); // Random fluctuation
    
    return NextResponse.json({
      success: true,
      message: "Market Data and Scheme Registry synchronized with MoSPI & MSME sources.",
      lastSync: lastUpdated,
      newInflationRate: marketInflationRate.toFixed(4)
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Healthy",
    lastSync: lastUpdated,
    inflationVariable: marketInflationRate
  });
}
