import { ThemedLoadingButton } from "@/components/ui/ThemedLoadingButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EntryPage() {
  return (
    <ThemedView className="flex-1 justify-between px-4 pt-10 bg-white dark:bg-black">
      {/* Top Section */}
      <View className="w-full mt-10 items-center">
        <ThemedText className="text-4xl font-extrabold text-center tracking-tighter">
          Get Fit. Stay Strong.
        </ThemedText>

        <ThemedText color="secondaryText" className="text-center text-lg">
          Track your progress, crush your goals, and become your best self.
        </ThemedText>
      </View>

      {/* Bottom CTA */}
      <View className="w-full pb-4 gap-6">
        <View>
          <ThemedText className="text-center text-sm opacity-70 leading-relaxed px-4">
            “It is a shame for a man to grow old without seeing the beauty and
            strength of which his body is capable.”
          </ThemedText>
          <ThemedText className="text-center text-sm opacity-70 leading-relaxed px-4">
            - Socrates
          </ThemedText>
        </View>

        <ThemedLoadingButton
          isLoading={false}
          style={{
            width: "100%",
          }}
          text="Start Your Journey"
          onPress={() => router.push("/user-goals")}
        />
      </View>
    </ThemedView>
  );
}
