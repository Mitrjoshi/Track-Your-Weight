export function flattenTable<T extends object>(table: Record<string, T>): T[] {
  let result = Object.values(table);

  return result;
}
