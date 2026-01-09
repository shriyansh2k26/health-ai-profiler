

export const calculateRiskScore = (answers) => {
  let score = 0;
  let rationale = [];

  // 1. Smoking Factor (High Risk Weight)
  //
  if (answers.smoker === true) {
    score += 40;
    rationale.push("Active smoking habit");
  }

  // 2. Exercise Factor (Enum Weighting)
  
  const exerciseLevel = answers.exercise ?? "often"; 
  
  if (exerciseLevel === "rarely") {
    score += 25;
    rationale.push("Sedentary lifestyle (Rare exercise)");
  } else if (exerciseLevel === "sometimes") {
    score += 10;
    rationale.push("Irregular physical activity");
  }

  // 3. Diet Factor (Keyword matching)
 
  const dietInfo = answers.diet?.toLowerCase() ?? "";
  
  if (dietInfo.includes("high sugar") || dietInfo.includes("processed")) {
    score += 15;
    rationale.push("Poor diet (High sugar/processed intake)");
  } else if (dietInfo.includes("fast food") || dietInfo.includes("fried")) {
    score += 10;
    rationale.push("High consumption of saturated fats/sodium");
  }

  // 4. Age Factor (Demographic baseline)
  
  const age = answers.age ?? 0;
  if (age > 50) {
    score += 15;
    rationale.push("Age-related health baseline (50+)");
  } else if (age > 40) {
    score += 10;
    rationale.push("Age-related health baseline (40+)");
  }

  // --- Risk Classification Logic ---
  let risk_level = "low";
  if (score >= 70) {
    risk_level = "high";
  } else if (score >= 35) {
    risk_level = "medium";
  }

  // Cap the score at 100 for API consistency
  return {
    score: Math.min(score, 100),
    risk_level,
    rationale
  };
};