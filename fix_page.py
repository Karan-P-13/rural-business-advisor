import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Remove the "Generating your hyper-local..." message injection
content = content.replace("""    if (nextStep !== 'COMPLETED') {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'bot', text: botReply }]);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'bot', text: botReply }]);
      }, 500);""", """    if (nextStep !== 'COMPLETED') {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'bot', text: botReply }]);
      }, 500);
    } else {""")

# 2. Add fallback logic in the catch block
old_catch = """      } catch (e) {
        console.error(e);
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', text: t[language].error }]);
        setStep('INTEREST'); // Allow retry
      } finally {"""

new_catch = """      } catch (e) {
        console.error(e);
        // DEMO FALLBACK MODE
        const fallbackMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          isDashboard: true,
          text: "⚠️ Gemini API Error. Using Offline Demo Mode Data:",
          dashboardData: {
            plan: {
              title: newFormData.interest || "Organic Dairy Processing",
              summary: "A locally sourced, high-margin rural enterprise tailored to your skills.",
              targetMarket: "92",
              opportunities: ["Direct-to-consumer delivery", "High margin by-products"],
              risks: [{ risk: "Supply chain breakdown", mitigation: "Establish local backups." }],
            },
            financials: {
              totalProjectCost: parseInt(newFormData.budget.replace(/[^0-9]/g, '')) || 75000,
              userEquity: (parseInt(newFormData.budget.replace(/[^0-9]/g, '')) || 75000) * 0.1,
              netBankLoan: (parseInt(newFormData.budget.replace(/[^0-9]/g, '')) || 75000) * 0.9,
              monthlyEMI: 1450,
              monthlyRevenue: 35000,
              monthlyOperatingExpenses: 15000,
              dscr: 13.7,
              verdict: 'Highly Affordable',
              verdictDescription: '✅ Highly Affordable / Bank Approved - Low Default Risk',
              capexBreakdown: [{item: "Machinery", amount: 50000}, {item: "Setup", amount: 25000}],
              opexBreakdown: [{item: "Raw Materials", amount: 10000}, {item: "Labor", amount: 5000}]
            },
            schemes: [
              {
                name: "MUDRA Yojana (Shishu)",
                level: "Central",
                maxLoan: 50000,
                subsidyPercentage: "0%",
                collateralFree: true,
                eligibility: ["Micro enterprise", "No default history"],
                documents: ["Aadhaar", "Quotation of Machinery"],
                officialUrl: "https://www.mudra.org.in/"
              }
            ]
          }
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setStep('COMPLETED');
      } finally {"""

content = content.replace(old_catch, new_catch)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
