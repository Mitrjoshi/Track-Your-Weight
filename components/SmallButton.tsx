import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import React from "react";
import { ThemedText } from "./ui/ThemedText";

export default function SmallButton({
  text,
  route,
}: {
  text: string;
  route: string;
}) {
  const borderColor = useThemeColor({}, "input");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Link
      style={{
        backgroundColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor,
      }}
      href={route as any}
    >
      <ThemedText className="font-semibold">{text}</ThemedText>
    </Link>
  );
}
