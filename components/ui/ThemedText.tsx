import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
  inverted?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  className,
  inverted = false,
  ...rest
}: ThemedTextProps) {
  const actualColor = useThemeColor(
    inverted
      ? { light: darkColor, dark: lightColor } // 🔁 invert logic
      : { light: lightColor, dark: darkColor },
    "text"
  );

  return (
    <Text
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
      className={className}
      style={[{ color: actualColor }, style]}
      {...rest}
    />
  );
}
