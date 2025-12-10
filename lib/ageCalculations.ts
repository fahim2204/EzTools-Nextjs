export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface NextBirthday {
  date: Date;
  daysUntil: number;
  hoursUntil: number;
  minutesUntil: number;
}

export interface LifeInsights {
  waterLiters: number;
  oxygenLiters: number;
  co2Liters: number;
  populationPercentage: number;
}

export function calculateAge(birthDate: Date): AgeResult {
  const now = new Date();
  const birth = new Date(birthDate);
  
  // Calculate total time
  const diffTime = Math.abs(now.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffTime / (1000 * 60));
  const totalSeconds = Math.floor(diffTime / 1000);
  
  // Calculate exact age
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
  };
}

export function calculateNextBirthday(birthDate: Date): NextBirthday {
  const now = new Date();
  const birth = new Date(birthDate);
  
  let nextBirthday = new Date(
    now.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );
  
  if (nextBirthday < now) {
    nextBirthday = new Date(
      now.getFullYear() + 1,
      birth.getMonth(),
      birth.getDate()
    );
  }
  
  const diffTime = nextBirthday.getTime() - now.getTime();
  const daysUntil = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hoursUntil = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesUntil = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    date: nextBirthday,
    daysUntil,
    hoursUntil,
    minutesUntil,
  };
}

export function calculateLifeInsights(totalDays: number): LifeInsights {
  // Average daily consumption estimates
  const waterPerDay = 2.5; // liters
  const oxygenPerDay = 550; // liters
  const co2PerDay = 200; // liters
  
  // World population (approximate)
  const worldPopulation = 8000000000;
  
  // Calculate age in years for population percentage
  const ageInYears = totalDays / 365.25;
  
  // Rough estimate: percentage of world population older than this age
  // Using a simplified model (actual demographics are more complex)
  const populationPercentage = Math.max(0, Math.min(100, 100 - (ageInYears / 100 * 1.2)));
  
  return {
    waterLiters: Math.round(totalDays * waterPerDay),
    oxygenLiters: Math.round(totalDays * oxygenPerDay),
    co2Liters: Math.round(totalDays * co2PerDay),
    populationPercentage: Math.round(populationPercentage * 10) / 10,
  };
}
