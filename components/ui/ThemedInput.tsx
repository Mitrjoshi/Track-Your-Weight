import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Eye, EyeOff, Search } from "lucide-react-native";
import React, { forwardRef, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
  className?: string;
};

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  (
    {
      style,
      lightColor,
      darkColor,
      textLightColor,
      textDarkColor,
      className,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "input"
    );
    const color = useThemeColor(
      { light: textLightColor, dark: textDarkColor },
      "text"
    );

    return (
      <View
        style={{
          backgroundColor,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: rest.keyboardType === "web-search" ? 12 : 0,
          paddingRight: rest.secureTextEntry ? 10 : 0,
        }}
        className={className}
      >
        {rest.keyboardType === "web-search" && (
          <>
            <Search
              color={COLORS.customTextSecondary}
              size={20}
              strokeWidth={2.5}
            />
          </>
        )}
        <TextInput
          className={`${className}`}
          ref={ref}
          placeholderTextColor={COLORS.customTextSecondary}
          cursorColor={COLORS.customPrimary}
          style={[{ backgroundColor, color, zIndex: 999 }, style]}
          {...rest}
          secureTextEntry={showPassword ? false : rest.secureTextEntry}
        />

        {rest.secureTextEntry && (
          <>
            <Pressable
              style={{
                zIndex: 9999,
              }}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye
                  color={COLORS.customTextSecondary}
                  size={20}
                  strokeWidth={2.5}
                />
              ) : (
                <EyeOff
                  color={COLORS.customTextSecondary}
                  size={20}
                  strokeWidth={2.5}
                />
              )}
            </Pressable>
          </>
        )}
      </View>
    );
  }
);

ThemedInput.displayName = "ThemedInput";
