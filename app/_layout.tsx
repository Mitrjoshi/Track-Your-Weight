import { ThemedView } from "@/components/ui/ThemedView";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { loadStore } from "@/lib/tinybase";
import { Balthazar_400Regular, useFonts } from "@expo-google-fonts/balthazar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    Balthazar_400Regular,
  });

  useEffect(() => {
    const load = async () => {
      await loadStore();
      setIsReady(true);
    };
    load();
  }, []);

  if (!isReady || !fontsLoaded) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
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
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
