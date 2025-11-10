import ProgressBar from "@/components/ProgressBar";
import Card from "@/components/shared/Card";
import GreetingSection from "@/components/shared/GreetingSection";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Circle } from "react-native-svg";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function IndexScreen() {
  const secondaryText = useThemeColor({}, "secondaryText");

  return (
    <ThemedView className="flex-1 flex-col gap-4">
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingTop: 0,
          paddingBottom: 90,
        }}
      >
        <GreetingSection />
        <Card className="flex flex-row justify-between items-start gap-8">
          <View className="relative flex justify-center items-center">
            <AnimatedCircularProgress
              fill={75}
              size={SCREEN_WIDTH / 2.5}
              width={15}
              rotation={240}
              arcSweepAngle={240}
              lineCap="round"
              tintColor={COLORS.customPrimary}
              backgroundColor={secondaryText + "30"}
              renderCap={({ center }) => (
                <Circle cx={center.x} cy={center.y} r="6" fill={"white"} />
              )}
            />

            <View className="absolute flex justify-center items-center">
              <ThemedText className="text-4xl font-semibold">1910</ThemedText>
              <View>
                <ThemedText
                  numberOfLines={2}
                  style={{
                    color: secondaryText,
                  }}
                  className="text-center text-sm"
                >
                  Calories
                </ThemedText>
              </View>
            </View>
          </View>

          <View className="flex-1 flex gap-4">
            <ProgressBar
              goal={43}
              label="g"
              value={18.49}
              gradient={false}
              segments={1}
              segment_height={8}
              color="#885cc0"
            />
            <ProgressBar
              goal={107}
              label="g"
              value={15.6}
              gradient={false}
              segments={1}
              segment_height={8}
              color="#f1d900"
            />
            <ProgressBar
              goal={18}
              label="g"
              value={10.06}
              gradient={false}
              segments={1}
              segment_height={8}
              color="#e76a49"
            />
          </View>
        </Card>
      </ScrollView>

      <Link href={"/search"} asChild>
        <Pressable
          style={{
            backgroundColor: COLORS.customPrimary,
          }}
          className="absolute bottom-6 right-6 h-16 flex-row px-4 rounded-full flex justify-center items-center gap-2"
        >
          <Plus color="white" strokeWidth={2} size={32} />
          <ThemedText className="text-lg font-semibold">Add Meal</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}
