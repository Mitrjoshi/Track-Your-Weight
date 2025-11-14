import { COLORS } from "@/constants/theme";
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

export default function VerticalProgress({
  value,
  target,
  label,
}: {
  value: number;
  target: number;
  label?: string;
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
  const thresholdPercent = (MIN_FILL_HEIGHT / SCREEN_WIDTH) * 100;
  const isBelowThreshold = percentage <= thresholdPercent;

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const threshold = MIN_FILL_HEIGHT / SCREEN_WIDTH;

    const targetHeight = SCREEN_WIDTH * p;

    // If progress is below threshold, keep height at MIN_FILL_HEIGHT
    if (p <= threshold) {
      return { height: 42 };
    }

    // After threshold, let it grow with progress
    return { height: targetHeight - 3.5 };
  });

  return (
    <>
      <ThemedText className="text-xs">
        {target}
        {label}
      </ThemedText>
      <View
        className="rounded-full overflow-hidden justify-end"
        style={{
          height: SCREEN_WIDTH,
          borderWidth: 2,
          borderColor,
          width: BAR_WIDTH,
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: COLORS.customPrimary,
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
            <ThemedText className="text-xs font-semibold !text-black">
              {value >= target ? (
                <Check color={"black"} strokeWidth={2.5} />
              ) : (
                value
              )}
            </ThemedText>
          </View>
        </Animated.View>
      </View>
    </>
  );
}
