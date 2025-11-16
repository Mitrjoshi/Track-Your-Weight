import { FoodItem } from "@/interface/types";

export const getNutritionForAmount = (food: FoodItem, grams: number) => {
  const g = food.serving.metric.quantity;

  const scale = grams / g;

  return {
    calories: food.nutrients.calories * scale,
    protein: food.nutrients.protein ? food.nutrients.protein * scale : 0,
    carbs: food.nutrients.carbohydrates
      ? food.nutrients.carbohydrates * scale
      : 0,
    fat: food.nutrients.total_fat ? food.nutrients.total_fat * scale : 0,
  };
};
