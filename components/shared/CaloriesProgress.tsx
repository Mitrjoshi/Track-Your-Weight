import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View } from "react-native";

export default function CaloriesProgress({
  protein,
  carbs,
  fat,
  goalProtein,
  goalCarbs,
  goalFat,
}: {
  protein: number;
  carbs: number;
  fat: number;

  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
}) {
  const borderColor = useThemeColor({}, "input");

  // ---- 1. GOAL SPLIT (SECTION WIDTHS) ----
  const proteinGoalCal = goalProtein * 4;
  const carbsGoalCal = goalCarbs * 4;
  const fatGoalCal = goalFat * 9;

  const totalGoalCal = proteinGoalCal + carbsGoalCal + fatGoalCal || 1;

  const proteinSection = (proteinGoalCal / totalGoalCal) * 100;
  const carbsSection = (carbsGoalCal / totalGoalCal) * 100;
  const fatSection = (fatGoalCal / totalGoalCal) * 100;

  // ---- 2. PROGRESS FILL INSIDE EACH SECTION ----
  const proteinFill = Math.min((protein / goalProtein) * 100, 100);
  const carbsFill = Math.min((carbs / goalCarbs) * 100, 100);
  const fatFill = Math.min((fat / goalFat) * 100, 100);

  return (
    <View
      style={{ backgroundColor: borderColor }}
      className="w-full h-[40px] flex-row rounded-full overflow-hidden gap-2"
    >
      <View
        className="flex justify-center items-center"
        style={{
          backgroundColor: Colors.base.green,
          height: "100%",
          width: `${proteinFill - 1}%`,
          maxWidth: `${proteinSection - 1}%`,
          borderRadius: 99,
        }}
      ></View>
      <View
        className="flex justify-center items-center"
        style={{
          backgroundColor: Colors.base.blue,
          height: "100%",
          width: `${carbsFill - 1}%`,
          maxWidth: `${carbsSection - 1}%`,
          borderRadius: 99,
        }}
      ></View>
      <View
        className="flex justify-center items-center"
        style={{
          backgroundColor: Colors.base.yellow,
          height: "100%",
          width: `${fatFill - 1}%`,
          maxWidth: `${fatSection - 1}%`,
          borderRadius: 99,
        }}
      ></View>
    </View>
  );
}
