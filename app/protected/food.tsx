import ProgressBar from "@/components/ProgressBar";
import Card from "@/components/shared/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { FOOD_ITEMS } from "@/constants/data";
import { COLORS } from "@/constants/theme";
import { getNutritionForAmount } from "@/utils/getCaloriesForAmount";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useMemo } from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";

// --- Units helper ---

const KCAL_KEYS = new Set(["calories"]);

const GRAM_KEYS = new Set([
  "water",
  "protein",
  "total_fat",
  "saturated_fats",
  "trans_fats",
  "monounsaturated_fats",
  "polyunsaturated_fats",
  "carbohydrates",
  "dietary_fiber",
  "soluble_fiber",
  "insoluble_fiber",
  "total_sugars",
  "added_sugars",
  "sugar_alcohols",
  "other_carbohydrates",
  "omega_3",
  "omega_6",
  "omega_9",
  "cholesterol", // you can change to "mg" if you prefer
]);

const MG_KEYS = new Set([
  // minerals
  "iron",
  "zinc",
  "copper",
  "iodine",
  "calcium",
  "magnesium",
  "manganese",
  "phosphorus",
  "potassium",
  "sodium",
  "selenium",
  "chromium",
  "molybdenum",
  "chlorine",
  "choline",
  // common vitamins in mg form
  "vitamin_c",
  "vitamin_e",
  "vitamin_b6",
  "thiamin",
  "riboflavin",
  "niacin",
  "pantothenic_acid",
  // misc that are usually mg
  "caffeine",
]);

const AMINO_ACIDS = new Set([
  "lysine",
  "serine",
  "valine",
  "alanine",
  "cystine",
  "glycine",
  "leucine",
  "proline",
  "taurine",
  "arginine",
  "tyrosine",
  "histidine",
  "threonine",
  "isoleucine",
  "methionine",
  "tryptophan",
  "aspartic_acid",
  "glutamic_acid",
  "phenylalanine",
]);

function getUnit(key: string): string {
  if (KCAL_KEYS.has(key)) return "kcal";
  if (key.endsWith("_iu")) return "IU";

  if (GRAM_KEYS.has(key)) return "g";
  if (AMINO_ACIDS.has(key)) return "g";

  // most fatty acids as grams
  if (key.endsWith("_acid")) return "g";
  if (key.startsWith("omega_")) return "g";

  if (MG_KEYS.has(key)) return "mg";

  // default fallback – at least *something* is shown
  return "mg";
}

const formatLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function FoodDetails() {
  const { id } = useLocalSearchParams();

  const FOOD_DATA = FOOD_ITEMS.find((item) => item.id === id);

  const nutrientList = useMemo(() => {
    if (!FOOD_DATA?.nutrients) return [];

    return Object.entries(FOOD_DATA.nutrients).map(([key, value]) => {
      const label = formatLabel(key);
      const unit = getUnit(key);
      const valueText =
        value !== null && value !== undefined
          ? `${value} ${unit}`.trim()
          : `0 ${unit}`;

      return {
        key,
        label,
        value: valueText,
      };
    });
  }, [FOOD_DATA?.nutrients]);

  if (!FOOD_DATA) {
    return;
  }

  return (
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Food",
          headerTitleStyle: {
            fontSize: 36,
            fontFamily: "Balthazar_400Regular",
          },
          headerRight: () => (
            <Pressable>
              <ThemedText
                className="font-semibold text-xl"
                style={{
                  color: COLORS.customPrimary,
                }}
              >
                Add
              </ThemedText>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{
          gap: 12,
          padding: 16,
          paddingTop: 0,
        }}
      >
        <ThemedText className="text-3xl font-bold">
          {FOOD_DATA?.name}
        </ThemedText>
        <Card className="gap-0 p-4">
          <ThemedText className="text-xl font-semibold">Macros</ThemedText>

          <View>
            <ProgressBar
              gradient={false}
              segments={1}
              label="kcal"
              goal={100}
              value={Number(getNutritionForAmount(FOOD_DATA, 100).calories)}
            />
            <ProgressBar
              gradient={false}
              segments={1}
              label="g"
              goal={100}
              value={Number(getNutritionForAmount(FOOD_DATA, 100).protein)}
            />
            <ProgressBar
              gradient={false}
              segments={1}
              label="g"
              goal={100}
              value={Number(getNutritionForAmount(FOOD_DATA, 100).fat)}
            />
            <ProgressBar
              gradient={false}
              segments={1}
              label="g"
              goal={100}
              value={Number(getNutritionForAmount(FOOD_DATA, 100).carbs)}
            />
          </View>
        </Card>

        {FOOD_DATA?.description && (
          <Card className="gap-0 p-4">
            <ThemedText className="text-xl font-semibold">
              Description
            </ThemedText>
            <ThemedText>
              <ThemedText>{FOOD_DATA?.description}</ThemedText>
            </ThemedText>
          </Card>
        )}

        {FOOD_DATA?.ingredients && (
          <Card className="gap-0 p-4">
            <ThemedText className="text-xl font-semibold">
              Ingredients
            </ThemedText>
            <ThemedText>{FOOD_DATA?.ingredients.join(", ")}</ThemedText>
          </Card>
        )}

        {FOOD_DATA?.alternate_names &&
          FOOD_DATA?.alternate_names.length > 0 && (
            <Card className="gap-0 p-4">
              <ThemedText className="text-xl font-semibold">
                Alternate Names
              </ThemedText>
              <ThemedText>{FOOD_DATA?.alternate_names.join(", ")}</ThemedText>
            </Card>
          )}

        <View className="gap-2">
          <ThemedText className="text-xl font-semibold">
            Macros/Nutrients
          </ThemedText>
          <FlatList
            data={nutrientList}
            numColumns={2}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{
              gap: 12,
              paddingBottom: 24,
            }}
            scrollEnabled={false}
            columnWrapperStyle={{
              gap: 12,
            }}
            renderItem={({ item }) => (
              <Card className="p-4 flex-1">
                <ThemedText className="font-semibold text-xl">
                  {item.label}
                </ThemedText>
                <ThemedText>{item.value}</ThemedText>
              </Card>
            )}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
