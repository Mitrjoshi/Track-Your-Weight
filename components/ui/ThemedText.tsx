import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
  inverted?: boolean;
  color?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  className,
  inverted = false,
  color,
  ...rest
}: ThemedTextProps) {
  const actualColor = useThemeColor(
    inverted
      ? { light: darkColor, dark: lightColor } // 🔁 invert logic
      : { light: lightColor, dark: darkColor },
    color ?? "text"
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
