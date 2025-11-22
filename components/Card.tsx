import { useThemeColor } from "@/hooks/useThemeColor";
import React, { PropsWithChildren } from "react";
import { View } from "react-native";

export default function Card({ children }: PropsWithChildren) {
  const cardColor = useThemeColor({}, "menu");

  return (
    <View
      className="rounded-xl p-4 gap-4"
      style={{
        backgroundColor: cardColor,
      }}
    >
      {children}
    </View>
  );
}
