import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import React from "react";
import { ScrollView, View } from "react-native";

export default function IndexScreen() {
  return (
    <ThemedView className="flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingBottom: 90,
        }}
      >
        <View className="flex-1 justify-center items-center">
          <ThemedText className="font-semibold">No Entries Yet</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
