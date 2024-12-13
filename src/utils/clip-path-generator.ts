import {Vector3, Euler} from 'three';

// Function to generate an SVG path based on vertices and border radius
function generatePath(vertices, borderRadius) {
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

// Function to update the vertices based on 3D transformations and focal length
function updateVertices({vertices = [], projectedPoints = [], origin = new Vector3(), focalLength = 800} = {}) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const depth = focalLength / (focalLength + (vertex.z + origin.z));
        const projectedPoint = projectedPoints[i];

        projectedPoint.x = origin.x + vertex.x * depth;
        projectedPoint.y = origin.y + vertex.y * depth;
        minX = Math.min(minX, projectedPoint.x);
        maxX = Math.max(maxX, projectedPoint.x);
        minY = Math.min(minY, projectedPoint.y)
        maxY = Math.max(maxY, projectedPoint.y);
    }
    // console.log(`width: ${maxX - minX}`)
    // console.log(`height: ${maxY - minY}`);
}

// Function to handle transformations and update the clip-path
const ClipPathGenerator = ({ focalLength = 800 } = {}) => {
    let clipPathValue = {
      value: ''
    };
    const transformation = {
        position: new Vector3(0, 0, 0),
        rotation: new Euler(0, 0, 0),
        scale: 1,
        borderRadius: 5
    };

    const scaleVector = new Vector3(1, 1, 1);
    const initialVertices = [
        [0.5, -0.5, 0], 
        [0.5, 0.5, 0], 
        [-0.5, 0.5, 0], 
        [-0.5, -0.5, 0]
    ].map(coords => new Vector3().fromArray(coords));
    const transformedVertices = initialVertices.map((v) => new Vector3(v.x, v.y, v.z));
    const projectedPoints = initialVertices.map(() => ({x: 0, y: 0, z: 0}));
    // Function to update transformation and generate the clip-path
    // this is the function that's called in animation frame to generate the clip path
    const updateClipPath = () => {
      // console.log('updating clip path')
        const { scale, rotation, position } = transformation;

        // console.log(transformation)
        // console.log('scale is')
        // console.log(scale)
        Array.isArray(scale) ? scaleVector.fromArray(scale) : scaleVector.setScalar(scale);
        // Apply scaling and rotation to the vertices
        transformedVertices.forEach((vertex, index) => {
          const copied = vertex.copy(initialVertices[index]);
        //   console.log(`copied: ${JSON.stringify(copied)}`)
          const multiplied = copied.multiply(scaleVector)
        //   console.log(`multiplied: ${JSON.stringify(multiplied)}`)
          const rotated = multiplied.applyEuler(rotation);
        //   console.log(`rotated: ${JSON.stringify(rotated)}`)
        });
        // Update the projection of the vertices
        updateVertices({
            vertices: transformedVertices,
            projectedPoints,
            origin: position,
            focalLength
        });
        return updatePath();
    };
    const updatePath = () => {
      // Generate the new clip-path value
      clipPathValue.value = generatePath(projectedPoints, transformation.borderRadius / 2);
      return clipPathValue.value;
    }

    return {
        path: clipPathValue,
        updatePath,
        update: updateClipPath,
        transform: transformation
    };
};

export { generatePath as createPath, updateVertices as projectVertices, ClipPathGenerator as createClipPathGenerator };
