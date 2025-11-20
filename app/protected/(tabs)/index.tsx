import CaloriesProgress from "@/components/shared/CaloriesProgress";
import Card from "@/components/shared/Card";
import VerticalProgress from "@/components/shared/VerticalProgress";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors, COLORS } from "@/constants/theme";
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
        <Card></Card>

        <Card>
          <View className="gap-1">
            <ThemedText>Calories left</ThemedText>
            <View className="flex-row gap-1 items-end">
              <ThemedText className="text-3xl font-semibold">1250</ThemedText>
              <ThemedText>kcal</ThemedText>
            </View>
          </View>

          <CaloriesProgress
            goalCarbs={360}
            goalFat={58}
            goalProtein={155}
            protein={5}
            carbs={25}
            fat={2}
          />
        </Card>

        <Card>
          <View className="flex flex-row justify-between items-center">
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress label={"kcal"} value={2300} target={2300} />
              <ThemedText className="text-xs font-semibold">Cal</ThemedText>
            </View>
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress
                bgColor={Colors.base.green}
                label={"g"}
                value={110}
                target={180}
              />
              <ThemedText className="text-xs font-semibold">Prot</ThemedText>
            </View>
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress
                bgColor={Colors.base.yellow}
                label={"g"}
                value={197}
                target={250}
              />
              <ThemedText className="text-xs font-semibold">Carb</ThemedText>
            </View>
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress label={"g"} value={32} target={36} />
              <ThemedText className="text-xs font-semibold">Fats</ThemedText>
            </View>
            <View className="flex gap-2 justify-center items-center flex-1">
              <VerticalProgress
                bgColor={Colors.base.green}
                label={"%"}
                value={79}
                target={100}
              />
              <ThemedText className="text-xs font-semibold">RDC</ThemedText>
            </View>
          </View>
        </Card>
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
