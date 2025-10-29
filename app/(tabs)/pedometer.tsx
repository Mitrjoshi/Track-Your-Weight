import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pedometer } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const PROGRESS_WIDTH = Dimensions.get("window").width / 2;

export default function Steps() {
  const borderColor = useThemeColor({}, "input");

  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        const pastStepCountResult = await Pedometer.getStepCountAsync(
          start,
          end
        );
        if (pastStepCountResult) {
          setPastStepCount(pastStepCountResult.steps);
        }

        subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    subscribe();

    return () => {
      // clean up when component unmounts
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // if (isPedometerAvailable === "checking") {
  //   return (
  //     <ThemedView className="flex-1 p-4 flex justify-center items-center">
  //       <ThemedText className="font-semibold text-center">
  //         Checking pedometer availability...
  //       </ThemedText>
  //     </ThemedView>
  //   );
  // }

  // if (isPedometerAvailable === "false") {
  //   return (
  //     <ThemedView className="flex-1 p-4 flex justify-center items-center">
  //       <ThemedText className="font-semibold text-center">
  //         Pedometer is not available on your device
  //       </ThemedText>
  //     </ThemedView>
  //   );
  // }

  return (
    <ThemedView className="flex-1 p-4">
      <View className="flex items-center relative justify-center">
        <AnimatedCircularProgress
          size={PROGRESS_WIDTH}
          width={12}
          fill={10}
          tintColor={COLORS.customPrimary}
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor={borderColor}
          backgroundWidth={12}
          rotation={180}
          lineCap="round"
        />
        <ThemedText className="absolute !font-bold text-3xl">1980</ThemedText>
      </View>
    </ThemedView>
  );
}
