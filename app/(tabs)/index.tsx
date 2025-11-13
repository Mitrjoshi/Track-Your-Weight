import GreetingSection from "@/components/shared/GreetingSection";
import WeekCalendar from "@/components/shared/WeekCalendar";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { Dimensions, Pressable, ScrollView } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function IndexScreen() {
  const secondaryText = useThemeColor({}, "secondaryText");

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

        {/* <Card>
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
                <Circle cx={center.x} cy={center.y} r="5" fill={"white"} />
              )}
            />

            <View className="absolute flex justify-center items-center">
              <ThemedText className="text-4xl font-semibold">1910</ThemedText>
              <ThemedText
                numberOfLines={2}
                style={{
                  color: secondaryText,
                }}
                className="text-center text-sm"
              >
                kcal left
              </ThemedText>
            </View>
          </View>
        </Card> */}

        <WeekCalendar />
      </ScrollView>

      <Link href={"/search"} asChild>
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
