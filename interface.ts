export interface I_WeightLog {
  id: number;
  timestamp: number;
  weight: number;
}
export interface I_BMI {
  id: number;
  height: number;
  weight: number;
  age: number;
  gender: "Male" | "Female";
}
