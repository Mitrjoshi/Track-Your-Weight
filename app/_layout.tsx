import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/theme";
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    Balthazar_400Regular,
  });

  const isLoggedIn = false;

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
        <ActivityIndicator color={Colors.base.blue} size={"large"} />
      </ThemedView>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor:
              Colors[colorScheme === "dark" ? "dark" : "light"].background,
          },
        }}
      >
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="user-goals"
            options={{
              headerShown: true,
              headerShadowVisible: false,
              title: "Goals",
              headerTitleStyle: {
                fontSize: 36,
                fontFamily: "Balthazar_400Regular",
              },
            }}
          />
        </Stack.Protected>

        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="private"
            options={{
              headerShown: false,
            }}
          />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
