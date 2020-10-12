import * as cephes from 'cephes';

export interface IAnovaResult {
  rejected: boolean;
  testValue: number;
  pValue: number;
  freedom: [number, number];
}

/**
 * @private
 */
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

/**
 * @private
 */
export function getAnovaResult(
  df1: number,
  df2: number,
  fValue: number,
  alpha: number,
): IAnovaResult {
  const pValue = cephes.fdtrc(df1, df2, fValue);

  return {
    rejected: pValue < alpha,
    testValue: fValue,
    pValue,
    freedom: [df1, df2],
  };
}

/**
 * @private
 */
export function calcWithinGroup(allData: number[][], means: number[]): number {
  const centered = allData.map((groupData, i) =>
    groupData.map((datum) => datum - means[i]),
  );

  let withinGroup = centered.reduce(
    (total, groupCentered) =>
      total + groupCentered.reduce((total2, c) => total2 + c ** 2, 0),
    0,
  );
  return withinGroup;
}

/**
 * @private
 */
export function calcBetweenGroups(
  allData: number[][],
  means: number[],
  totalMean: number,
): number {
  let betweenGroups = 0;
  for (let i = 0; i < means.length; i++) {
    betweenGroups += allData[i].length * (means[i] - totalMean) ** 2;
  }
  return betweenGroups;
}

/**
 * @private
 */
export function getDataByClass(
  data: number[],
  classes: unknown[],
): {
  dataByClass: number[][];
  allClasses: Set<unknown>;
} {
  const allClasses = new Set(classes);
  if (allClasses.size < 2) {
    throw new RangeError('there must be at least two different classes');
  }
  const classToIndex = getClassToIndexMap(allClasses);
  const allData: number[][] = new Array(allClasses.size);
  for (let i = 0; i < allClasses.size; i++) {
    allData[i] = [];
  }

  for (let i = 0; i < data.length; i++) {
    const index = classToIndex.get(classes[i]) as number;
    allData[index].push(data[i]);
  }
  return {
    dataByClass: allData,
    allClasses,
  };
}
