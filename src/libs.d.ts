declare module 'ml-array-mean' {
  function arrayMean(array: number[]): number;
  export = arrayMean;
}

declare module 'cephes' {
  export function fdtrc(d1: number, d2: number, fValue: number): number;
}
