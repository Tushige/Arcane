
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

/**
 * SALVAGED
 */

// Function to generate an SVG path based on vertices and border radius
export function generatePath(vertices, borderRadius) {
  const pathCommands = [];
  const numVertices = vertices.length;

  for (let i = 0; i < numVertices; i++) {
      const prevVertex = i > 0 ? vertices[i - 1] : vertices[numVertices - 1];
      const currentVertex = vertices[i];
      const nextVertex = i < numVertices - 1 ? vertices[i + 1] : vertices[0];

      // Calculate the direction vectors between vertices
      const prevToCurrent = {
          x: prevVertex.x - currentVertex.x,
          y: prevVertex.y - currentVertex.y
      };
      const currentToNext = {
          x: nextVertex.x - currentVertex.x,
          y: nextVertex.y - currentVertex.y
      };

      // Calculate lengths of the edges
      const prevToCurrentLength = Math.sqrt(prevToCurrent.x ** 2 + prevToCurrent.y ** 2);
      const currentToNextLength = Math.sqrt(currentToNext.x ** 2 + currentToNext.y ** 2);

      // Calculate the angle between edges
      const crossProduct = prevToCurrent.x * currentToNext.y - prevToCurrent.y * currentToNext.x;
      const dotProduct = prevToCurrent.x * currentToNext.x + prevToCurrent.y * currentToNext.y;
      const angleBetween = Math.atan2(crossProduct, dotProduct);
      const angle = Math.PI - Math.abs(angleBetween);

      // Adjust border radius based on the angle
      if (borderRadius / Math.sin(angle / 2) * Math.cos(angle / 2) > Math.min(prevToCurrentLength / 2, currentToNextLength / 2)) {
          borderRadius = Math.min(prevToCurrentLength, currentToNextLength) / (2 * Math.cos(angle / 2));
      }

      // Calculate control points for the curve
      const midpointPrevCurrent = {
          x: (prevVertex.x + currentVertex.x) / 2,
          y: (prevVertex.y + currentVertex.y) / 2
      };
      const midpointCurrentNext = {
          x: (currentVertex.x + nextVertex.x) / 2,
          y: (currentVertex.y + nextVertex.y) / 2
      };

      const distancePrevToMid = Math.sqrt((currentVertex.x - midpointPrevCurrent.x) ** 2 + (currentVertex.y - midpointPrevCurrent.y) ** 2);
      const distanceNextToMid = Math.sqrt((nextVertex.x - midpointCurrentNext.x) ** 2 + (nextVertex.y - midpointCurrentNext.y) ** 2);

      const scalePrevToMid = borderRadius / distancePrevToMid;
      const scaleNextToMid = borderRadius / distanceNextToMid;

      // Calculate the adjusted control points
      const controlPointPrev = {
          x: currentVertex.x + prevToCurrent.x * scalePrevToMid,
          y: currentVertex.y + prevToCurrent.y * scalePrevToMid
      };
      const controlPointNext = {
          x: currentVertex.x + currentToNext.x * scaleNextToMid,
          y: currentVertex.y + currentToNext.y * scaleNextToMid
      };

      // Add path commands for this segment
      if (i === 0) {
          pathCommands.push(`M${controlPointPrev.x},${controlPointPrev.y}`);
      }
      pathCommands.push(`L${controlPointPrev.x},${controlPointPrev.y}`);
      pathCommands.push(`Q${currentVertex.x},${currentVertex.y},${controlPointNext.x},${controlPointNext.y}`);
  }

  pathCommands.push("Z");
  return pathCommands.join(" ");
}
