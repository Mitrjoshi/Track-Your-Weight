import { BMIGauge } from "@/components/BMIGauge";
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
  const cardColor = useThemeColor({}, "menu");
  const borderColor = useThemeColor({}, "input");
  const backgroundColor = useThemeColor({}, "background");
  const secondaryText = useThemeColor({}, "secondaryText");
  const textColor = useThemeColor({}, "text");

  const {
    weightLog,
    weightDifference,
    historyLog,
    latestBMIValue,
    latestGoal,
    goalLeft,
    latestBMILog,
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
              <NoData />
            )}
          </View>
        </View>

        {weightLog && weightLog.length > 0 && (
          <>
            <View
              className="rounded-xl p-4 gap-4"
              style={{
                backgroundColor: cardColor,
              }}
            >
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
                      weight={historyLog[0].weight}
                      goal={latestGoal}
                    />
                  </View>
                ) : (
                  <NoData />
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
            </View>
          </>
        )}
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
