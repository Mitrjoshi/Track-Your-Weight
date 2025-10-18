import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedLoadingButton } from "@/components/ui/ThemedLoadingButton";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { store } from "@/lib/tinybase";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function AddScreen() {
  const textColor = useThemeColor({}, "text");
  const secondaryText = useThemeColor({}, "secondaryText");
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState<string | null>(null);

  const data = [...Array(501).keys()].map((index) => {
    const value = (index * 0.5).toFixed(1); // 0.0, 0.5, 1.0, 1.5, ...
    return {
      value: parseFloat(value),
      label: `${value} kg`,
    };
  });

  const handleAddWeight = () => {
    store.addRow("weight_log", {
      id: Date.now(),
      weight: value,
      description: description as string,
    });

    router.back();
  };

  return (
    <ThemedView className="flex-1 p-4 gap-2">
      <View className="flex-1 justify-center">
        <WheelPicker
          data={data}
          value={value}
          onValueChanged={({ item: { value } }) => setValue(value)}
          enableScrollByTapOnItem={true}
          itemTextStyle={{ color: textColor, fontSize: 32, fontWeight: 900 }}
          overlayItemStyle={{ backgroundColor: secondaryText }}
        />
      </View>

      <View className="!h-[45px]">
        <ThemedInput
          onChangeText={(e) => setDescription(e)}
          placeholder="Description (optional)"
          className="!h-[45px] px-4 rounded-md w-full"
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
