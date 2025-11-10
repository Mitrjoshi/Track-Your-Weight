import { useThemeColor } from "@/hooks/useThemeColor";
import React, { PropsWithChildren } from "react";
import { View } from "react-native";

interface I_Props {
  className?: string;
}

export default function Card({
  children,
  className,
}: PropsWithChildren<I_Props>) {
  const cardColor = useThemeColor({}, "menu");

  return (
    <View
      className={`rounded-xl p-4 gap-4 ${className}`}
      style={{
        backgroundColor: cardColor,
      }}
    >
      {children}
    </View>
  );
}
