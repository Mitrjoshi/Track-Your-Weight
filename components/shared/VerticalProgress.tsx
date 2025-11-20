import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Check } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../ui/ThemedText";

const SCREEN_WIDTH = Dimensions.get("window").width / 1.5;
const BAR_WIDTH = 45; // width of the bar
const INNER_PADDING = 4; // p-[4px]
const MIN_FILL_HEIGHT = BAR_WIDTH + INNER_PADDING * 2; // enough to fully show the circle
const ACTUAL_HEIGHT = SCREEN_WIDTH / 1.7;

export default function VerticalProgress({
  value,
  target,
  label,
  bgColor,
}: {
  value: number;
  target: number;
  label?: string;
  bgColor?: string;
}) {
  const borderColor = useThemeColor({}, "input");

  // clamp value between 0–100%
  const percentage = Math.max(0, Math.min(100, (value / target) * 100));

  // progress as 0–1
  const progress = useSharedValue(percentage / 100);

  useEffect(() => {
    const next = percentage / 100;

    progress.value = withTiming(next, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage, progress]);

  // threshold where the circle starts "progressing" upwards
  const thresholdPercent = (MIN_FILL_HEIGHT / ACTUAL_HEIGHT) * 100;
  const isBelowThreshold = percentage <= thresholdPercent;

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const threshold = MIN_FILL_HEIGHT / ACTUAL_HEIGHT;

    const targetHeight = ACTUAL_HEIGHT * p;

    // If progress is below threshold, keep height at MIN_FILL_HEIGHT
    if (p <= threshold) {
      return { height: BAR_WIDTH - 3.5 };
    }

    // After threshold, let it grow with progress
    return { height: targetHeight - 3.5 };
  });

  return (
    <>
      <View
        className="rounded-full overflow-hidden justify-end"
        style={{
          height: ACTUAL_HEIGHT,
          borderWidth: 1,
          backgroundColor: borderColor,
          width: BAR_WIDTH,
          borderColor: "transparent",
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: bgColor ?? Colors.base.blue,
              borderTopLeftRadius: 100,
              borderTopRightRadius: 100,
            },
            animatedStyle,
          ]}
          className={`flex items-center p-[4px] ${
            isBelowThreshold ? "justify-end" : "justify-start"
          }`}
        >
          <View className="w-full aspect-square flex justify-center items-center bg-white rounded-full">
            <ThemedText className="text-[10px] font-bold !text-black">
              {value >= target ? (
                <Check color={"black"} strokeWidth={2.5} />
              ) : (
                `${label === "%" ? `${percentage.toFixed(0)}%` : value}`
              )}
            </ThemedText>
          </View>
        </Animated.View>
      </View>
    </>
  );
}
