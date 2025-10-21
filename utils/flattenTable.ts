export function flattenTable<T extends object>(
  table: Record<string, T>
): (T & { id: string })[] {
  return Object.entries(table).map(([id, data]) => ({
    id, // <-- include the Tinybase row ID
    ...data,
  }));
}
