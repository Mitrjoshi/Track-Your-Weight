import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Text, View } from "react-native";

interface BMIScaleProps {
  bmi: number;
}

export const BMIGauge: React.FC<BMIScaleProps> = ({ bmi }) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const ranges = [
    { min: 12, max: 18.5, color: "#feee68", label: "Underweight" },
    { min: 18.5, max: 25, color: "#62a900", label: "Normal" },
    { min: 25, max: 30, color: "#ebad42", label: "Overweight" },
    { min: 30, max: 35, color: "#e76a49", label: "Class I Obesity" },
    { min: 35, max: 40, color: "#b92225", label: "Class II Obesity" },
  ];

  const getBMIInfo = (bmi: number) => {
    const range = ranges.find((r) => bmi >= r.min && bmi < r.max);
    return range
      ? { label: range.label, color: range.color }
      : { label: bmi < 18.5 ? "Underweight" : "Overweight", color: "#D32F2F" };
  };

  const { label, color } = getBMIInfo(bmi);

  const position = Math.min(Math.max((bmi / 50) * 100, 0), 100);

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        width: "100%",
        alignSelf: "center",
      }}
    >
      {/* Top BMI display */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            color,
          }}
          className="text-7xl font-extrabold"
        >
          {bmi.toFixed(1)}
        </Text>
        <View style={{ marginLeft: 8 }}>
          <Text
            style={{
              color: textColor,
            }}
            className="font-bold text-2xl"
          >
            BMI
          </Text>
          <Text
            style={{
              color: textColor,
            }}
            className="font-bold text-2xl"
          >
            {label}
          </Text>
        </View>
      </View>

      {/* Bar segments */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 10,
          gap: 4,
        }}
      >
        {ranges.map((r, i) => (
          <View
            key={i}
            style={{
              flex: r.max - r.min,
              backgroundColor: r.color,
              borderRadius: 8,
            }}
          />
        ))}
      </View>

      {/* Marker */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          left: `${position}%`,
          transform: [{ translateX: -8 }],
        }}
      >
        <View
          style={{
            width: 2,
            height: 20,
            backgroundColor: textColor,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Labels below */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          marginTop: 8,
        }}
      >
        {ranges.map((r, i) => (
          <View
            key={i}
            style={{
              flex: r.max - r.min,
            }}
          >
            <Text
              style={{ color: r.color, fontWeight: 700 }}
              className="w-full text-center"
            >
              {r.max}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
