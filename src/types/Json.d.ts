// A value that survives JSON serialisation unchanged, as stored in jsonb columns
export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue }

// Accepted by JSON.stringify: object properties set to `undefined` are dropped from the output
export type JsonSerializable =
    | string
    | number
    | boolean
    | null
    | JsonSerializable[]
    | { [key: string]: JsonSerializable | undefined }
