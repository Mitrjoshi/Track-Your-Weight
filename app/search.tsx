import { ThemedView } from "@/components/ui/ThemedView";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchFood } from "@/service/hooks/useSearchFood";
import React, { useState } from "react";
import { FlatList, Image, Text, TextInput, View } from "react-native";

export default function Search() {
  const [text, setText] = useState("");
  const query = useDebounce(text);

  const { data, isLoading } = useSearchFood(query);

  return (
    <ThemedView className="flex-1 p-4">
      <TextInput
        placeholder="Search food (e.g. Amul milk)"
        value={text}
        onChangeText={setText}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      {isLoading && <Text>Searching…</Text>}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{ width: 48, height: 48, marginRight: 8 }}
              />
            )}
            <View>
              <Text>{item.name}</Text>
              <Text style={{ color: "#666" }}>
                {item.calories} kcal · P {item.protein}g · C {item.carbs}g · F{" "}
                {item.fat}g
              </Text>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}
