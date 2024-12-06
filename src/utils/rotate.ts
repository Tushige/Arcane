export function rotatePath(xdeg, ydeg, originalPath) {
  // Convert degrees to radians
  const xrad = (xdeg * Math.PI) / 180;
  const yrad = (ydeg * Math.PI) / 180;

  // Function to rotate a point around the X-axis (tilting the shape up/down)
  function rotateX(x, y, z, angle) {
    const cosX = Math.cos(angle);
    const sinX = Math.sin(angle);
    const newY = y * cosX - z * sinX;
    const newZ = y * sinX + z * cosX;
    return [x, newY, newZ];
  }

  // Function to rotate a point around the Y-axis (tilting the shape left/right)
  function rotateY(x, y, z, angle) {
    const cosY = Math.cos(angle);
    const sinY = Math.sin(angle);
    const newX = x * cosY + z * sinY;
    const newZ = -x * sinY + z * cosY;
    return [newX, y, newZ];
  }

  // Helper function to apply the rotations and return the new coordinates
  function rotatePoint(x, y, angleX, angleY, cx, cy) {
    // Translate point to origin
    const translatedX = x - cx;
    const translatedY = y - cy;

    // Rotate first around the X-axis, then around the Y-axis
    const [rotatedX, rotatedY, rotatedZ] = rotateX(translatedX, translatedY, 0, angleX); // Assume z = 0
    const [finalX, finalY] = rotateY(rotatedX, rotatedY, rotatedZ, angleY);

    // Translate point back to original position
    return [finalX + cx, finalY + cy];
  }

  // Split the original path into commands (M, L, C, Q, Z)
  const pathData = originalPath.match(/[MLCQTAZ][^MLCQTAZ]*/g); 
  let newPath = '';

  // Get the bounding box of the path to find the center point (cx, cy)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  // Find the bounding box of the path
  pathData.forEach(segment => {
    const command = segment[0]; // 'M', 'L', etc.

    // Skip Z commands; they are used to close the path and do not have coordinates
    if (command === 'Z') return;

    const points = segment.slice(1).trim().split(/\s+/).map(parseFloat);
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  });

  // Center point of the bounding box
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  pathData.forEach(segment => {
    const command = segment[0]; // 'M', 'L', etc.

    // Skip Z commands; they are used to close the path and do not have coordinates
    if (command === 'Z') {
      newPath += ' Z';
      return;
    }

    const points = segment.slice(1).trim().split(/\s+/).map(parseFloat);

    // Apply rotation for each pair of x, y coordinates
    let transformedPoints = [];
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      const signedYRad = x < cx ? -yrad : yrad;
      const signedXRad = y < cy ? -xrad : xrad;
      const [newX, newY] = rotatePoint(x, y, xrad, yrad, cx, cy);
      transformedPoints.push(`${newX} ${newY}`);
    }
    newPath += `${command} ${transformedPoints.join(' ')} `;
  });

  return newPath.trim();
}