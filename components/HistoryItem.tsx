import { useThemeColor } from "@/hooks/useThemeColor";
import { I_WeightLog } from "@/interface";
import { deleteTables, store } from "@/lib/tinybase";
import { formatDate } from "@/utils/formatDates";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ui/ThemedText";

export default function HistoryItem({
  historyLog,
  log,
  index,
}: {
  historyLog: I_WeightLog[];
  log: I_WeightLog;
  index: number;
}) {
  const borderColor = useThemeColor({}, "input");
  const secondaryText = useThemeColor({}, "secondaryText");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handleWeightColor = (weightLog: I_WeightLog, log: I_WeightLog) => {
    return weightLog
      ? weightLog.weight < log.weight
        ? "!text-green-500"
        : weightLog.weight === log.weight
        ? "!text-yellow-500"
        : "!text-red-500"
      : "!text-yellow-500";
  };

  // Accordion state
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
    progress.value = withTiming(open ? 0 : 1, { duration: 250 });
  }, [open]);

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(progress.value, [0, 1], [0, 48]);
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    return {
      height,
      opacity,
    };
  });

  console.log(store.getTable("weight_log"));

  return (
    <View
      style={{
        backgroundColor,
      }}
      className="rounded-lg overflow-hidden"
    >
      {/* Header (pressable area) */}
      <Pressable
        onPress={toggle}
        className="p-2 flex-row items-center justify-start"
        style={{
          backgroundColor,
        }}
      >
        <View>
          <View
            className="w-12 h-12 flex justify-center items-center aspect-square rounded-md"
            style={{
              backgroundColor: borderColor,
            }}
          >
            <Feather
              name={
                historyLog[index + 1]
                  ? historyLog[index + 1].weight < log.weight
                    ? "trending-up"
                    : historyLog[index + 1].weight === log.weight
                    ? "minus"
                    : "trending-down"
                  : "minus"
              }
              size={26}
              className={handleWeightColor(historyLog[index + 1], log)}
            />
          </View>
        </View>

        <View className="flex-1 w-full ml-2">
          <View className="flex items-center flex-row justify-between w-full">
            <ThemedText
              style={{
                color: textColor,
              }}
              className={`text-xl font-bold`}
            >
              {log.weight} Kg
            </ThemedText>
            <ThemedText
              className="text-xs font-semibold"
              style={{
                color: secondaryText,
              }}
            >
              {formatDate(new Date(log.created_at))}
            </ThemedText>
          </View>
          <View>
            <ThemedText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: secondaryText,
              }}
              className={`${handleWeightColor(historyLog[index + 1], log)}`}
            >
              {!historyLog[index + 1] && "No change"}
              {historyLog[index + 1] &&
                historyLog[index + 1].weight < log.weight &&
                "Increased"}
              {historyLog[index + 1] &&
                historyLog[index + 1].weight > log.weight &&
                "Decreased"}
              {historyLog[index + 1] &&
                historyLog[index + 1].weight === log.weight &&
                "No change"}
            </ThemedText>
          </View>
        </View>
      </Pressable>

      {/* Accordion Content */}
      <Animated.View
        className="px-2"
        style={[
          animatedStyle,
          {
            overflow: "hidden",
          },
        ]}
      >
        <View className="flex-1 flex-row gap-2 justify-center items-start">
          <View className="w-full flex-1">
            <Pressable
              style={{
                height: 40,
                backgroundColor: borderColor,
              }}
              onPress={() => {
                router.navigate({
                  params: { id: log.id, value: log.weight },
                  pathname: "/add",
                });
              }}
              className="flex justify-center items-center rounded-lg"
            >
              <ThemedText
                style={{
                  color: textColor,
                }}
                className="font-semibold"
              >
                Edit
              </ThemedText>
            </Pressable>
          </View>
          <View className="w-full flex-1">
            <Pressable
              style={{
                height: 40,
                backgroundColor: borderColor,
              }}
              onPress={() => {
                store.delRow("weight_log", log.id);

                if (historyLog.length === 1) {
                  deleteTables();
                }
              }}
              className="flex justify-center items-center rounded-lg"
            >
              <ThemedText
                style={{
                  color: textColor,
                }}
                className="font-semibold"
              >
                Delete
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
