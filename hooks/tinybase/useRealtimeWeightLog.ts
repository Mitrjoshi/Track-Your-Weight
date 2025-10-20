import { I_BMI, I_WeightLog } from "@/interface";
import { store } from "@/lib/tinybase";
import { flattenTable } from "@/utils/flattenTable";
import { useEffect, useMemo, useState } from "react";

export function useRealtimeWeightLog() {
  const [weightLog, setWeightLog] = useState<I_WeightLog[]>([]);
  const [bmiLog, setBMILog] = useState<I_BMI[]>([]);
  const [goalLog, setGoalLog] = useState<{ id: number; value: number }[]>([]);

  // --- Weight listener ---
  useEffect(() => {
    if (!store) return;

    const loadWeights = () => {
      const table = store.getTable("weight_log");
      if (!table) return;

      const flattened = flattenTable(table) as unknown as I_WeightLog[];
      const sortedAsc = [...flattened].sort(
        (a, b) => a.timestamp - b.timestamp
      );
      setWeightLog(sortedAsc);
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
      if (!table) return;

      const flattened = flattenTable(table) as unknown as I_BMI[];
      const sortedAsc = [...flattened].sort((a, b) => a.id - b.id);
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
      if (!table) return;

      const flattened = flattenTable(table) as unknown as {
        id: number;
        value: number;
      }[];
      const sortedAsc = [...flattened].sort((a, b) => a.id - b.id);
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

  // --- Latest BMI log ---
  const latestBMILog = useMemo(
    () => bmiLog[bmiLog.length - 1] ?? null,
    [bmiLog]
  );

  // --- Compute BMI from latest weight log or latest BMI log ---
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
    // BMI logs
    bmiLog,
    latestBMILog,
    latestBMIValue,
    // Goal
    goalLog,
    latestGoal,
    goalLeft: latestGoal ? latestGoal - historyLog[0].weight : null,
  };
}
