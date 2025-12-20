import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";

export type FoodSearchResult = {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export async function searchFoodsIndia(
  query: string,
  pageSize = 8,
  signal?: AbortSignal
) {
  if (!query.trim()) return [];

  const data = await axiosInstance.get("/cgi/search.pl", {
    signal, // 🔥 THIS IS THE FIX
    params: {
      search_terms: query,
      search_simple: 1,
      action: "process",
      json: 1,
      page_size: pageSize,
      fields: "code,product_name,brands,image_front_url,nutriments",
    },
  });

  return data.data.products
    .filter(
      (p: any) => p.product_name && p.nutriments?.["energy-kcal_100g"] != null
    )
    .map((p: any) => {
      const n = p.nutriments;
      return {
        id: p.code,
        name: p.product_name,
        brand: p.brands,
        image: p.image_front_url,
        calories: Number(n["energy-kcal_100g"]) || 0,
        protein: Number(n["proteins_100g"]) || 0,
        carbs: Number(n["carbohydrates_100g"]) || 0,
        fat: Number(n["fat_100g"]) || 0,
      };
    });
}

export function useSearchFood(query: string) {
  return useQuery({
    queryKey: ["food-search-india", query],
    queryFn: ({ signal }) => searchFoodsIndia(query, 8, signal),
    enabled: query.trim().length > 1,
    staleTime: 1000 * 60 * 10,
    retry: false, // important for search
  });
}
