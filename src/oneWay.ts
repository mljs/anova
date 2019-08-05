import arrayMean from 'ml-array-mean';

import {
  IAnovaResult,
  getAnovaResult,
  calcBetweenGroups,
  calcWithinGroup,
  getDataByClass,
} from './utils';

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

  const { dataByClass, allClasses } = getDataByClass(data, classes);
  const numClasses = allClasses.size;
  const d1 = numClasses - 1;
  const d2 = data.length - numClasses;
  const means = dataByClass.map((classData) => arrayMean(classData));
  const totalMean = arrayMean(data);

  let betweenGroups = calcBetweenGroups(dataByClass, means, totalMean) / d1;

  const withinGroup = calcWithinGroup(dataByClass, means) / d2;

  const fValue = betweenGroups / withinGroup;
  return getAnovaResult(d1, data.length - numClasses, fValue, alpha);
}
