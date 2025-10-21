export interface I_WeightLog {
  created_at: string;
  timestamp: number;
  weight: number;
  id: string;
}
export interface I_BMI {
  id: string;
  created_at: string;
  height: number;
  weight: number;
  age: number;
  gender: "Male" | "Female";
}
