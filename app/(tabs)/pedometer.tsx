import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    subscribe();

    return () => {
      // cleanup only after subscription is ready
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <ThemedView className="flex-1 justify-center items-center">
      <ThemedText className="font-semibold">
        Walk! And watch this go up: {currentStepCount}
      </ThemedText>
    </ThemedView>
  );
}
