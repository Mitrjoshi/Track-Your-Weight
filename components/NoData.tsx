import React from "react";
import { View } from "react-native";
import { ThemedText } from "./ui/ThemedText";

export default function NoData() {
  return (
    <View className="p-5 flex justify-center items-center gap-2">
      <ThemedText className="font-semibold">No data available</ThemedText>
    </View>
  );
}
