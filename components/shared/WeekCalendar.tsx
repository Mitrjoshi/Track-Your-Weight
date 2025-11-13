import { COLORS } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";

type Props = {
  initialDate?: Date;
  daysBefore?: number;
  daysAfter?: number;
  onChange?: (date: Date) => void;
};

type DateItem = {
  id: string;
  date: Date;
};

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ITEM_WIDTH = 64;
const PILL_HEIGHT = 64;
const PILL_WIDTH = 50;

const ScrollableDateStrip: React.FC<Props> = ({
  initialDate = new Date(),
  daysBefore = 90,
  daysAfter = 90,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [monthDate, setMonthDate] = useState(initialDate);

  const titleColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "menu");

  const addDays = (d: Date, amount: number) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + amount);
    return nd;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const data: DateItem[] = useMemo(() => {
    const arr: DateItem[] = [];
    for (let i = -daysBefore; i <= daysAfter; i++) {
      const d = addDays(initialDate, i);
      arr.push({
        id: d.toISOString().slice(0, 10),
        date: d,
      });
    }
    return arr;
  }, [initialDate, daysBefore, daysAfter]);

  const initialIndex = daysBefore;

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
  };

  const renderItem: ListRenderItem<DateItem> = ({ item }) => {
    const d = item.date;
    const selected = isSameDay(d, selectedDate);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelect(d)}
        style={{
          width: ITEM_WIDTH,
          alignItems: "center",
        }}
      >
        <View
          className="rounded-[10px] flex justify-center items-center"
          style={{
            width: PILL_WIDTH,
            height: PILL_HEIGHT,
            backgroundColor: selected ? COLORS.customPrimary : cardColor,
          }}
        >
          <ThemedText
            style={{
              color: selected ? "black" : titleColor,
            }}
            className="font-bold text-xl"
          >
            {d.getDate()}
          </ThemedText>
          <ThemedText
            style={{
              color: selected ? "black" : titleColor,
            }}
            className="font-semibold text-sm"
          >
            {WEEK_DAYS[d.getDay()]}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  // -------- change month as you scroll ----------
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems || viewableItems.length === 0) return;

      // pick the "middle" visible item
      const middleIndex = Math.floor(viewableItems.length / 2);
      const middle = viewableItems[middleIndex];
      const item = middle.item as DateItem;

      // update month label using that item's date
      setMonthDate(item.date);
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const monthLabel = `${
    MONTH_NAMES[monthDate.getMonth()]
  } ${monthDate.getFullYear()}`;

  return (
    <View className="flex gap-4">
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: titleColor,
        }}
      >
        {monthLabel}
      </Text>

      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
        }}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

export default ScrollableDateStrip;
