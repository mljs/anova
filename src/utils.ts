import * as cephes from 'cephes';

export interface IOneWayResult {
  rejected: boolean;
  testValue: number;
  pValue: number;
  freedom: [number, number];
}

export function getClassToIndexMap(
  classes: Set<unknown>,
): Map<unknown, number> {
  const classToIndex = new Map<unknown, number>();
  let i = 0;
  for (const klass of classes) {
    classToIndex.set(klass, i++);
  }
  return classToIndex;
}

export function getAnovaResult(
  df1: number,
  df2: number,
  fValue: number,
  alpha: number,
): IOneWayResult {
  const pValue = cephes.fdtrc(df1, df2, fValue);

  return {
    rejected: pValue < alpha,
    testValue: fValue,
    pValue,
    freedom: [df1, df2],
  };
}
