import { getNumbers, getClasses } from 'ml-dataset-iris';
import { Matrix } from 'ml-matrix';

import { oneWay } from '..';

import ToothGrowth from './ToothGrowth.json';

const irisData = new Matrix(getNumbers());
const irisClasses = getClasses();

test('throws with bad arguments', () => {
  // @ts-ignore
  expect(() => oneWay('str', [0])).toThrow(/data must be an array/);
  // @ts-ignore
  expect(() => oneWay([0], 'str')).toThrow(/classes must be an array/);
  expect(() => oneWay([0], [0, 1])).toThrow(
    /data must have the same length as classes/,
  );
  expect(() => oneWay([0, 1], [1, 1])).toThrow(
    /there must be at least two different classes/,
  );
  // @ts-ignore
  expect(() => oneWay([0, 1], [1, 2], { alpha: 'str' })).toThrow(
    /alpha must be a number/,
  );
});

test('Wikipedia example', () => {
  // Refs: https://en.wikipedia.org/wiki/One-way_analysis_of_variance#Example
  const data = [6, 8, 4, 5, 3, 4, 8, 12, 9, 11, 6, 8, 13, 9, 11, 8, 7, 12];
  const classes = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
  const result = oneWay(data, classes);
  expect(result.rejected).toBe(true);
  expect(result.pValue).toBeCloseTo(0.002399, 6);
  expect(result.testValue).toBeCloseTo(9.3, 1);
  expect(result.freedom).toStrictEqual([2, 15]);
});

test('iris dataset compared with R', () => {
  const result = oneWay(irisData.getColumn(0), irisClasses);
  expect(result.rejected).toBe(true);
  expect(result.freedom).toStrictEqual([2, 147]);
  expect(result.testValue).toBeCloseTo(119.3, 1);
  expect(result.pValue).toBeLessThan(2e-16);
});

test('tooth growth dataset compared with R', () => {
  const len = ToothGrowth.map((t) => t.len);
  const supp = ToothGrowth.map((t) => t.supp);
  const dose = ToothGrowth.map((t) => t.dose);

  const resultSupp = oneWay(len, supp);
  expect(resultSupp.rejected).toBe(false);
  expect(resultSupp.freedom).toStrictEqual([1, 58]);
  expect(resultSupp.testValue).toBeCloseTo(3.668, 1);
  expect(resultSupp.pValue).toBeCloseTo(0.0604, 4);

  const resultDose = oneWay(len, dose);
  expect(resultDose.rejected).toBe(true);
  expect(resultDose.freedom).toStrictEqual([2, 57]);
  expect(resultDose.testValue).toBeCloseTo(67.42, 2);
  expect(resultDose.pValue).toBeCloseTo(9.53e-16, 16);
});
