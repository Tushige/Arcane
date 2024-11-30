import { motion } from 'framer-motion';
import React, { useState } from 'react';

const PathAnimationToggle = () => {
  const [isHeart, setIsHeart] = useState(false);

  // Define your paths
  const fullScreenPath = 'M10 10 L100 10 L100 100 L10 100 Z'; // Starting path (square)
  const heartPath = 'M50 30 C30 10, 10 30, 50 50 C90 30, 70 10, 50 30 Z'; // Target path (heart)

  const togglePath = () => setIsHeart(!isHeart);

  return (
    <div>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Animate the d attribute with Framer Motion */}
        <motion.path
          d={isHeart ? heartPath : fullScreenPath}  // Change path based on the state
          fill="transparent"
          stroke="red"
          strokeWidth="2"
          animate={{ d: isHeart ? heartPath : fullScreenPath }}  // Animate the d attribute
          transition={{
            duration: 10, // Duration of the transition
            ease: 'easeInOut',
            type: 'tween', // Use 'tween' for smooth interpolation
          }}
        />
      </svg>
      <button onClick={togglePath}>Change to {isHeart ? 'rect' : 'heart'}</button>
    </div>
  );
};

export default PathAnimationToggle;
