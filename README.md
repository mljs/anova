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
