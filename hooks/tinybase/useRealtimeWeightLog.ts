import { I_WeightLog } from "@/interface";
import { store } from "@/lib/tinybase";
import { flattenTable } from "@/utils/flattenTable";
import { useEffect, useMemo, useState } from "react";

export function useRealtimeWeightLog() {
  const [weightLog, setWeightLog] = useState<I_WeightLog[]>([]);
  const [historyLog, setHistoryLog] = useState<I_WeightLog[]>([]);

  useEffect(() => {
    if (!store) return;

    const loadWeights = () => {
      const table = store.getTable("weight_log");
      if (table) {
        const flattened = flattenTable(table) as unknown as I_WeightLog[];

        // Sort by id (string date)
        const sortedAsc = [...flattened].sort(
          (a, b) => new Date(a.id).getTime() - new Date(b.id).getTime()
        );
        const sortedDesc = [...sortedAsc].reverse();

        setWeightLog(sortedAsc);
        setHistoryLog(sortedDesc);
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

  // derived values
  const firstLog = useMemo(() => weightLog[0] ?? null, [weightLog]);
  const lastLog = useMemo(
    () => weightLog[weightLog.length - 1] ?? null,
    [weightLog]
  );
  const weightDifference = useMemo(() => {
    if (!firstLog || !lastLog) return null;
    return parseFloat((lastLog.weight - firstLog.weight).toFixed(1));
  }, [firstLog, lastLog]);

  return { weightLog, historyLog, firstLog, lastLog, weightDifference };
}
