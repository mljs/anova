import { getNumbers, getClasses } from 'ml-dataset-iris';
import { Matrix } from 'ml-matrix';

import { oneWay } from '..';

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
