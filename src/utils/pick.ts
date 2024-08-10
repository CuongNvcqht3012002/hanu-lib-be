/**
 * Creates a new object with only the specified properties included.
 *
 * @param data The source object
 * @param keys An array of keys to include in the result
 * @returns A new object with only the specified keys included
 *
 * @example
 * const user = { id: 1, name: 'John', password: 'secret' };
 * const publicUser = pick(user, ['id', 'name']);
 * console.log(publicUser); // { id: 1, name: 'John' }
 */
export function pick<T extends object, K extends keyof T>(data: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(([key]) => keys.includes(key as K))
  ) as Pick<T, K>
}
