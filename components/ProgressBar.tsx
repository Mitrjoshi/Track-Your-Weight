import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ui/ThemedText";

interface ProgressBarProps {
  value: number;
  goal: number;
  segments?: number; // number of segments, default 10
  label?: string;
  start_point?: number;
  segment_height?: number;
  gradient?: boolean;
  color?: string;
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

export default function ProgressBar({
  value,
  goal,
  segments = 10,
  label = "kg",
  start_point,
  segment_height = 10,
  gradient = true,
  color = COLORS.customPrimary,
}: ProgressBarProps) {
  const progress = Math.min(value / goal, 1);
  const totalSegments = segments;
  const fullSegments = Math.floor(progress * totalSegments);
  const partialFill = progress * totalSegments - fullSegments;

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.labelRow}>
        <ThemedText>
          {start_point ?? value} {label}
        </ThemedText>
        <ThemedText>
          {goal} {label}
        </ThemedText>
      </View>

      <View style={styles.container}>
        {[...Array(totalSegments)].map((_, index) => {
          let fillPercent = 0;
          if (index < fullSegments) fillPercent = 1;
          else if (index === fullSegments) fillPercent = partialFill;

          return (
            <View
              key={index}
              style={[
                styles.segment,
                index !== totalSegments - 1 && styles.gap,
                {
                  height: segment_height,
                },
              ]}
            >
              <View
                style={{
                  flex: fillPercent,
                  backgroundColor:
                    fillPercent > 0
                      ? gradient
                        ? getGradientColor(
                            (index + fillPercent) / totalSegments
                          )
                        : color
                      : "transparent",
                  borderRadius: 5,
                }}
              />
              <View style={{ flex: 1 - fillPercent }} />
            </View>
          );
        })}
      </View>
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
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  gap: {
    marginRight: 4,
  },
});
