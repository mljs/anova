import arrayMean from 'ml-array-mean';

import {
  getAnovaResult,
  IAnovaResult,
  getDataByClass,
  calcWithinGroup,
  calcBetweenGroups,
} from './utils';

export function repeatedMeasures(
  data: number[],
  conditionsClasses: unknown[],
  subjectClasses: unknown[],
  options: { alpha?: number } = {},
): IAnovaResult {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an array');
  }
  if (!Array.isArray(conditionsClasses)) {
    throw new TypeError('condition classes must be an array');
  }
  if (!Array.isArray(subjectClasses)) {
    throw new TypeError('subject classes must be an array');
  }
  if (data.length !== conditionsClasses.length) {
    throw new RangeError('data must have the same length as condition classes');
  }
  if (data.length !== subjectClasses.length) {
    throw new RangeError('data must have the same length as subject classes');
  }

  const { alpha = 0.05 } = options;

  if (typeof alpha !== 'number') {
    throw new TypeError('alpha must be a number');
  }

  const allConditionClasses = new Set(conditionsClasses);

  if (allConditionClasses.size < 2) {
    throw new RangeError(
      'there must be at least two different classes in conditions',
    );
  }

  const allSubjectClasses = new Set(subjectClasses);

  if (allSubjectClasses.size < 2) {
    throw new RangeError(
      'there must be at least two different classes in subjects',
    );
  }

  const totalMean = arrayMean(data);
  const {
    dataByClass: dataByCondition,
    allClasses: allConditions,
  } = getDataByClass(data, conditionsClasses);
  const {
    dataByClass: dataBySubject,
    allClasses: allSubjects,
  } = getDataByClass(data, subjectClasses);

  const meansByCondition = dataByCondition.map((classData) =>
    arrayMean(classData),
  );
  const meansBySubject = dataBySubject.map((classData) => arrayMean(classData));
  const withinConditions = calcWithinGroup(dataByCondition, meansByCondition);

  const betweenConditions = calcBetweenGroups(
    dataByCondition,
    meansByCondition,
    totalMean,
  );

  const betweenSubjects = calcBetweenGroups(
    dataBySubject,
    meansBySubject,
    totalMean,
  );

  const d1 = allConditions.size - 1;
  const d2 = d1 * (allSubjects.size - 1);
  const F =
    betweenConditions / d1 / ((withinConditions - betweenSubjects) / d2);

  return getAnovaResult(d1, d2, F, alpha);
}
