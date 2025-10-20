import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/utils/formatDates";
import React, { useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart as LINECHART } from "react-native-chart-kit";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";

export default function LineChart({ data }: { data: LineChartData }) {
  const textColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "input");
  const cardColor = useThemeColor({}, "icon");

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 48;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hideTimeout = useRef<number | null>(null);

  return (
    <LINECHART
      data={data}
      width={chartWidth}
      height={250}
      yAxisSuffix=" kg"
      withShadow={false}
      withInnerLines={true}
      withVerticalLines={false}
      transparent
      withVerticalLabels={false}
      chartConfig={{
        decimalPlaces: 1,
        color: () => COLORS.customPrimary,
        propsForHorizontalLabels: {
          fontWeight: 900,
          fontSize: 12,
          color: textColor,
        },
        propsForDots: {
          r: "4",
        },
        propsForLabels: {
          fontWeight: "900",
          color: textColor,
        },
      }}
      bezier
      onDataPointClick={({ index }) => {
        setSelectedIndex(index);

        // clear previous timeout (if still running)
        if (hideTimeout.current) clearTimeout(hideTimeout.current);

        // start a new timeout
        hideTimeout.current = setTimeout(() => {
          setSelectedIndex(null);
          hideTimeout.current = null;
        }, 1500);
      }}
      renderDotContent={({ x, y, index }) => {
        if (selectedIndex === index) {
          const value = data.datasets[0].data[index];
          const label = data.labels[index];
          const tooltipWidth = 70; // estimated tooltip width

          const adjustedLeft =
            x + tooltipWidth > chartWidth
              ? chartWidth - tooltipWidth - 8 // avoid going off right
              : Math.max(8, x - tooltipWidth / 2); // avoid going off left

          return (
            <View
              key={`tooltip-${index}`}
              style={{
                position: "absolute",
                top: y - 40,
                left: adjustedLeft,
                backgroundColor: cardColor,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: textColor,
                  fontWeight: "900",
                  fontSize: 14,
                }}
              >
                {value} kg
              </Text>
              <Text
                style={{
                  color: borderColor,
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                {formatDate(new Date(Number(label)))}
              </Text>
            </View>
          );
        }
        return null;
      }}
    />
  );
}
