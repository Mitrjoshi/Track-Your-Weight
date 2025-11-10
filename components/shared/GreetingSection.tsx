import { useRealtimeWeightLog } from "@/hooks/tinybase/useRealtimeWeightLog";
import { useThemeColor } from "@/hooks/useThemeColor";
import { greetingBasedOnTime } from "@/utils/formatDates";
import React from "react";
import { View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

export default function GreetingSection() {
  const secondaryText = useThemeColor({}, "secondaryText");
  const { weightDifference, weightLog } = useRealtimeWeightLog();

  const dailyWeightDifference = weightLog.length
    ? weightLog[weightLog.length - 1].weight -
      weightLog[weightLog.length - 2].weight
    : null;

  return (
    <View>
      <ThemedText className="text-xl font-semibold">
        {greetingBasedOnTime()}
      </ThemedText>
      {dailyWeightDifference && (
        <ThemedText
          style={{
            color: secondaryText,
          }}
        >
          {dailyWeightDifference > 0
            ? // avoid float numbers
              `You've gained ${dailyWeightDifference.toFixed(
                2
              )} kgs since your last log.`
            : `You've lost ${Math.abs(
                Number(dailyWeightDifference.toFixed(2))
              )} kgs since your last log.`}
        </ThemedText>
      )}
    </View>
  );
}
