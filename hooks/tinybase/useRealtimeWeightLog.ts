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

  const { dailyAverageGrowth, weeklyAverageGrowth, monthlyAverageGrowth } =
    useMemo(() => {
      if (weightLog.length < 2) {
        return {
          dailyAverageGrowth: null,
          weeklyAverageGrowth: null,
          monthlyAverageGrowth: null,
        };
      }

      const msInDay = 24 * 60 * 60 * 1000;

      const getDateFromLog = (log: any) =>
        new Date(log.created_at ?? log.id ?? new Date().toISOString());

      const earliestDate = getDateFromLog(weightLog[0]);
      const latestDate = getDateFromLog(weightLog[weightLog.length - 1]);
      const totalSpanMs = latestDate.getTime() - earliestDate.getTime(); // Need at least 2×interval worth of data span

      const hasTwoDaysOfData = totalSpanMs >= 2 * msInDay;
      const hasTwoWeeksOfData = totalSpanMs >= 14 * msInDay; // 2 weeks
      const hasTwoMonthsOfData = totalSpanMs >= 60 * msInDay; // ~2 months (2×30d) // Function to calculate average growth rate for a time span

      const getAverageGrowth = (logs: I_WeightLog[]) => {
        if (logs.length < 2) return null;

        const first = logs[0];
        const last = logs[logs.length - 1];

        const weightDiff = last.weight - first.weight;
        const timeSpanMs =
          getDateFromLog(last).getTime() - getDateFromLog(first).getTime();

        if (timeSpanMs === 0) return null; // Avoid division by zero // Rate is weightDiff / days

        const ratePerDay = weightDiff / (timeSpanMs / msInDay);
        return parseFloat(ratePerDay.toFixed(2));
      }; // --- 1. Daily Rate (based on the last 48 hours for a more robust change) --- // A daily average rate is best calculated over a slightly longer period // for stability, or by comparing the last log to the first log in the entire history. // For the Daily Rate, we will use the total span, which represents the overall average daily change.

      const dailyRateRaw = getAverageGrowth(weightLog); // --- 2. Weekly Rate (last 7 days of data for the growth calculation) ---

      const now = new Date();
      const startOfLastWeek = new Date(now.getTime() - 6 * msInDay); // Find the first log recorded at or after the start of the week span
      const firstLogForWeeklySpan = weightLog.find(
        (log) => getDateFromLog(log) >= startOfLastWeek
      ); // Find the last log recorded

      const lastLogForWeeklySpan = weightLog[weightLog.length - 1]; // If we have the necessary logs, calculate the growth rate

      let weeklyRateRaw = null;
      if (firstLogForWeeklySpan && lastLogForWeeklySpan) {
        const logsForWeeklyCalc = [firstLogForWeeklySpan, lastLogForWeeklySpan]; // Ensure the first and last log are actually different to calculate a growth
        if (
          logsForWeeklyCalc[0].weight !== logsForWeeklyCalc[1].weight ||
          getDateFromLog(logsForWeeklyCalc[0]).getTime() !==
            getDateFromLog(logsForWeeklyCalc[1]).getTime()
        ) {
          weeklyRateRaw = getAverageGrowth(logsForWeeklyCalc);
        }
      } // --- 3. Monthly Rate (last 30 days of data for the growth calculation) ---

      const startOfLastMonth = new Date(now.getTime() - 29 * msInDay);
      const firstLogForMonthlySpan = weightLog.find(
        (log) => getDateFromLog(log) >= startOfLastMonth
      );

      const lastLogForMonthlySpan = weightLog[weightLog.length - 1];

      let monthlyRateRaw = null;
      if (firstLogForMonthlySpan && lastLogForMonthlySpan) {
        const logsForMonthlyCalc = [
          firstLogForMonthlySpan,
          lastLogForMonthlySpan,
        ];
        if (
          logsForMonthlyCalc[0].weight !== logsForMonthlyCalc[1].weight ||
          getDateFromLog(logsForMonthlyCalc[0]).getTime() !==
            getDateFromLog(logsForMonthlyCalc[1]).getTime()
        ) {
          monthlyRateRaw = getAverageGrowth(logsForMonthlyCalc);
        }
      }

      return {
        // The daily rate is set to the overall daily rate across the entire history for stability
        dailyAverageGrowth: hasTwoDaysOfData ? dailyRateRaw : null, // Weekly/Monthly are based on the change from the start of the period to the last log
        weeklyAverageGrowth: hasTwoWeeksOfData ? weeklyRateRaw : null,
        monthlyAverageGrowth: hasTwoMonthsOfData ? monthlyRateRaw : null,
      };
    }, [weightLog]); // --- Latest BMI log ---

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

    dailyAverageGrowth,
    weeklyAverageGrowth,
    monthlyAverageGrowth, // BMI logs

    bmiLog,
    latestBMILog,
    latestBMIValue, // Goal

    goalLog,
    latestGoal,
    goalLeft: latestGoal ? latestGoal - (historyLog[0]?.weight ?? 0) : null,
  };
}
