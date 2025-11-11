import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ScanBarcode } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function SearchFood() {
  const icon = useThemeColor({}, "icon");
  const input = useThemeColor({}, "input");

  return (
    <ThemedView className="flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingBottom: 90,
        }}
      >
        <View className="flex-1 w-full flex-row items-center gap-4">
          <ThemedInput
            className="h-[45px] flex-row items-center flex-1 w-full pl-4 rounded-[12px]"
            keyboardType="web-search"
            placeholder="Search food items..."
          />

          <Pressable
            style={{
              backgroundColor: input,
            }}
            className="h-full aspect-square flex justify-center items-center rounded-[10px]"
          >
            <ScanBarcode color={icon} />
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
