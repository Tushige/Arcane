export function throttle(func, wait) {
  let isLocked = false;
  return function(...args) {
    if (isLocked) return;
    isLocked = true;
    setTimeout(() => isLocked = false, wait);
    return func.call(this, ...args);
  } 
}