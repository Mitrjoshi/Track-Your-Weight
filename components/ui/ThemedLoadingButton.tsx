import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { ActivityIndicator, Pressable, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedLoadingButtonProps = {
  isLoading: boolean;
  onPress: () => void;
  style?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
  text: string;
};

export function ThemedLoadingButton({
  isLoading,
  onPress,
  style,
  lightColor,
  darkColor,
  text,
}: ThemedLoadingButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "button"
  );

  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={`h-[45px] flex-row justify-center items-center rounded-md disabled:opacity-50`}
      style={[
        style,
        {
          backgroundColor,
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size={24} color={textColor} />
      ) : (
        <ThemedText
          style={{
            color: textColor,
          }}
          className="font-semibold"
        >
          {text}
        </ThemedText>
      )}
    </Pressable>
  );
}
