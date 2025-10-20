import { BMIGauge } from "@/components/BMIGauge";
import LineChart from "@/components/LineChart";
import ProgressBar from "@/components/ProgressBar";
import { ThemedLoadingButton } from "@/components/ui/ThemedLoadingButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useRealtimeWeightLog } from "@/hooks/tinybase/useRealtimeWeightLog";
import { useThemeColor } from "@/hooks/useThemeColor";
import { I_WeightLog } from "@/interface";
import { formatDate } from "@/utils/formatDates";
import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

export default function IndexScreen() {
  const cardColor = useThemeColor({}, "menu");
  const borderColor = useThemeColor({}, "input");
  const secondaryText = useThemeColor({}, "secondaryText");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const {
    weightLog,
    weightDifference,
    historyLog,
    latestBMIValue,
    latestGoal,
    goalLeft,
  } = useRealtimeWeightLog();

  const handleWeightColor = (weightLog: I_WeightLog, log: I_WeightLog) => {
    return weightLog
      ? weightLog.weight < log.weight
        ? "!text-green-500"
        : weightLog.weight === log.weight
        ? "!text-yellow-500"
        : "!text-red-500"
      : "!text-yellow-500";
  };

  return (
    <ThemedView className="p-4 flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 12,
        }}
      >
        <View
          className="rounded-xl p-4 gap-4"
          style={{
            backgroundColor: cardColor,
          }}
        >
          <View className="w-full flex-row items-center justify-between">
            <View>
              <ThemedText className="text-2xl font-bold">Weight</ThemedText>
              {goalLeft && (
                <ThemedText
                  style={{
                    color: secondaryText,
                  }}
                  className="text-sm font-medium"
                >
                  {goalLeft?.toFixed(1)} kgs left to reach your goal.
                </ThemedText>
              )}
            </View>

            {weightDifference ? (
              <View
                style={{
                  backgroundColor,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor,
                }}
                className="flex items-center flex-row gap-3"
              >
                <Feather
                  name={weightDifference > 0 ? "trending-up" : "trending-down"}
                  size={18}
                  className={
                    weightDifference < 0 ? "!text-red-500" : "!text-green-500"
                  }
                />

                <ThemedText
                  className={`font-bold text-sm ${
                    weightDifference < 0 ? "!text-red-500" : "!text-green-500"
                  }`}
                >
                  {weightDifference} kg
                </ThemedText>
              </View>
            ) : (
              <Link
                style={{
                  backgroundColor,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor,
                }}
                href="/(tabs)/add"
              >
                <ThemedText className="font-semibold">Add</ThemedText>
              </Link>
            )}
          </View>

          <View>
            {weightLog && weightLog.length > 0 ? (
              <View
                style={{
                  paddingTop: 28,
                  borderRadius: 12,
                  backgroundColor: backgroundColor,
                  overflow: "hidden",
                }}
              >
                <LineChart
                  data={{
                    labels: weightLog.map((log) => String(log.id)),
                    datasets: [
                      {
                        data: weightLog.map((log) => log.weight),
                      },
                    ],
                  }}
                />
              </View>
            ) : (
              <View className="p-5 flex justify-center items-center">
                <ThemedText className="font-semibold">
                  No data available.
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View
          className="rounded-xl p-4 gap-4"
          style={{
            backgroundColor: cardColor,
          }}
        >
          <View className="w-full flex-row items-center justify-between">
            <ThemedText className="text-2xl font-bold">Progress</ThemedText>

            <Link
              style={{
                backgroundColor,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor,
              }}
              href="/goal"
            >
              <ThemedText className="font-semibold">Add Goal</ThemedText>
            </Link>
          </View>

          <View
            style={{
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {latestGoal ? (
              <View
                className="p-4"
                style={{
                  borderRadius: 12,
                  backgroundColor: backgroundColor,
                  overflow: "hidden",
                }}
              >
                <ProgressBar weight={historyLog[0].weight} goal={latestGoal} />
              </View>
            ) : (
              <View className="p-5 flex justify-center items-center">
                <ThemedText className="font-semibold">
                  No data available.
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View
          className="rounded-xl p-4 gap-4"
          style={{
            backgroundColor: cardColor,
          }}
        >
          <View className="w-full flex-row items-center justify-between">
            <ThemedText className="text-2xl font-bold">BMI</ThemedText>

            <Link
              style={{
                backgroundColor,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor,
              }}
              href="/bmi"
            >
              <ThemedText className="font-semibold">Calculate</ThemedText>
            </Link>
          </View>

          <View
            style={{
              borderRadius: 12,
            }}
          >
            {latestBMIValue ? (
              <BMIGauge bmi={latestBMIValue} />
            ) : (
              <View className="p-5 flex justify-center items-center gap-2">
                <ThemedText className="font-semibold">
                  No data available.
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View
          className="rounded-xl p-4 gap-4"
          style={{
            backgroundColor: cardColor,
          }}
        >
          <View className="w-full flex-row items-center justify-between">
            <ThemedText className="text-2xl font-bold">History</ThemedText>
          </View>

          <View
            style={{
              borderRadius: 12,
            }}
          >
            {historyLog && historyLog.length > 0 ? (
              <View className="flex flex-col gap-2">
                {historyLog.slice(0, 5).map((log, index) => (
                  <View
                    style={{
                      backgroundColor,
                    }}
                    key={index}
                    className="p-2 gap-2 flex-row items-center justify-start rounded-lg"
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
                          className={handleWeightColor(
                            historyLog[index + 1],
                            log
                          )}
                        />
                      </View>
                    </View>

                    <View className="flex-1 w-full">
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
                          {formatDate(new Date(log.id))}
                        </ThemedText>
                      </View>
                      <View>
                        <ThemedText
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            color: secondaryText,
                          }}
                          className={`${handleWeightColor(
                            historyLog[index + 1],
                            log
                          )}`}
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
                  </View>
                ))}

                {historyLog.length > 5 && (
                  <ThemedLoadingButton
                    isLoading={false}
                    onPress={() => {
                      router.navigate("/(tabs)/details");
                    }}
                    text="See all"
                  />
                )}
              </View>
            ) : (
              <View className="p-5 flex justify-center items-center gap-2">
                <ThemedText className="font-semibold">
                  No data available
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
