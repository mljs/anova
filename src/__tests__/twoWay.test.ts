import { twoWay } from '..';

import toothGrowth from './ToothGrowth.json';

test('throws with bad arguments', () => {
  // @ts-ignore
  expect(() => twoWay('str', [0])).toThrow(/data must be an array/);
  // @ts-ignore
  expect(() => twoWay([0], 'str')).toThrow(/classesA must be an array/);
  // @ts-ignore
  expect(() => twoWay([0], [0], 'str')).toThrow(/classesB must be an array/);

  expect(() => twoWay([0], [0, 1], [0])).toThrow(
    /data must have the same length as classesA/,
  );
  expect(() => twoWay([0], [0], [0, 1])).toThrow(
    /data must have the same length as classesB/,
  );
  expect(() => twoWay([0, 1], [1, 1], [0, 1])).toThrow(
    /there must be at least two different classes in classesA/,
  );
  expect(() => twoWay([0, 1], [0, 1], [1, 1])).toThrow(
    /there must be at least two different classes in classesB/,
  );
  // @ts-ignore
  expect(() => twoWay([0, 1], [1, 2], [1, 2], { alpha: 'str' })).toThrow(
    /options\.alpha must be a number/,
  );
  // @ts-ignore
  expect(() => twoWay([0, 1], [1, 2], [1, 2], { interaction: 'str' })).toThrow(
    /options\.interaction must be a boolean/,
  );
});

test('tooth growth dataset compared with R - with interaction', () => {
  const len = toothGrowth.map((t) => t.len);
  const supp = toothGrowth.map((t) => t.supp);
  const dose = toothGrowth.map((t) => t.dose);

  const { classA, classB, interaction } = twoWay(len, supp, dose);

  expect(classA.rejected).toBe(true);
  expect(classA.pValue).toBeCloseTo(0.000231, 6);
  expect(classA.testValue).toBeCloseTo(15.572, 3);
  expect(classA.freedom).toStrictEqual([1, 54]);

  expect(classB.rejected).toBe(true);
  expect(classB.pValue).toBeLessThan(2e-16);
  expect(classB.testValue).toBeCloseTo(92, 3);
  expect(classB.freedom).toStrictEqual([2, 54]);

  expect(interaction.rejected).toBe(true);
  expect(interaction.pValue).toBeCloseTo(0.02186, 6);
  expect(interaction.testValue).toBeCloseTo(4.107, 3);
  expect(interaction.freedom).toStrictEqual([2, 54]);
});

test('tooth growth dataset compared with R - without interaction', () => {
  const len = toothGrowth.map((t) => t.len);
  const supp = toothGrowth.map((t) => t.supp);
  const dose = toothGrowth.map((t) => t.dose);

  const { classA, classB } = twoWay(len, supp, dose, { interaction: false });

  expect(classA.rejected).toBe(true);
  expect(classA.pValue).toBeCloseTo(0.000429, 6);
  expect(classA.testValue).toBeCloseTo(14.02, 2);
  expect(classA.freedom).toStrictEqual([1, 56]);

  expect(classB.rejected).toBe(true);
  expect(classB.pValue).toBeLessThan(2e-16);
  expect(classB.testValue).toBeCloseTo(82.81, 2);
  expect(classB.freedom).toStrictEqual([2, 56]);
});
