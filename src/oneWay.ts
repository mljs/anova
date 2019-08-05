import arrayMean from 'ml-array-mean';

import { getClassToIndexMap, IAnovaResult, getAnovaResult } from './utils';

export interface IOneWayOptions {
  alpha?: number;
}

export function oneWay(
  data: number[],
  classes: unknown[],
  options: IOneWayOptions = {},
): IAnovaResult {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an array');
  }
  if (!Array.isArray(classes)) {
    throw new TypeError('classes must be an array');
  }
  if (data.length !== classes.length) {
    throw new RangeError('data must have the same length as classes');
  }

  const { alpha = 0.05 } = options;

  if (typeof alpha !== 'number') {
    throw new TypeError('alpha must be a number');
  }

  const allClasses = new Set(classes);
  const numClasses = allClasses.size;

  if (numClasses < 2) {
    throw new RangeError('there must be at least two different classes');
  }

  const classToIndex = getClassToIndexMap(allClasses);

  const d1 = numClasses - 1;
  const d2 = data.length - numClasses;

  const allData: number[][] = new Array(numClasses);
  for (let i = 0; i < numClasses; i++) {
    allData[i] = [];
  }

  for (let i = 0; i < data.length; i++) {
    const index = classToIndex.get(classes[i]) as number;
    allData[index].push(data[i]);
  }

  const means = allData.map((classData) => arrayMean(classData));
  const totalMean = arrayMean(data);

  let betweenGroups = 0;
  for (let i = 0; i < numClasses; i++) {
    betweenGroups += allData[i].length * (means[i] - totalMean) ** 2;
  }
  betweenGroups /= d1;

  const centered = allData.map((groupData, i) =>
    groupData.map((datum) => datum - means[i]),
  );

  let withinGroup = centered.reduce(
    (total, groupCentered) =>
      total + groupCentered.reduce((total2, c) => total2 + c ** 2, 0),
    0,
  );
  withinGroup /= d2;

  const fValue = betweenGroups / withinGroup;
  return getAnovaResult(d1, d2, fValue, alpha);
}
