export function hasStockData<T>(value: T | null | undefined): value is NonNullable<T> {
    if (value === null || value === undefined) return false
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object')
        return Object.values(value).some((v) => v !== null && v !== undefined)
    return true
}
