import { Colors } from "@/constants/theme";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";

import "react-native-reanimated";

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor:
            Colors[colorScheme === "dark" ? "dark" : "light"].background,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="search"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Search",
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="food"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Food",
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Add",
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="goal"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Goal",
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="bmi"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "BMI",
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
        }}
      />
    </Stack>
  );
}
