# anova

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Analysis of variance (ANOVA).

## Installation

`$ npm i ml-anova`

## Usage

### One-way ANOVA

```js
import { oneWay } from 'ml-anova';

const data = [6, 8, 4, 5, 3, 4, 8, 12, 9, 11, 6, 8, 13, 9, 11, 8, 7, 12];
const classes = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];

const result = oneWay(data, classes, { alpha: 0.05 }); // 0.05 is the default value for the alpha option
/*
  {
    rejected: true, // The null hypothesis has been rejected at the 5% significance level.
    pValue: 0.0023987773293929083,
    testValue: 9.264705882352942,
    freedom: [2, 15]
  }
*/
```

### Repeated measures ANOVA

````js
import {repeatedMeasures} from 'ml-anova';

  const data = [45, 50, 55, 42, 42, 45, 36, 41, 43, 39, 35, 40, 51, 55, 59, 44, 49, 56];
  const patients = [1 ,1 ,1 ,2 ,2 ,2 ,3 ,3 ,3 ,4, 4, 4, 5,5 ,5 ,6 ,6 ,6 ];
  const time = [
    'pre','3month','6months','pre','3month','6months','pre','3month','6months','pre','3month','6months','pre','3month','6months','pre','3month','6months'
  ];

  const result = repeatedMeasures(data, time, patients, { alpha: 0.05 });
  /*
    {
      rejected: true,
      testValue: 12.53398058252424,
      pValue: 0.0018855906470255546,
      freedom: [ 2, 10 ]
    }
  */


### Two-way ANOVA

**Note:** Unbalanced designs are not supported.

```js
import { twoWay } from 'ml-anova';

const data = [1, 2, 1, 3, 4, 5, 9, 10, 11];
const classesA = ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C'];
const classesB = ['X', 'X', 'X', 'X', 'X', 'X', 'Y', 'Y', 'Y'];

const result = twoWay(data, classesA, classesB, { alpha: 0.05 });
/*
{
  classA: {
    rejected: true,
    testValue: 304,
    pValue: 5.256992280576244e-11,
    freedom: [ 2, 12 ]
  },
  classB: {
    rejected: true,
    testValue: 691.4285714285716,
    pValue: 5.601171179813454e-12,
    freedom: [ 1, 12 ]
  },
  interaction: {
    rejected: true,
    testValue: 138.28571428571433,
    pValue: 5.170916200594281e-9,
    freedom: [ 2, 12 ]
  }
}
*/
````

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-anova.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ml-anova
[travis-image]: https://img.shields.io/travis/com/mljs/anova/master.svg?style=flat-square
[travis-url]: https://travis-ci.com/mljs/anova
[codecov-image]: https://img.shields.io/codecov/c/github/mljs/anova.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/mljs/anova
[download-image]: https://img.shields.io/npm/dm/ml-anova.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/ml-anova
