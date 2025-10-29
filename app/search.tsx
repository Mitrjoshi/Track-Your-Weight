import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedView } from "@/components/ui/ThemedView";
import React from "react";
import { ScrollView, View } from "react-native";

export default function SearchFood() {
  return (
    <ThemedView className="flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingBottom: 90,
        }}
      >
        <View className="flex-1 w-full">
          <ThemedInput
            className="h-[45px] flex-row items-center flex-1 w-full pl-4 rounded-[12px]"
            keyboardType="web-search"
            placeholder="Search food items..."
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
