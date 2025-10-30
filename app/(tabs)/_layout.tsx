import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, Tabs } from "expo-router";
import { Apple, Footprints, Ruler, Search } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

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
          title: "Calories",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 32,
            fontWeight: 900,
          },
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/search");
              }}
              className="p-4 aspect-square"
            >
              <Search color={textColor} size={24} strokeWidth={2.5} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="pedometer"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Footprints size={size} color={color} />
          ),
          title: "Steps",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 32,
            fontWeight: 900,
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
            fontSize: 32,
            fontWeight: 900,
          },
        }}
      />
    </Tabs>
  );
}
