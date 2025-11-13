import { I_BMI, I_WeightLog } from "@/interface";
import { store } from "@/lib/tinybase";
import { flattenTable } from "@/utils/flattenTable";
import { useEffect, useMemo, useState } from "react";

export function useRealtimeWeightLog() {
  const [weightLog, setWeightLog] = useState<I_WeightLog[]>([]);
  const [bmiLog, setBMILog] = useState<I_BMI[]>([]);
  const [goalLog, setGoalLog] = useState<
    { created_at: string; value: number }[]
  >([]);

  // --- Weight listener ---
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

      setWeightLog(sortedAsc);

      // If no weights exist, delete all BMI rows and clear BMI state
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
  }, []);

  // --- BMI listener ---
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
  }, []);

  // --- Goal listener ---
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
  }, []);

  // --- Derived weight values ---
  const firstLog = useMemo(() => weightLog[0] ?? null, [weightLog]);
  const lastLog = useMemo(
    () => weightLog[weightLog.length - 1] ?? null,
    [weightLog]
  );

  const weightDifference = useMemo(() => {
    if (!firstLog || !lastLog) return null;
    return parseFloat((lastLog.weight - firstLog.weight).toFixed(1));
  }, [firstLog, lastLog]);

  const historyLog = useMemo(() => [...weightLog].reverse(), [weightLog]);

  // --- Averages: daily, weekly, monthly with minimum span (2x interval) ---
  const { dailyAverageWeight, weeklyAverageWeight, monthlyAverageWeight } =
    useMemo(() => {
      if (!weightLog.length) {
        return {
          dailyAverageWeight: null,
          weeklyAverageWeight: null,
          monthlyAverageWeight: null,
        };
      }

      const msInDay = 24 * 60 * 60 * 1000;

      const earliestDate = new Date(
        weightLog[0].created_at ?? weightLog[0].id ?? new Date().toISOString()
      );
      const latestDate = new Date(
        weightLog[weightLog.length - 1].created_at ??
          weightLog[weightLog.length - 1].id ??
          new Date().toISOString()
      );
      const spanMs = latestDate.getTime() - earliestDate.getTime();

      // Need at least 2×interval worth of data span
      const hasTwoDaysOfData = spanMs >= 2 * msInDay;
      const hasTwoWeeksOfData = spanMs >= 14 * msInDay; // 2 weeks
      const hasTwoMonthsOfData = spanMs >= 60 * msInDay; // ~2 months (2×30d)

      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const startOfWeek = new Date(startOfToday.getTime() - 6 * msInDay); // last 7 days
      const startOfMonth = new Date(startOfToday.getTime() - 29 * msInDay); // last 30 days

      const getDateFromLog = (log: any) =>
        log.created_at ? new Date(log.created_at) : new Date();

      const getAverage = (logs: I_WeightLog[]) => {
        if (!logs.length) return null;
        const sum = logs.reduce((acc, l) => acc + l.weight, 0);
        return parseFloat((sum / logs.length).toFixed(1));
      };

      const dailyLogs = weightLog.filter((log) => {
        const d = getDateFromLog(log);
        return d >= startOfToday;
      });

      const weeklyLogs = weightLog.filter((log) => {
        const d = getDateFromLog(log);
        return d >= startOfWeek;
      });

      const monthlyLogs = weightLog.filter((log) => {
        const d = getDateFromLog(log);
        return d >= startOfMonth;
      });

      const dailyAvgRaw = getAverage(dailyLogs);
      const weeklyAvgRaw = getAverage(weeklyLogs);
      const monthlyAvgRaw = getAverage(monthlyLogs);

      return {
        dailyAverageWeight: hasTwoDaysOfData ? dailyAvgRaw : null,
        weeklyAverageWeight: hasTwoWeeksOfData ? weeklyAvgRaw : null,
        monthlyAverageWeight: hasTwoMonthsOfData ? monthlyAvgRaw : null,
      };
    }, [weightLog]);

  // --- Latest BMI log ---
  const latestBMILog = useMemo(
    () => bmiLog[bmiLog.length - 1] ?? null,
    [bmiLog]
  );

  // --- Compute BMI from latest weight or BMI log ---
  const latestBMIValue = useMemo(() => {
    const weight = lastLog?.weight ?? latestBMILog?.weight;
    const height = latestBMILog?.height;
    if (!weight || !height) return null;
    return parseFloat((weight / (height / 100) ** 2).toFixed(2));
  }, [lastLog, latestBMILog]);

  // --- Latest goal value ---
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
    weightDifference,

    // Averages
    dailyAverageWeight,
    weeklyAverageWeight,
    monthlyAverageWeight,

    // BMI logs
    bmiLog,
    latestBMILog,
    latestBMIValue,

    // Goal
    goalLog,
    latestGoal,
    goalLeft: latestGoal ? latestGoal - (historyLog[0]?.weight ?? 0) : null,
  };
}
