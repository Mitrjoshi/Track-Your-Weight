import { BMIGauge } from "@/components/BMIGauge";
import Card from "@/components/Card";
import HistoryItem from "@/components/HistoryItem";
import LineChart from "@/components/LineChart";
import NoData from "@/components/NoData";
import ProgressBar from "@/components/ProgressBar";
import SmallButton from "@/components/SmallButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { useRealtimeWeightLog } from "@/hooks/tinybase/useRealtimeWeightLog";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function IndexScreen() {
  const borderColor = useThemeColor({}, "input");
  const backgroundColor = useThemeColor({}, "background");
  const secondaryText = useThemeColor({}, "secondaryText");

  const {
    weightLog,
    weightDifference,
    historyLog,
    latestBMIValue,
    latestGoal,
    goalLeft,

    overallAverageWeight,
    weeklyAverageWeight,
    monthlyAverageWeight,
  } = useRealtimeWeightLog();

  return (
    <ThemedView className="flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingBottom: 90,
        }}
      >
        <Card>
          <ThemedText className="text-2xl font-bold">Growth</ThemedText>

          <View className="flex-row justify-around items-center">
            <View className="flex justify-center items-center">
              {weeklyAverageWeight ? (
                <View className="flex-row items-center gap-2">
                  <ThemedText
                    className={`font-bold text-lg ${
                      weeklyAverageWeight < 0
                        ? "!text-red-500"
                        : "!text-green-500"
                    }`}
                  >
                    {weeklyAverageWeight ? `${weeklyAverageWeight} kg` : "N/A"}
                  </ThemedText>
                  <Feather
                    name={
                      weeklyAverageWeight > 0 ? "trending-up" : "trending-down"
                    }
                    size={18}
                    className={
                      weeklyAverageWeight < 0
                        ? "!text-red-500"
                        : "!text-green-500"
                    }
                  />
                </View>
              ) : (
                <ThemedText>N/A</ThemedText>
              )}
              <ThemedText className="font-medium text-sm">Weekly</ThemedText>
            </View>

            <View className="flex justify-center items-center">
              {monthlyAverageWeight ? (
                <View className="flex-row items-center gap-2">
                  <ThemedText
                    className={`font-bold text-lg ${
                      monthlyAverageWeight < 0
                        ? "!text-red-500"
                        : "!text-green-500"
                    }`}
                  >
                    {monthlyAverageWeight
                      ? `${monthlyAverageWeight} kg`
                      : "N/A"}
                  </ThemedText>
                  <Feather
                    name={
                      monthlyAverageWeight > 0 ? "trending-up" : "trending-down"
                    }
                    size={18}
                    className={
                      monthlyAverageWeight < 0
                        ? "!text-red-500"
                        : "!text-green-500"
                    }
                  />
                </View>
              ) : (
                <ThemedText>N/A</ThemedText>
              )}
              <ThemedText className="font-medium text-sm">Monthly</ThemedText>
            </View>

            <View className="flex justify-center items-center">
              {overallAverageWeight ? (
                <View className="flex-row items-center gap-2">
                  <ThemedText
                    className={`font-bold text-lg ${
                      overallAverageWeight < 0
                        ? "!text-red-500"
                        : "!text-green-500"
                    }`}
                  >
                    {overallAverageWeight
                      ? `${overallAverageWeight} kg`
                      : "N/A"}
                  </ThemedText>
                  <Feather
                    name={
                      overallAverageWeight > 0 ? "trending-up" : "trending-down"
                    }
                    size={18}
                    className={
                      overallAverageWeight < 0
                        ? "!text-red-500"
                        : "!text-green-500"
                    }
                  />
                </View>
              ) : (
                <ThemedText>N/A</ThemedText>
              )}
              <ThemedText className="font-medium text-sm">Overall</ThemedText>
            </View>
          </View>
        </Card>

        <Card>
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
                href="/add"
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
                    labels: weightLog.map((log) => String(log.created_at)),
                    datasets: [
                      {
                        data: weightLog.map((log) => log.weight),
                      },
                    ],
                  }}
                />
              </View>
            ) : (
              <NoData />
            )}
          </View>
        </Card>

        <Card>
          <View className="w-full flex-row items-center justify-between">
            <ThemedText className="text-2xl font-bold">Progress</ThemedText>

            <SmallButton route="/goal" text="Add Goal" />
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
                <ProgressBar
                  start={historyLog[historyLog.length - 1].weight}
                  // weight={75.3}
                  weight={historyLog[0].weight}
                  goal={latestGoal}
                />
              </View>
            ) : (
              <NoData />
            )}
          </View>
        </Card>

        <Card>
          <View className="w-full flex-row items-center justify-between">
            <ThemedText className="text-2xl font-bold">BMI</ThemedText>

            <SmallButton route="/bmi" text="Calculate" />
          </View>

          <View
            style={{
              borderRadius: 12,
            }}
          >
            {latestBMIValue ? <BMIGauge bmi={latestBMIValue} /> : <NoData />}
          </View>
        </Card>

        <Card>
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
                {historyLog.map((log, index) => (
                  <HistoryItem
                    historyLog={historyLog}
                    index={index}
                    log={log}
                    key={index}
                  />
                ))}
              </View>
            ) : (
              <NoData />
            )}
          </View>
        </Card>
      </ScrollView>

      <Link href={"/add"} asChild>
        <Pressable
          style={{
            backgroundColor: COLORS.customPrimary,
          }}
          className="absolute bottom-6 right-6 h-16 w-16 rounded-full flex justify-center items-center"
        >
          <Plus color="white" strokeWidth={2} size={32} />
        </Pressable>
      </Link>
    </ThemedView>
  );
}
