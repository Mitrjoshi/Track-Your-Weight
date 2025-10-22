import { ThemedLoadingButton } from "@/components/ui/ThemedLoadingButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { useRealtimeWeightLog } from "@/hooks/tinybase/useRealtimeWeightLog";
import { useThemeColor } from "@/hooks/useThemeColor";
import { store } from "@/lib/tinybase";
import { router } from "expo-router";
import { Mars, Minus, Plus, Venus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";

export default function BMIScreen() {
  const { lastLog, latestBMILog } = useRealtimeWeightLog();

  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [weight, setWeight] = useState<number>(65);
  const [age, setAge] = useState<number>(19);
  const [value, setValue] = useState(165);

  const iconColor = useThemeColor({}, "icon");
  const cardColor = useThemeColor({}, "menu");
  const textColor = useThemeColor({}, "text");
  const secondaryText = useThemeColor({}, "secondaryText");
  const avatarBackground = useThemeColor({}, "avatarBackground");

  const handleValueChange = (numberString: string) => {
    const number = parseFloat(numberString);
    setValue(number);
  };

  const handleCalculatePress = () => {
    store.addRow("bmi", {
      created_at: new Date().getTime(),
      height: value,
      weight: weight,
      age: age,
      gender: gender,
    });

    store.addRow("weight_log", {
      created_at: new Date().toISOString(),
      weight: weight,
    });

    router.back();
  };

  useEffect(() => {
    if (lastLog && lastLog.weight) {
      setWeight(lastLog.weight);
    }

    if (latestBMILog) {
      setAge(latestBMILog.age);
      setValue(latestBMILog.height);
      setGender(latestBMILog.gender);
    }
  }, [lastLog, latestBMILog]);

  return (
    <ThemedView className="flex-1">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
        }}
        className="flex-1"
      >
        <ThemedText
          style={{
            color: secondaryText,
          }}
          className="text-center w-[70%] mx-auto text-sm font-semibold"
        >
          Note: There are no other genders in real life except Male and Female
        </ThemedText>

        <View className="flex-row justify-between items-center gap-4">
          <Pressable
            onPress={() => {
              setGender("Male");
            }}
            className="flex-1 w-full aspect-square gap-4 rounded-lg flex justify-center items-center"
          >
            <View
              style={{
                backgroundColor:
                  gender === "Male" ? COLORS.customPrimary : cardColor,
              }}
              className="flex-1 w-full aspect-square rounded-lg flex flex-col justify-evenly items-center"
            >
              <ThemedText
                className="text-xl font-bold"
                style={{
                  color: textColor,
                }}
              >
                Male
              </ThemedText>
              <Mars color={iconColor} size={64} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              setGender("Female");
            }}
            className="flex-1 w-full aspect-square gap-4 rounded-lg flex justify-center items-center"
          >
            <View
              style={{
                backgroundColor:
                  gender === "Female" ? COLORS.customPrimary : cardColor,
              }}
              className="flex-1 w-full aspect-square gap-4 rounded-lg flex justify-center items-center"
            >
              <ThemedText
                className="text-xl font-bold"
                style={{
                  color: textColor,
                }}
              >
                Female
              </ThemedText>
              <Venus color={iconColor} size={64} />
            </View>
          </Pressable>
        </View>

        <View
          style={{ backgroundColor: cardColor }}
          className="flex-col justify-center items-center overflow-hidden p-4 rounded-lg"
        >
          <ThemedText className="text-center text-3xl font-bold">
            Height
          </ThemedText>

          <View className="mt-20">
            <RulerPicker
              unitTextStyle={{
                color: textColor,
                fontWeight: 900,
              }}
              valueTextStyle={{
                color: textColor,
                fontWeight: 900,
              }}
              min={0}
              max={250}
              step={1}
              fractionDigits={1}
              initialValue={value}
              onValueChange={handleValueChange}
              unit="cm"
              height={70}
              indicatorHeight={68}
              indicatorColor={textColor}
              stepWidth={2}
              shortStepColor={secondaryText}
              longStepColor={textColor}
              longStepHeight={32}
            />
          </View>
        </View>

        <View className="flex-row justify-between items-center gap-4">
          <View className="flex-1 w-full aspect-square gap-4 rounded-lg flex justify-center items-center">
            <View
              style={{
                backgroundColor: cardColor,
              }}
              className="flex-1 w-full aspect-square rounded-lg flex flex-col justify-evenly items-center"
            >
              <ThemedText className="text-center text-3xl font-bold">
                Weight
              </ThemedText>

              <ThemedText
                style={{
                  color: COLORS.customPrimary,
                }}
                className="text-center text-3xl font-bold"
              >
                {weight}
              </ThemedText>

              <View className="flex-row justify-around w-full items-center gap-4 px-4">
                <Pressable
                  onPress={() => {
                    setWeight(parseFloat((weight - 0.1).toFixed(1)));
                  }}
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: avatarBackground,
                  }}
                >
                  <Minus size={32} color={iconColor} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setWeight(parseFloat((weight + 0.1).toFixed(1)));
                  }}
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: avatarBackground,
                  }}
                >
                  <Plus size={32} color={iconColor} />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="flex-1 w-full aspect-square gap-4 rounded-lg flex justify-center items-center">
            <View
              style={{
                backgroundColor: cardColor,
              }}
              className="flex-1 w-full aspect-square rounded-lg flex flex-col justify-evenly items-center"
            >
              <ThemedText className="text-center text-3xl font-bold">
                Age
              </ThemedText>

              <ThemedText
                style={{
                  color: COLORS.customPrimary,
                }}
                className="text-center text-3xl font-bold"
              >
                {age}
              </ThemedText>

              <View className="flex-row justify-around w-full items-center gap-4 px-4">
                <Pressable
                  onPress={() => {
                    setAge(age - 1);
                  }}
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: avatarBackground,
                  }}
                >
                  <Minus size={32} color={iconColor} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setAge(age + 1);
                  }}
                  className="p-4 rounded-full"
                  style={{
                    backgroundColor: avatarBackground,
                  }}
                >
                  <Plus size={32} color={iconColor} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <ThemedLoadingButton
          isLoading={false}
          onPress={handleCalculatePress}
          text="Calculate"
        />
      </ScrollView>
    </ThemedView>
  );
}
