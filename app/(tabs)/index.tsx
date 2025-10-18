import LineChart from "@/components/LineChart";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useRealtimeWeightLog } from "@/hooks/tinybase/useRealtimeWeightLog";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/utils/formatDates";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

export default function IndexScreen() {
  const cardColor = useThemeColor({}, "menu");
  const borderColor = useThemeColor({}, "input");
  const secondaryText = useThemeColor({}, "secondaryText");
  const backgroundColor = useThemeColor({}, "background");

  const { weightLog, historyLog } = useRealtimeWeightLog();

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
            <ThemedText className="text-2xl font-bold">Weight</ThemedText>

            {/* <View
              style={{
                elevation: 5,
                backgroundColor: `${secondaryText}30`,
                borderRadius: 8,
                padding: 4,
                borderWidth: 1,
                borderColor,
              }}
              className="flex items-center flex-row gap-1"
            >
              <MaterialIcons
                name="show-chart"
                size={18}
                className="!text-green-500"
              />
              <ThemedText className="font-bold text-sm !text-green-500">
                0.5 kg
              </ThemedText>
            </View> */}

            <Link
              style={{
                elevation: 5,
                backgroundColor: `${secondaryText}30`,
                borderRadius: 8,
                padding: 4,
                borderWidth: 1,
                borderColor,
                paddingHorizontal: 12,
              }}
              href="/(tabs)/add"
            >
              <ThemedText className="font-semibold">Add</ThemedText>
            </Link>
          </View>

          <View
            style={{
              borderRadius: 12,
              // backgroundColor: backgroundColor,
              // elevation: 5,
              overflow: "hidden",
            }}
          >
            {weightLog && weightLog.length > 0 ? (
              <View
                style={{
                  paddingTop: 28,
                }}
              >
                <LineChart
                  data={{
                    labels: [],
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
                elevation: 5,
                backgroundColor: `${secondaryText}30`,
                borderRadius: 8,
                padding: 4,
                borderWidth: 1,
                borderColor,
                paddingHorizontal: 12,
              }}
              href="/(tabs)/add"
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
            <View className="p-5 flex justify-center items-center">
              <ThemedText className="font-semibold">
                No data available.
              </ThemedText>
            </View>
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
                elevation: 5,
                backgroundColor: `${secondaryText}30`,
                borderRadius: 8,
                padding: 4,
                borderWidth: 1,
                borderColor,
                paddingHorizontal: 12,
              }}
              href="/(tabs)/add"
            >
              <ThemedText className="font-semibold">Calculate</ThemedText>
            </Link>
          </View>

          <View
            style={{
              borderRadius: 12,
            }}
          >
            <View className="p-5 flex justify-center items-center gap-2">
              <ThemedText className="font-semibold">
                No data available.
              </ThemedText>
            </View>
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
                  <View
                    style={{
                      backgroundColor,
                    }}
                    key={index}
                    className="p-2 gap-2 flex-row items-center justify-start rounded-lg"
                  >
                    <View>
                      <View
                        className="w-12 h-12 flex justify-center items-center aspect-square rounded-lg"
                        style={{
                          backgroundColor: borderColor,
                        }}
                      >
                        <MaterialIcons
                          name="show-chart"
                          size={32}
                          className={
                            historyLog[index - 1] &&
                            historyLog[index - 1].weight < log.weight
                              ? "!text-green-500"
                              : "!text-red-500"
                          }
                        />
                      </View>
                    </View>

                    <View className="flex-1 w-full">
                      <View className="flex items-center flex-row justify-between w-full">
                        <ThemedText className="text-xl font-bold">
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
                      {log.description && (
                        <View>
                          <ThemedText
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              color: secondaryText,
                            }}
                          >
                            {log.description}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
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
