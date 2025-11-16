import { useThemeColor } from "@/hooks/useThemeColor";
import { FoodItem } from "@/interface/types";
import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import Card from "./shared/Card";
import { ThemedText } from "./ui/ThemedText";

interface Props {
  item: FoodItem;
}

export const FoodCard: React.FC<Props> = ({ item }) => {
  const { nutrients, serving } = item;

  const secondaryText = useThemeColor({}, "secondaryText");
  const borderColor = useThemeColor({}, "input");
  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");

  const nutrientList = [
    { label: "Calories", value: `${nutrients.calories ?? 0} kcal` },
  ];

  return (
    <Pressable>
      <Card className="p-4 flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <ThemedText
            numberOfLines={1}
            ellipsizeMode="tail"
            className="font-semibold"
          >
            {item.name}
          </ThemedText>

          <View className="flex-row flex-wrap gap-2">
            <ThemedText
              style={{
                color: secondaryText,
              }}
              className="text-sm font-semibold"
            >
              Serving: {serving.metric.quantity}
              {serving.metric.unit}
            </ThemedText>
            {nutrientList.map((n, index) => (
              <View key={index} className="flex-row">
                <ThemedText
                  style={{
                    color: secondaryText,
                  }}
                  className="text-sm font-semibold"
                >
                  {n.label}:{" "}
                </ThemedText>
                <ThemedText
                  style={{
                    color: secondaryText,
                  }}
                  className="text-sm font-semibold"
                >
                  {n.value}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          style={{
            backgroundColor,
            borderRadius: 99,
            padding: 6,
            borderWidth: 1,
            borderColor,
          }}
        >
          <Plus color={iconColor} />
        </Pressable>
      </Card>
    </Pressable>
  );
};
