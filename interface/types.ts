export interface FoodItem {
  id: string;
  name: string;
  alternate_names: string[];
  description: string | null;
  source: string | null;
  nutrients: any;
  serving: {
    common: {
      unit: string;
      quantity: number;
      name?: string;
    };
    metric: {
      unit: string;
      quantity: number;
    };
  };

  ingredients: [string] | null;
}
