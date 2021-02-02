/**
 * Like record, but readonly.
 */
export type ReadonlyRecord<k extends keyof any, v> = Readonly<Record<k, v>>;
