import { useRealtimeWeightLog } from "@/hooks/tinybase/useRealtimeWeightLog";
import { useThemeColor } from "@/hooks/useThemeColor";
import { greetingBasedOnTime } from "@/utils/formatDates";
import React from "react";
import { View } from "react-native";
import { ThemedText } from "../ui/ThemedText";

export default function GreetingSection() {
  const secondaryText = useThemeColor({}, "secondaryText");
  const { weightLog } = useRealtimeWeightLog();

  const hasEnoughLogs = weightLog && weightLog.length >= 2;

  const dailyWeightDifference = hasEnoughLogs
    ? weightLog[weightLog.length - 1].weight -
      weightLog[weightLog.length - 2].weight
    : null;

  const hasValidDiff =
    typeof dailyWeightDifference === "number" &&
    !Number.isNaN(dailyWeightDifference);

  return (
    <View>
      <ThemedText className="text-xl font-semibold">
        {greetingBasedOnTime()}
      </ThemedText>

      {hasValidDiff && (
        <ThemedText
          style={{
            color: secondaryText,
          }}
        >
          {dailyWeightDifference! > 0
            ? `You've gained ${dailyWeightDifference!.toFixed(
                2
              )} kgs since your last log.`
            : dailyWeightDifference! < 0
            ? `You've lost ${Math.abs(dailyWeightDifference!).toFixed(
                2
              )} kgs since your last log.`
            : "No change in weight since your last log."}
        </ThemedText>
      )}
    </View>
  );
}
