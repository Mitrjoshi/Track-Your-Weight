import { FoodCard } from "@/components/FoodCard";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedView } from "@/components/ui/ThemedView";
import { FOOD_ITEMS } from "@/constants/data";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const PLACEHOLDERS = ["Egg", "Milk", "Bread", "Chicken", "Paneer"];

export default function SearchFood() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Optional: only rotate when NOT focused
    if (isFocused) return;

    const intervalId = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2000); // change every 2 seconds

    return () => clearInterval(intervalId);
  }, [isFocused]);

  return (
    <ThemedView className="flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingTop: 0,
        }}
      >
        <ThemedInput
          className="h-[45px] flex-row items-center flex-1 w-full pl-4 rounded-[12px]"
          keyboardType="web-search"
          placeholder={`Search for ${PLACEHOLDERS[placeholderIndex]}...`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <View className="flex-col gap-2">
          {FOOD_ITEMS.map((item, index) => (
            <FoodCard item={item} key={index} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
