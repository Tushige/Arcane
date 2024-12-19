
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function throttle(func, wait) {
  let isLocked = false;
  return function(...args) {
    if (isLocked) return;
    isLocked = true;
    setTimeout(() => isLocked = false, wait);
    return func.call(this, ...args);
  } 
}

export const degToRad = (deg: number) => {
  return Number.parseFloat(Number.parseFloat(deg * Math.PI / 180).toFixed(2));
}

export const calculateSVGPath = (vw: number, vh: number, length: number, offset = 10) => {
  const x = vw/2 + length/2;
  const y = vh/2 - length /2;
  const path = `M ${x} ${y} Q ${x+offset} ${y} ${x+offset} ${y+offset} L ${x+offset} ${y+length} Q ${x+offset} ${y+length+offset} ${x} ${y+length+offset} L ${x-length} ${y+length+offset} Q ${x-length-offset} ${y+length+offset} ${x-length-offset} ${y+length} L ${x-length-offset} ${y+offset} Q ${x-length-offset} ${y} ${x-length} ${y} Z`
  return path;
}

export const calculateFullScreenSVGPath = (vw: number, vh: number) => {
  const x = vw;
  const y = 0;
  const offset = 1;
  
  const path = `
    M ${0} ${0} 
    Q ${x+offset} ${y} ${x+offset} ${y+offset} 
    L ${x+offset} ${y+vh} 
    Q ${x+offset} ${y+vh+offset} ${x} ${y+vh+offset} 
    L ${x-vw} ${y+vh+offset} 
    Q ${x-vw-offset} ${y+vh+offset} ${x-vw-offset} ${y+vh} 
    L ${x-vw-offset} ${y+offset} 
    Q ${x-vw-offset} ${y} ${x-vw} ${y} 
    Z
  `.replace(/\n/g, '').trim();
  return path;
}

export const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Check if the user agent matches common mobile devices
  return /android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent);
}