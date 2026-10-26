/**
 * Narrow an external string to a key of a literal lookup table. Only own keys
 * match, so inherited names such as `constructor` never resolve to a value.
 */
export const hasOwnKey = <T extends Record<string, unknown>>(
    table: T,
    key: string
): key is Extract<keyof T, string> => Object.hasOwn(table, key)
