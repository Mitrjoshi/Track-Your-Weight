import { FoodItem } from "@/interface/types";
import React from "react";
import { Pressable, View } from "react-native";
import Card from "./shared/Card";
import { ThemedText } from "./ui/ThemedText";

interface Props {
  item: FoodItem;
}

export const FoodCard: React.FC<Props> = ({ item }) => {
  const { nutrients, serving } = item;

  const nutrientList = [
    { label: "Protein", value: `${nutrients.protein ?? 0} g` },
    { label: "Carbs", value: `${nutrients.carbohydrates ?? 0} g` },
    { label: "Fat", value: `${nutrients.total_fat ?? 0} g` },
    { label: "Fiber", value: `${nutrients.dietary_fiber ?? 0} g` },
    { label: "Sodium", value: `${nutrients.sodium ?? 0} mg` },
    { label: "Iron", value: `${nutrients.iron ?? 0} mg` },
  ];

  return (
    <Pressable>
      <Card>
        {/* Title */}
        <ThemedText className="text-lg font-semibold mb-1">
          {item.name}
        </ThemedText>

        {/* Calories */}
        <ThemedText className="text-4xl font-bold mb-2">
          {nutrients.calories} kcal
        </ThemedText>

        {/* Serving */}
        <ThemedText className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Serving: {serving.metric.quantity}
          {serving.metric.unit}
        </ThemedText>

        {/* Nutrients Grid */}
        <View className="flex-row flex-wrap gap-3">
          {nutrientList.map((n, index) => (
            <View key={index} className="w-[30%] py-2">
              <ThemedText className="text-base font-bold">{n.value}</ThemedText>
              <ThemedText className="text-xs text-neutral-600 dark:text-neutral-400">
                {n.label}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        {item.ingredients && (
          <View className="mt-5">
            <ThemedText className="text-base font-semibold mb-1">
              Ingredients
            </ThemedText>
            <ThemedText className="text-sm text-neutral-700 dark:text-neutral-300">
              {item.ingredients}
            </ThemedText>
          </View>
        )}
      </Card>
    </Pressable>
  );
};
