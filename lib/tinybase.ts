import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import { createQueries, createStore } from "tinybase";

const store = createStore();
const queries = createQueries(store);

const LOCALSTORE_KEY = "tinybase_store_web";
const STORE_PATH = FileSystem.documentDirectory + "tinybase.json";

export const loadStore = async () => {
  try {
    if (Platform.OS === "web") {
      const json = localStorage.getItem(LOCALSTORE_KEY);
      if (json) {
        store.setJson(JSON.parse(json));
        console.log("TinyBase (Web): Loaded store");
      } else {
        console.log("TinyBase (Web): No previous data");
      }
    } else {
      const json = await FileSystem.readAsStringAsync(STORE_PATH);
      store.setJson(JSON.parse(json));
      console.log("TinyBase (Native): Loaded store");
    }
  } catch (e) {
    console.log("TinyBase: No previous data or failed to load");
  }
};

export const saveStore = async () => {
  const json = JSON.stringify(store.getJson());
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(LOCALSTORE_KEY, json);
      console.log("TinyBase (Web): Saved store");
    } else {
      await FileSystem.writeAsStringAsync(STORE_PATH, json);
      console.log("TinyBase (Native): Saved store");
    }
  } catch (error) {
    console.error("TinyBase: Save failed", error);
  }
};

export const deleteTables = async () => {
  try {
    store.delTables();
    await saveStore();
    console.log("TinyBase: Deleted all tables");
  } catch (error) {
    console.error("TinyBase: Failed to delete tables", error);
  }
};

const debounce = (fn: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(), delay);
  };
};

const debouncedSaveStore = debounce(saveStore, 500);
const debouncedDeleteStore = debounce(deleteTables, 500);

store.addTablesListener(() => {
  debouncedSaveStore();
  // debouncedDeleteStore(); // Uncomment if needed
});

export { queries, store };
