export type GTMWithoutPrefix<T extends string> = T extends `G-${infer R}` ? R : T
