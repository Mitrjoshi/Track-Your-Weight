import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ui/ThemedText";

interface I_Props {
  setActiveGroup: React.Dispatch<
    React.SetStateAction<"daily" | "weekly" | "monthly">
  >;
  activeGroup: "daily" | "weekly" | "monthly";
}

const TABS: ("daily" | "weekly" | "monthly")[] = ["daily", "weekly", "monthly"];

export default function ChartFilterButtonGroup({
  setActiveGroup,
  activeGroup,
}: I_Props) {
  const cardColor = useThemeColor({}, "menu");
  const backgroundColor = useThemeColor({}, "background");

  const translateX = useSharedValue(0);
  const tabWidth = useSharedValue(0);

  /** Measure container width to calculate tab width */
  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    tabWidth.value = width / TABS.length;
  };

  /** Animate when activeGroup changes */
  useEffect(() => {
    const index = TABS.indexOf(activeGroup);
    translateX.value = withTiming(index * tabWidth.value, {
      duration: 250,
    });
  }, [activeGroup]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      onLayout={onLayout}
      className="flex-row items-center p-1 h-[45px] relative"
      style={{
        backgroundColor,
        borderRadius: 16,
      }}
    >
      {/* Animated Active Background */}
      <Animated.View
        style={[
          {
            position: "absolute",
            height: "100%",
            width: "31.5%",
            backgroundColor: cardColor,
            borderRadius: 12,
            left: 4,
            right: 4,
          },
          animatedStyle,
        ]}
      />

      {/* Buttons */}
      <Pressable
        onPress={() => setActiveGroup("daily")}
        className="flex-1 justify-center items-center h-full"
      >
        <ThemedText className="font-semibold text-sm">Daily</ThemedText>
      </Pressable>

      <Pressable
        onPress={() => setActiveGroup("weekly")}
        className="flex-1 justify-center items-center h-full"
      >
        <ThemedText className="font-semibold text-sm">Weekly</ThemedText>
      </Pressable>

      <Pressable
        onPress={() => setActiveGroup("monthly")}
        className="flex-1 justify-center items-center h-full"
      >
        <ThemedText className="font-semibold text-sm">Monthly</ThemedText>
      </Pressable>
    </View>
  );
}
