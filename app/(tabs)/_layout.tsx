import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import { Apple, Ruler } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const textColor = useThemeColor({}, "text");

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          paddingTop: 6,
          gap: 4,
          elevation: 0,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          paddingTop: 4,
        },
        tabBarInactiveTintColor: textColor,
        tabBarActiveTintColor: COLORS.customPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Apple size={size} color={color} />,
          title: "Health",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          tabBarIcon: ({ color, size }) => <Ruler size={size} color={color} />,
          title: "Weight",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
        }}
      />
    </Tabs>
  );
}
