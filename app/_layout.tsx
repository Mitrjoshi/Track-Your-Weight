import { ThemedView } from "@/components/ui/ThemedView";
import "@/global.css";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { loadStore } from "@/lib/tinybase";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      await loadStore();
      setIsReady(true);
    };
    load();
  }, []);

  if (!isReady) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </ThemedView>
    );
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="add"
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Add",
              headerTitleStyle: {
                fontSize: 32,
                fontWeight: 900,
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
                fontSize: 32,
                fontWeight: 900,
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
                fontSize: 32,
                fontWeight: 900,
              },
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
