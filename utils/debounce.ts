// // utils/debounce.ts
//
// type Procedure = (...args: any[]) => void;
//
// export function debounce<F extends Procedure>(
//   fn: F,
//   waitMilliseconds: number,
// ): (
//   this: ThisParameterType<F>,
//   ...args: Parameters<F>
// ) => void {
//   let timeoutId: ReturnType<typeof setTimeout> | undefined;
//
//   return function (
//     this: ThisParameterType<F>,
//     ...args: Parameters<F>
//   ) {
//     clearTimeout(timeoutId);
//
//     timeoutId = setTimeout(() => {
//       fn.apply(this, args);
//     }, waitMilliseconds);
//   };
// }

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}
