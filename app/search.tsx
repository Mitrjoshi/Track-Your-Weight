import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ScanBarcode } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const PLACEHOLDERS = ["Egg", "Milk", "Bread", "Chicken", "Paneer"];

export default function SearchFood() {
  const icon = useThemeColor({}, "icon");
  const input = useThemeColor({}, "input");

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
          paddingBottom: 90,
        }}
      >
        <View className="flex-1 w-full flex-row items-center gap-2">
          <ThemedInput
            className="h-[45px] flex-row items-center flex-1 w-full pl-4 rounded-[12px]"
            keyboardType="web-search"
            placeholder={`Search for ${PLACEHOLDERS[placeholderIndex]}...`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
