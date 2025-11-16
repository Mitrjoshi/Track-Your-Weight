import Card from "@/components/shared/Card";
import VerticalProgress from "@/components/shared/VerticalProgress";
import WeekCalendar from "@/components/shared/WeekCalendar";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function IndexScreen() {
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
        <WeekCalendar />

        <Card>
          <ThemedText className="text-2xl font-bold">Macros</ThemedText>

          <View className="flex flex-row justify-between items-center">
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress label={"kcal"} value={0} target={2300} />
              <ThemedText className="text-xs font-semibold">
                Calories
              </ThemedText>
            </View>
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress label={"g"} value={0} target={180} />
              <ThemedText className="text-xs font-semibold">Protein</ThemedText>
            </View>
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress label={"g"} value={0} target={30} />
              <ThemedText className="text-xs font-semibold">Fats</ThemedText>
            </View>
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress label={"g"} value={0} target={1600} />
              <ThemedText className="text-xs font-semibold">Carbs</ThemedText>
            </View>
          </View>
        </Card>

        <Card></Card>
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
