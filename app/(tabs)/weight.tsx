import { BMIGauge } from "@/components/BMIGauge";
import HistoryItem from "@/components/HistoryItem";
import LineChart from "@/components/LineChart";
import NoData from "@/components/NoData";
import ProgressBar from "@/components/ProgressBar";
import Card from "@/components/shared/Card";
import GreetingSection from "@/components/shared/GreetingSection";
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

    // Averages
    dailyAverageWeight,
    weeklyAverageWeight,
    monthlyAverageWeight,
  } = useRealtimeWeightLog();

  const ARRAY = [
    {
      label: "Daily",
      value: dailyAverageWeight,
    },
    {
      label: "Weekly",
      value: weeklyAverageWeight,
    },
    {
      label: "Monthly",
      value: monthlyAverageWeight,
    },
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingBottom: 90,
          paddingTop: 0,
        }}
      >
        <GreetingSection />

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

        {weightLog && weightLog.length > 0 && (
          <>
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
                      value={historyLog[0].weight}
                      goal={latestGoal}
                      segments={10}
                    />
                  </View>
                ) : (
                  <NoData />
                )}
              </View>
            </Card>

            <Card>
              <ThemedText className="text-2xl font-bold">Average</ThemedText>

              <View className="flex flex-row justify-around items-center">
                {ARRAY.map((item, index) => (
                  <View
                    key={index}
                    className="flex justify-center flex-1 items-center"
                  >
                    <ThemedText className="text-sm font-semibold">
                      {item.label}
                    </ThemedText>
                    <View className="flex flex-row items-center gap-2">
                      <ThemedText
                        className={`font-bold ${
                          item.value
                            ? item.value > 0
                              ? "!text-green-500"
                              : "!text-red-500"
                            : "!text-yellow-500"
                        }`}
                      >
                        {item.value ? `${item.value} kg` : "N/A"}
                      </ThemedText>
                      {item.value && (
                        <Feather
                          name={"trending-down"}
                          size={18}
                          className={`${
                            item.value
                              ? item.value > 0
                                ? "!text-green-500"
                                : "!text-red-500"
                              : "!text-yellow-500"
                          }`}
                        />
                      )}
                    </View>
                  </View>
                ))}
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
                {latestBMIValue ? (
                  <BMIGauge bmi={latestBMIValue} />
                ) : (
                  <NoData />
                )}
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
          </>
        )}
      </ScrollView>

      <Link href={"/add"} asChild>
        <Pressable
          style={{
            backgroundColor: COLORS.customPrimary,
          }}
          className="absolute bottom-6 right-6 h-16 aspect-square flex-row px-4 rounded-full flex justify-center items-center gap-2"
        >
          <Plus color="white" strokeWidth={2} size={32} />
        </Pressable>
      </Link>
    </ThemedView>
  );
}
