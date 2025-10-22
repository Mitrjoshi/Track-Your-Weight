import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { useRealtimeWeightLog } from "@/hooks/tinybase/useRealtimeWeightLog";
import { useThemeColor } from "@/hooks/useThemeColor";
import { store } from "@/lib/tinybase";
import { router, Stack } from "expo-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Single number item (memoized)
const NumberItem = memo(
  ({
    num,
    index,
    itemHeight,
    scrollY,
  }: {
    num: number;
    index: number;
    itemHeight: number;
    scrollY: SharedValue<number>;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const distance = Math.abs(scrollY.value - index * itemHeight);
      const scale = interpolate(
        distance,
        [0, itemHeight],
        [1.2, 0.8],
        Extrapolate.CLAMP
      );
      const opacity = interpolate(
        distance,
        [0, itemHeight],
        [1, 0.3],
        Extrapolate.CLAMP
      );
      const color = interpolateColor(
        distance,
        [0, itemHeight / 2, itemHeight],
        [COLORS.customPrimary, COLORS.customPrimary, "#9ca3af"]
      );

      return { transform: [{ scale }], opacity, color };
    });

    return (
      <Animated.Text
        style={[
          styles.numberText,
          {
            height: itemHeight,
            lineHeight: itemHeight,
            fontSize: itemHeight * 0.9,
          },
          animatedStyle,
        ]}
      >
        {num}
      </Animated.Text>
    );
  }
);

NumberItem.displayName = "NumberItem";

export default function GoalPage() {
  const { width } = useWindowDimensions();
  const ITEM_HEIGHT = Math.round(width * 0.4);
  const VISIBLE_COUNT = 50;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
  const PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

  const textColor = useThemeColor({}, "text");

  const { latestGoal } = useRealtimeWeightLog();

  const numbers = useMemo(
    () => Array.from({ length: 120 }, (_, i) => i + 1),
    []
  );
  const scrollY = useSharedValue(0);
  const [selected, setSelected] = useState(75);

  const scrollRef = useRef<Animated.ScrollView>(null);

  // Scroll to default selected on mount
  useEffect(() => {
    const index = numbers.indexOf(75);
    if (index !== -1 && scrollRef.current) {
      scrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
      scrollY.value = index * ITEM_HEIGHT;
    }
  }, [ITEM_HEIGHT, numbers, scrollY]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      const value = numbers[index] ?? numbers[numbers.length - 1];
      runOnJS(setSelected)(value);
    },
  });

  useEffect(() => {
    if (latestGoal == null) return;

    const index = numbers.indexOf(latestGoal);
    if (index === -1) return;

    // Wait for scrollRef to be ready
    const id = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          y: index * ITEM_HEIGHT,
          animated: true,
        });
        scrollY.value = index * ITEM_HEIGHT;
      }
    });

    return () => cancelAnimationFrame(id);
  }, [latestGoal, ITEM_HEIGHT, numbers]);

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => {
                store.addRow("goal_log", {
                  id: new Date().getTime(),
                  value: selected,
                });

                router.back();
              }}
            >
              <ThemedText
                style={{
                  color: COLORS.customPrimary,
                }}
                className="font-bold"
              >
                Add Goal
              </ThemedText>
            </Pressable>
          ),
        }}
      />

      <View
        style={[
          styles.pickerContainer,
          { height: CONTAINER_HEIGHT, width: "100%" },
        ]}
      >
        <Animated.ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={ITEM_HEIGHT}
          contentContainerStyle={{
            paddingTop: PADDING,
            paddingBottom: PADDING,
          }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {numbers.map((num, index) => (
            <NumberItem
              key={num}
              num={num}
              index={index}
              itemHeight={ITEM_HEIGHT}
              scrollY={scrollY}
            />
          ))}
        </Animated.ScrollView>

        <View
          pointerEvents="none"
          style={[
            {
              top: "50%",
              position: "absolute",
              height: 5,
              backgroundColor: textColor,
              marginTop: -2.5,
            },
            { left: 0, width: "10%" },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            {
              top: "50%",
              position: "absolute",
              height: 5,
              backgroundColor: textColor,
              marginTop: -2.5,
            },
            { right: 0, width: "10%" },
          ]}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pickerContainer: { overflow: "hidden" },
  numberText: { fontWeight: "700", textAlign: "center" },
});
