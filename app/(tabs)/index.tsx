import Card from "@/components/shared/Card";
import GreetingSection from "@/components/shared/GreetingSection";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Circle } from "react-native-svg";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function IndexScreen() {
  const [activeTab, setActiveTab] = useState(0);

  const ARRAY = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const secondaryText = useThemeColor({}, "secondaryText");
  const borderBackgroundColor = useThemeColor({}, "input");
  const avatarBackground = useThemeColor({}, "avatarBackground");

  return (
    <ThemedView className="flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingTop: 0,
          paddingBottom: 90,
        }}
      >
        <GreetingSection />

        <Card className="flex">
          <ThemedText className="text-2xl font-bold">Calories</ThemedText>
          <View className="relative flex justify-center items-center">
            <AnimatedCircularProgress
              fill={75}
              size={SCREEN_WIDTH / 2.2}
              width={15}
              rotation={0}
              lineCap="round"
              tintColor={COLORS.customPrimary}
              backgroundColor={secondaryText + "30"}
              renderCap={({ center }) => (
                <Circle cx={center.x} cy={center.y} r="6" fill={"white"} />
              )}
            />

            <View className="absolute flex justify-center items-center">
              <ThemedText className="text-4xl font-semibold">1910</ThemedText>
              <View>
                <ThemedText
                  numberOfLines={2}
                  style={{
                    color: secondaryText,
                  }}
                  className="text-center text-sm"
                >
                  Calories
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <ThemedText className="text-2xl font-bold">Macros</ThemedText>

          <View className="w-full flex flex-row items-center gap-4">
            <View className="flex-1 w-full flex gap-2">
              <ThemedText
                style={{
                  color: "#dbd3f6",
                }}
                className="font-semibold text-lg"
              >
                Protein
              </ThemedText>
              <View
                style={{ backgroundColor: borderBackgroundColor }}
                className="w-full h-2 rounded-full overflow-hidden"
              >
                <View
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "60%",
                    height: "100%",
                    backgroundColor: "#dbd3f6",
                  }}
                />
              </View>
              <View className="flex flex-row justify-between items-center">
                <ThemedText className="font-semibold">50g</ThemedText>
                <ThemedText
                  className="font-semibold"
                  style={{
                    color: secondaryText,
                  }}
                >
                  120g
                </ThemedText>
              </View>
            </View>
            <View className="flex-1 w-full flex gap-2">
              <ThemedText
                style={{
                  color: "#baecf0",
                }}
                className="font-semibold text-lg"
              >
                Carbs
              </ThemedText>
              <View
                style={{ backgroundColor: borderBackgroundColor }}
                className="w-full h-2 rounded-full overflow-hidden"
              >
                <View
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "60%",
                    height: "100%",
                    backgroundColor: "#baecf0",
                  }}
                />
              </View>
              <View className="flex flex-row justify-between items-center">
                <ThemedText className="font-semibold">60g</ThemedText>
                <ThemedText
                  className="font-semibold"
                  style={{
                    color: secondaryText,
                  }}
                >
                  100g
                </ThemedText>
              </View>
            </View>
            <View className="flex-1 w-full flex gap-2">
              <ThemedText
                style={{
                  color: "#fec773",
                }}
                className="font-semibold text-lg"
              >
                Fats
              </ThemedText>
              <View
                style={{ backgroundColor: borderBackgroundColor }}
                className="w-full h-2 rounded-full overflow-hidden"
              >
                <View
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "#fec773",
                  }}
                />
              </View>
              <View className="flex flex-row justify-between items-center">
                <ThemedText className="font-semibold">25g</ThemedText>
                <ThemedText
                  className="font-semibold"
                  style={{
                    color: secondaryText,
                  }}
                >
                  50g
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <Card className="flex p-0">
          <View className="flex p-2 justify-around items-center flex-row">
            {ARRAY.map((item, index) => (
              <Pressable
                onPress={() => {
                  setActiveTab(index);
                }}
                key={index}
                style={{
                  backgroundColor:
                    activeTab === index ? avatarBackground : undefined,
                }}
                className="w-full flex-1 flex justify-center py-3 rounded-[10px] items-center"
              >
                <ThemedText className="font-semibold text-lg">
                  {item}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Card>
      </ScrollView>

      <Link href={"/search"} asChild>
        <Pressable
          style={{
            backgroundColor: COLORS.customPrimary,
          }}
          className="absolute bottom-6 right-6 h-16 flex-row px-4 rounded-full flex justify-center items-center gap-2"
        >
          <Plus color="white" strokeWidth={2} size={32} />
          <ThemedText className="text-lg font-semibold">Add Meal</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}
