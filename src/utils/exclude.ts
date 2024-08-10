/**
 * Creates a new object with specified properties excluded.
 *
 * @param data The source object
 * @param keys An array of keys to exclude from the result
 * @returns A new object with the specified keys excluded
 *
 * @example
 * const user = { id: 1, name: 'John', password: 'secret' };
 * const safeUser = exclude(user, ['password']);
 * console.log(safeUser); // { id: 1, name: 'John' }
 */
export function exclude<T extends object, K extends keyof T>(data: T, keys: K[]): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>
}
