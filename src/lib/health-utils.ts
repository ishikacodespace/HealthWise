'use client';
import { BpStatus, BmiStatus, TempStatus } from '@/lib/definitions';

export const getBpStatus = (bp: string): BpStatus => {
  const parts = bp.split('/');
  if (parts.length !== 2) return 'Invalid';
  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);

  if (isNaN(systolic) || isNaN(diastolic)) return 'Invalid';

  if (systolic >= 180 || diastolic >= 120) return 'Hypertensive Crisis';
  if (systolic >= 140 || diastolic >= 90) return 'High';
  if (systolic >= 120 && diastolic < 80) return 'Elevated';
  if (systolic < 120 && diastolic < 80) return 'Normal';
  
  return 'High'; // Default case for other high values
};

export const getTempStatus = (temp: number): TempStatus => {
  if (temp > 99.5) return 'High';
  if (temp < 97.5) return 'Low';
  return 'Normal';
};

export const getBmiStatus = (bmi: number): BmiStatus => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateBmi = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) return 0;
  // Formula: BMI = kg / m^2
  // Assuming height is in cm and weight is in kg
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(1));
};

export const getHealthScore = (bpStatus: BpStatus, bmiStatus: BmiStatus, heartRate: number): number => {
    let score = 100;

    // BMI score
    if (bmiStatus === 'Underweight' || bmiStatus === 'Overweight') score -= 15;
    else if (bmiStatus === 'Obese') score -= 30;

    // BP score
    if (bpStatus === 'Elevated') score -= 10;
    else if (bpStatus === 'High') score -= 25;
    else if (bpStatus === 'Hypertensive Crisis') score -= 40;

    // Heart Rate score
    if (heartRate > 100 || heartRate < 60) score -= 10;

    return Math.max(0, score);
}

export const wellnessQuotes = [
    "The greatest wealth is health.",
    "A healthy outside starts from the inside.",
    "Take care of your body. It's the only place you have to live.",
    "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    "He who has health has hope; and he who has hope, has everything."
];
