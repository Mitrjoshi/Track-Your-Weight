import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ui/ThemedText";

interface ProgressBarProps {
  start: number; // 👈 start point
  weight: number; // current
  goal: number; // end point
  segments?: number; // number of segments, default 10
}

// Gradient helper: red → yellow → green
function getGradientColor(ratio: number) {
  let r, g;
  if (ratio < 0.5) {
    r = 255;
    g = Math.round(255 * (ratio / 0.5));
  } else {
    r = Math.round(255 * (1 - (ratio - 0.5) / 0.5));
    g = 255;
  }
  return `rgb(${r},${g},0)`;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function ProgressBar({
  start,
  weight,
  goal,
  segments = 10,
}: ProgressBarProps) {
  const secondaryText = useThemeColor({}, "secondaryText");

  const denom = goal - start;

  // If denom is 0 (or invalid), avoid NaN and just show 0 progress.
  const progress = denom === 0 ? 0 : clamp01((weight - start) / denom);

  const totalSegments = segments;
  const fullSegments = Math.floor(progress * totalSegments);
  const partialFill = progress * totalSegments - fullSegments;

  return (
    <View style={{ gap: 8 }}>
      {/* Labels: start, current, goal */}
      <View style={styles.labelRow}>
        {weight >= goal ? (
          <View className="flex-col w-full justify-center items-center">
            <ThemedText
              style={{
                fontSize: 16,
              }}
              className="font-xl font-semibold !text-green-500"
            >
              Congratulations! 🎉🎉
            </ThemedText>
            <ThemedText
              className="text-sm text-center"
              style={{
                color: secondaryText,
              }}
            >
              You have reached your goal. Add a new goal to continue to improve.
            </ThemedText>
          </View>
        ) : (
          <>
            <ThemedText className="text-sm font-bold !text-red-500">
              {start} kg
            </ThemedText>
            <ThemedText
              style={{
                color: getGradientColor(
                  clamp01((weight - start) / (goal - start))
                ),
              }}
              className="font-bold text-xl"
            >
              {weight} kg
            </ThemedText>
            <ThemedText className="text-sm font-bold !text-green-500">
              {goal} kg
            </ThemedText>
          </>
        )}
      </View>

      {weight < goal && (
        <>
          <View style={styles.container}>
            {[...Array(totalSegments)].map((_, index) => {
              let fillPercent = 0;
              if (index < fullSegments) fillPercent = 1;
              else if (index === fullSegments) fillPercent = partialFill;

              const colorRatio = (index + fillPercent) / totalSegments;

              return (
                <View
                  key={index}
                  style={[
                    styles.segment,
                    index !== totalSegments - 1 && styles.gap,
                  ]}
                >
                  <View
                    style={{
                      flex: fillPercent,
                      backgroundColor:
                        fillPercent > 0
                          ? getGradientColor(colorRatio)
                          : "transparent",
                      borderRadius: 5,
                    }}
                  />
                  <View style={{ flex: 1 - fillPercent }} />
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  segment: {
    flex: 1,
    height: 10,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  gap: {
    marginRight: 4,
  },
});
