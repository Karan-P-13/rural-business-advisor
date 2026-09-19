import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# 1. Update the fallback dashboard data to be translated
old_fallback_plan = """      dashboardData: {
        plan: {
          title: planTitle,
          summary: `A high-margin rural enterprise tailored perfectly to your stated skills in ${finalData.location}. It focuses on low overheads and serving immediate local demand.`,
          targetMarket: "92",
          opportunities: ["Direct-to-consumer delivery", "High margin by-products", "Local government grants"],
          risks: [{ risk: "Supply chain breakdown", mitigation: "Establish local backups." }],
        },"""

new_fallback_plan = """      dashboardData: {
        plan: {
          title: planTitle,
          summary: language === 'Hindi' ? 
            `${finalData.location} में आपके कौशल के लिए बिल्कुल उपयुक्त एक उच्च-मार्जिन वाला ग्रामीण उद्यम। यह स्थानीय मांग को पूरा करने पर केंद्रित है।` :
            language === 'Tamil' ?
            `${finalData.location}-ல் உங்கள் திறமைகளுக்கு ஏற்ற அதிக லாபம் தரும் தொழில். உள்ளூர் தேவைகளை பூர்த்தி செய்வதில் கவனம் செலுத்துகிறது.` :
            `A high-margin rural enterprise tailored perfectly to your stated skills in ${finalData.location}. It focuses on low overheads and serving immediate local demand.`,
          targetMarket: "92",
          opportunities: language === 'Hindi' ? ["सीधे ग्राहक तक डिलीवरी", "उच्च मार्जिन उप-उत्पाद", "सरकारी अनुदान"] : language === 'Tamil' ? ["நேரடி வாடிக்கையாளர் விநியோகம்", "அதிக லாபம் தரும் துணை தயாரிப்புகள்", "அரசு மானியங்கள்"] : ["Direct-to-consumer delivery", "High margin by-products", "Local government grants"],
          risks: [{ 
            risk: language === 'Hindi' ? "सप्लाई चेन टूटना" : language === 'Tamil' ? "பொருட்கள் வழங்கல் தடங்கல்" : "Supply chain breakdown", 
            mitigation: language === 'Hindi' ? "स्थानीय बैकअप स्थापित करें।" : language === 'Tamil' ? "உள்ளூர் காப்புப்பிரதிகளை உருவாக்கவும்." : "Establish local backups." 
          }],
        },"""

content = content.replace(old_fallback_plan, new_fallback_plan)

# 2. Pass language to BusinessDashboard
old_dash_render = """                      <BusinessDashboard 
                        businessPlan={(msg.dashboardData as any).plan}
                        financialData={(msg.dashboardData as any).financials}
                        schemes={(msg.dashboardData as any).schemes}
                      />"""

new_dash_render = """                      <BusinessDashboard 
                        businessPlan={(msg.dashboardData as any).plan}
                        financialData={(msg.dashboardData as any).financials}
                        schemes={(msg.dashboardData as any).schemes}
                        language={language}
                      />"""

content = content.replace(old_dash_render, new_dash_render)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
