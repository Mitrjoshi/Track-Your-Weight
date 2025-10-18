import { I_WeightLog } from "@/interface";
import { store } from "@/lib/tinybase";
import { flattenTable } from "@/utils/flattenTable";
import { useEffect, useState } from "react";

export function useRealtimeWeightLog() {
  const [weightLog, setWeightLog] = useState<I_WeightLog[]>([]);

  useEffect(() => {
    if (!store) return;

    const loadWeights = () => {
      const table = store.getTable("weight_log");
      if (table) {
        const flattened = flattenTable(table) as unknown as I_WeightLog[];

        // ✅ sort descending by created_at (latest first)
        const sorted = flattened.sort(
          (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()
        );

        setWeightLog(sorted);
      }
    };

    loadWeights();

    const listenerId = store.addTableListener(
      "weight_log",
      () => {
        loadWeights();
      },
      true
    );

    return () => {
      store.delListener(listenerId);
    };
  }, [store]);

  return { weightLog };
}
