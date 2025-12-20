// Gold weight conversion utilities
// Based on traditional gold measurement units

// Conversion constants
const GRAMS_PER_VORI = 11.664;
const ANA_PER_VORI = 16;
const ROTI_PER_ANA = 6;
const POINT_PER_ROTI = 10;

// Derived constants
const ROTI_PER_VORI = ANA_PER_VORI * ROTI_PER_ANA; // 96
const POINT_PER_VORI = ROTI_PER_VORI * POINT_PER_ROTI; // 960
const POINT_PER_ANA = ROTI_PER_ANA * POINT_PER_ROTI; // 60

export interface TraditionalUnits {
  vori: number;
  ana: number;
  roti: number;
  point: number;
}

/**
 * Convert traditional gold units to grams
 */
export function traditionalToGrams(units: TraditionalUnits): number {
  const { vori, ana, roti, point } = units;

  // Convert everything to vori first, then to grams
  const totalVori =
    vori +
    ana / ANA_PER_VORI +
    roti / ROTI_PER_VORI +
    point / POINT_PER_VORI;

  const grams = totalVori * GRAMS_PER_VORI;

  // Round to 4 decimal places for precision
  return Math.round(grams * 10000) / 10000;
}

/**
 * Convert grams to traditional gold units
 */
export function gramsToTraditional(grams: number): TraditionalUnits {
  // Convert grams to total points for easier calculation
  const totalPoints = (grams / GRAMS_PER_VORI) * POINT_PER_VORI;

  // Calculate each unit
  const vori = Math.floor(totalPoints / POINT_PER_VORI);
  const remainingAfterVori = totalPoints - vori * POINT_PER_VORI;

  const ana = Math.floor(remainingAfterVori / POINT_PER_ANA);
  const remainingAfterAna = remainingAfterVori - ana * POINT_PER_ANA;

  const roti = Math.floor(remainingAfterAna / POINT_PER_ROTI);
  const point = Math.round(remainingAfterAna - roti * POINT_PER_ROTI);

  return {
    vori,
    ana,
    roti,
    point,
  };
}

/**
 * Validate traditional units input
 */
export function validateTraditionalUnits(units: TraditionalUnits): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (units.vori < 0) errors.push("Vori cannot be negative");
  if (units.ana < 0 || units.ana > 15)
    errors.push("Ana must be between 0 and 15");
  if (units.roti < 0 || units.roti > 5)
    errors.push("Roti must be between 0 and 5");
  if (units.point < 0 || units.point > 9)
    errors.push("Point must be between 0 and 9");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate grams input
 */
export function validateGrams(grams: number): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (grams < 0) errors.push("Weight cannot be negative");
  if (isNaN(grams)) errors.push("Please enter a valid number");

  return {
    isValid: errors.length === 0,
    errors,
  };
}
