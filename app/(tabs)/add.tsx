import { ThemedLoadingButton } from "@/components/ui/ThemedLoadingButton";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { store } from "@/lib/tinybase";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";

export default function AddScreen() {
  const textColor = useThemeColor({}, "text");
  const secondaryText = useThemeColor({}, "secondaryText");
  const [value, setValue] = useState(0);

  const handleAddWeight = () => {
    store.addRow("weight_log", {
      id: Date.now(),
      weight: value,
    });

    router.back();
  };

  const handleValueChange = (numberString: string) => {
    const number = parseFloat(numberString);
    setValue(number);
  };

  return (
    <ThemedView className="flex-1 p-4 gap-2">
      <View className="flex-1 justify-center">
        <RulerPicker
          unitTextStyle={{
            color: textColor,
            fontWeight: 900,
            fontSize: 44,
          }}
          valueTextStyle={{
            color: textColor,
            fontWeight: 900,
            fontSize: 44,
          }}
          min={0}
          max={250}
          step={0.1}
          fractionDigits={1}
          initialValue={0}
          onValueChange={handleValueChange}
          unit="kg"
          height={70}
          indicatorHeight={90}
          indicatorColor={textColor}
          stepWidth={2}
          shortStepColor={secondaryText}
          longStepColor={textColor}
          longStepHeight={32}
        />
      </View>

      <ThemedLoadingButton
        text="Add Weight"
        isLoading={false}
        onPress={handleAddWeight}
      />
    </ThemedView>
  );
}
