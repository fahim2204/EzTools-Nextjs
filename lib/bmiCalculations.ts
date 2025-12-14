export type UnitSystem = "metric" | "imperial";

export interface BMIResult {
  bmi: number;
  classification: string;
  healthyWeightMin: number;
  healthyWeightMax: number;
}

export function calculateBMI(
  weight: number,
  height: number,
  system: UnitSystem
): BMIResult {
  let bmi = 0;
  let healthyWeightMin = 0;
  let healthyWeightMax = 0;

  if (system === "metric") {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
    
    // Reverse calculation for healthy weight (BMI 18.5 - 24.9)
    healthyWeightMin = 18.5 * (heightInMeters * heightInMeters);
    healthyWeightMax = 24.9 * (heightInMeters * heightInMeters);
  } else {
    // weight in lbs, height in inches
    bmi = (weight / (height * height)) * 703;

    // Reverse calculation for healthy weight (BMI 18.5 - 24.9)
    // weight = (BMI / 703) * height * height
    healthyWeightMin = (18.5 / 703) * (height * height);
    healthyWeightMax = (24.9 / 703) * (height * height);
  }

  return {
    bmi: Number(bmi.toFixed(1)),
    classification: getBMIClassification(bmi),
    healthyWeightMin: Number(healthyWeightMin.toFixed(1)),
    healthyWeightMax: Number(healthyWeightMax.toFixed(1)),
  };
}

export function getBMIClassification(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesity Class I";
  if (bmi < 40) return "Obesity Class II";
  return "Obesity Class III";
}
