import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Dimensions } from "react-native";
import { LineChart as LINECHART } from "react-native-chart-kit";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

export default function LineChart({ data }: { data: LineChartData }) {
  const backgroundColor = useThemeColor({}, "background");
  const screenWidth = Dimensions.get("window").width;

  return (
    <>
      <LINECHART
        data={data}
        width={screenWidth - 48}
        height={250}
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundGradientFrom: backgroundColor,
          backgroundGradientTo: backgroundColor,
          decimalPlaces: 1,
          color: () => `#007AFF`,
          propsForBackgroundLines: {
            stroke: "#007AFF00",
          },
          propsForHorizontalLabels: {
            fontWeight: 900,
            fontSize: 10,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "1",
            stroke: "#007AFF12",
          },
        }}
        bezier
      />
    </>
  );
}
