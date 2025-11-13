import { useThemeColor } from "@/hooks/useThemeColor";
import React, { PropsWithChildren } from "react";
import { View } from "react-native";

interface I_Props {
  className?: string;
}

export default function Card({
  children,
  className = "p-4",
}: PropsWithChildren<I_Props>) {
  const cardColor = useThemeColor({}, "menu");

  return (
    <View
      className={`rounded-xl gap-4 ${className}`}
      style={{
        backgroundColor: cardColor,
      }}
    >
      {children}
    </View>
  );
}
