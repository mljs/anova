import arrayMean from 'ml-array-mean';

import { getAnovaResult, IOneWayResult } from './utils';

export interface ITwoWayOptions {
  alpha?: number;
}

export interface ITwoWayResult {
  classA: IOneWayResult;
  classB: IOneWayResult;
  interaction: IOneWayResult;
}

export function twoWay(
  data: number[],
  classesA: unknown[],
  classesB: unknown[],
  options: ITwoWayOptions = {},
): ITwoWayResult {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an array');
  }
  if (!Array.isArray(classesA)) {
    throw new TypeError('classesA must be an array');
  }
  if (!Array.isArray(classesB)) {
    throw new TypeError('classesB must be an array');
  }
  if (data.length !== classesA.length) {
    throw new RangeError('data must have the same length as classesA');
  }
  if (data.length !== classesB.length) {
    throw new RangeError('data must have the same length as classesB');
  }

  const { alpha = 0.05 } = options;

  if (typeof alpha !== 'number') {
    throw new TypeError('alpha must be a number');
  }

  const allClassesA = new Set(classesA);
  const a = allClassesA.size;

  if (a < 2) {
    throw new RangeError(
      'there must be at least two different classes in classesA',
    );
  }

  const allClassesB = new Set(classesB);
  const b = allClassesB.size;

  if (b < 2) {
    throw new RangeError(
      'there must be at least two different classes in classesB',
    );
  }

  const data3d = new Map<unknown, Map<unknown, number[]>>();
  const dataA = new Map<unknown, number[]>();
  const dataB = new Map<unknown, number[]>();
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    const classA = classesA[i];
    const classB = classesB[i];

    if (!dataA.has(classA)) {
      dataA.set(classA, []);
    }
    if (!dataB.has(classB)) {
      dataB.set(classB, []);
    }

    let data1 = data3d.get(classA);
    if (data1 === undefined) {
      data1 = new Map<unknown, number[]>();
      data3d.set(classA, data1);
    }
    let data2 = data1.get(classB);
    if (data2 === undefined) {
      data2 = [];
      data1.set(classB, data2);
    }
    data2.push(datum);
  }

  let r = -1;
  for (const [key1, data1] of data3d) {
    const datumA = dataA.get(key1) as number[];
    for (const [key2, data2] of data1) {
      const datumB = dataB.get(key2) as number[];
      datumA.push(...data2);
      datumB.push(...data2);
      if (r === -1) {
        r = data2.length;
      } else if (r !== data2.length) {
        throw new RangeError(
          `only balanced designs are supported. Expected ${r} values for class1=${key1}, class2=${key2}`,
        );
      }
    }
  }

  const totalMean = arrayMean(data);

  let ssWithin = 0;
  for (const data1 of data3d.values()) {
    for (const data2 of data1.values()) {
      const mean = arrayMean(data2);
      for (const value of data2) {
        ssWithin += Math.pow(value - mean, 2);
      }
    }
  }
  const dfWithin = (r - 1) * a * b;
  const msWithin = ssWithin / dfWithin;

  let ssA = 0;
  for (const datumA of dataA.values()) {
    const meanA = arrayMean(datumA);
    ssA += Math.pow(meanA - totalMean, 2);
  }
  ssA = r * b * ssA;
  const dfA = a - 1;
  const msA = ssA / dfA;

  let ssB = 0;
  for (const datumB of dataB.values()) {
    const meanB = arrayMean(datumB);
    ssB += Math.pow(meanB - totalMean, 2);
  }
  ssB = r * a * ssB;
  const dfB = b - 1;
  const msB = ssB / dfB;

  let ssInteraction = 0;
  for (const [keyA, data1] of data3d) {
    const meanA = arrayMean(dataA.get(keyA) as number[]);
    for (const [keyB, data2] of data1) {
      const meanB = arrayMean(dataB.get(keyB) as number[]);
      const interMean = arrayMean(data2);
      ssInteraction += Math.pow(interMean - meanA - meanB + totalMean, 2);
    }
  }
  ssInteraction = r * ssInteraction;
  const dfInteraction = (a - 1) * (b - 1);
  const msInteraction = ssInteraction / dfInteraction;

  const fA = msA / msWithin;
  const fB = msB / msWithin;
  const fInteraction = msInteraction / msWithin;

  return {
    classA: getAnovaResult(dfA, dfWithin, fA, alpha),
    classB: getAnovaResult(dfB, dfWithin, fB, alpha),
    interaction: getAnovaResult(dfInteraction, dfWithin, fInteraction, alpha),
  };
}
