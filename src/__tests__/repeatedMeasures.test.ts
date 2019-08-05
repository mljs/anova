import { repeatedMeasures } from '..';

test('check passed arguments', () => {
  expect(() => {
    expect(() => {
      repeatedMeasures([1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3]);
    }).toThrow('data must have the same length as subject classes');

    repeatedMeasures([1, 2, 3, 4], [1, 2, 3], [1, 2, 3, 4]);
  }).toThrow('data must have the same length as condition classes');

  expect(() => repeatedMeasures([0, 1], [1, 1], [0, 1])).toThrow(
    /there must be at least two different classes/,
  );

  expect(() => repeatedMeasures([0, 1], [0, 1], [1, 1])).toThrow(
    /there must be at least two different classes/,
  );

  // @ts-ignore
  expect(() => repeatedMeasures('str', [0], [0])).toThrow(
    /data must be an array/,
  );
  // @ts-ignore
  expect(() => repeatedMeasures([0], 'str', [0])).toThrow(
    /condition classes must be an array/,
  );
  // @ts-ignore
  expect(() => repeatedMeasures([0], [0], 'str')).toThrow(
    /subject classes must be an array/,
  );

  expect(() =>
    // @ts-ignore
    repeatedMeasures([0, 1], [1, 2], [2, 3], { alpha: 'str' }),
  ).toThrow(/alpha must be a number/);
});

test('example from https://statistics.laerd.com/statistical-guides/repeated-measures-anova-statistical-guide.php', () => {
  const patients = [
    '1',
    '1',
    '1',
    '2',
    '2',
    '2',
    '3',
    '3',
    '3',
    '4',
    '4',
    '4',
    '5',
    '5',
    '5',
    '6',
    '6',
    '6',
  ];

  const values = [
    45,
    50,
    55,
    42,
    42,
    45,
    36,
    41,
    43,
    39,
    35,
    40,
    51,
    55,
    59,
    44,
    49,
    56,
  ];

  const time = [
    'pre',
    '3month',
    '6months',
    'pre',
    '3month',
    '6months',
    'pre',
    '3month',
    '6months',
    'pre',
    '3month',
    '6months',
    'pre',
    '3month',
    '6months',
    'pre',
    '3month',
    '6months',
  ];

  const result = repeatedMeasures(values, time, patients, { alpha: 0.05 });
  expect(result.rejected).toBe(true);
  expect(result.pValue).toBeCloseTo(0.0018856, 6);
});
