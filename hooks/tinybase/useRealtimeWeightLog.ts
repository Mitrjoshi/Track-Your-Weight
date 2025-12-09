import { I_BMI, I_WeightLog } from "@/interface";
import { store } from "@/lib/tinybase";
import { flattenTable } from "@/utils/flattenTable";
import { useEffect, useMemo, useState } from "react";

export function useRealtimeWeightLog() {
  const [weightLog, setWeightLog] = useState<I_WeightLog[]>([]);
  const [bmiLog, setBMILog] = useState<I_BMI[]>([]);
  const [goalLog, setGoalLog] = useState<
    { created_at: string; value: number }[]
  >([]); // --- Weight listener ---

  useEffect(() => {
    if (!store) return;

    const loadWeights = () => {
      const table = store.getTable("weight_log");
      if (!table) {
        setWeightLog([]);
        return;
      }

      const flattened = flattenTable(table) as unknown as (I_WeightLog & {
        created_at?: string;
      })[];

      const withCreatedAt = flattened.map((log) => ({
        ...log,
        created_at: log.created_at ?? log.id ?? new Date().toISOString(),
      }));

      const sortedAsc = [...withCreatedAt].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setWeightLog(sortedAsc); // If no weights exist, delete all BMI rows and clear BMI state

      if (sortedAsc.length === 0) {
        const bmiTable = store.getTable("bmi");
        if (bmiTable) {
          Object.keys(bmiTable).forEach((rowId) => {
            store.delRow("bmi", rowId);
          });
        }
        setBMILog([]);
      }
    };

    loadWeights();
    const listenerId = store.addTableListener("weight_log", loadWeights, true);
    return () => {
      store.delListener(listenerId);
    };
  }, []); // --- BMI listener ---

  useEffect(() => {
    if (!store) return;

    const loadBMI = () => {
      const table = store.getTable("bmi");

      if (!table) {
        setBMILog([]);
        return;
      }

      const flattened = flattenTable(table) as unknown as I_BMI[];
      const sortedAsc = flattened.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setBMILog(sortedAsc);
    };

    loadBMI();
    const listenerId = store.addTableListener("bmi", loadBMI, true);
    return () => {
      store.delListener(listenerId);
    };
  }, []); // --- Goal listener ---

  useEffect(() => {
    if (!store) return;

    const loadGoals = () => {
      const table = store.getTable("goal_log");
      if (!table) {
        setGoalLog([]);
        return;
      }

      const flattened = flattenTable(table) as unknown as {
        created_at: string;
        value: number;
      }[];

      const sortedAsc = [...flattened].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setGoalLog(sortedAsc);
    };

    loadGoals();
    const listenerId = store.addTableListener("goal_log", loadGoals, true);
    return () => {
      store.delListener(listenerId);
    };
  }, []); // --- Derived weight values ---

  const firstLog = useMemo(() => weightLog[0] ?? null, [weightLog]);
  const lastLog = useMemo(
    () => weightLog[weightLog.length - 1] ?? null,
    [weightLog]
  );

  const weightDifference = useMemo(() => {
    if (!firstLog || !lastLog) return null;
    return parseFloat((lastLog.weight - firstLog.weight).toFixed(1));
  }, [firstLog, lastLog]);

  const historyLog = useMemo(() => [...weightLog].reverse(), [weightLog]); // --- Average Growth Rates: daily, weekly, monthly with minimum span (2x interval) ---

  const { overallAverageWeight, weeklyAverageWeight, monthlyAverageWeight } =
    useMemo(() => {
      if (weightLog.length < 2) {
        return {
          overallAverageWeight: null,
          weeklyAverageWeight: null,
          monthlyAverageWeight: null,
        };
      }

      const msInDay = 24 * 60 * 60 * 1000;
      const getDateFromLog = (log: any) =>
        new Date(log.created_at ?? log.id ?? new Date().toISOString());

      const latestDate = getDateFromLog(weightLog[weightLog.length - 1]);

      const growthInWindow = (days: number) => {
        const start = new Date(latestDate.getTime() - days * msInDay);
        const windowLogs = weightLog.filter(
          (log) => getDateFromLog(log) >= start
        );

        if (windowLogs.length < 2) return null;

        const first = windowLogs[0];
        const last = windowLogs[windowLogs.length - 1];

        return Number((last.weight - first.weight).toFixed(2)); // kg change in window
      };

      const overallGrowth = Number(
        (weightLog[weightLog.length - 1].weight - weightLog[0].weight).toFixed(
          2
        )
      );

      return {
        overallAverageWeight: overallGrowth, // overall growth
        weeklyAverageWeight: growthInWindow(7), // 7-day growth
        monthlyAverageWeight: growthInWindow(30), // 30-day growth
      };
    }, [weightLog]);

  const latestBMILog = useMemo(
    () => bmiLog[bmiLog.length - 1] ?? null,
    [bmiLog]
  ); // --- Compute BMI from latest weight or BMI log ---

  const latestBMIValue = useMemo(() => {
    const weight = lastLog?.weight ?? latestBMILog?.weight;
    const height = latestBMILog?.height;
    if (!weight || !height) return null;
    return parseFloat((weight / (height / 100) ** 2).toFixed(2));
  }, [lastLog, latestBMILog]); // --- Latest goal value ---

  const latestGoal = useMemo(
    () => goalLog[goalLog.length - 1]?.value ?? null,
    [goalLog]
  );

  return {
    // Weight logs
    weightLog,
    historyLog,
    firstLog,
    lastLog,
    weightDifference, // Averages (Now Growth Rates)

    overallAverageWeight,
    weeklyAverageWeight,
    monthlyAverageWeight, // BMI logs

    bmiLog,
    latestBMILog,
    latestBMIValue, // Goal

    goalLog,
    latestGoal,
    goalLeft: latestGoal ? latestGoal - (historyLog[0]?.weight ?? 0) : null,
  };
}
