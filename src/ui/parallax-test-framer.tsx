import { useState, useEffect, useRef } from "react";
import { generatePath } from "../utils/util";
import { createClipPathGenerator } from "../utils/clip-path-generator";
import { Euler, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useScroll, useSpring, useTransform } from "motion/react";

const DEFAULT_SCALE = {x: 300, y: 500};
const DEFAULT_ROTATION = {x: Math.PI / 6, y: 0};

const ROTATION_THRESHOLD = 0.8;

/**
 * 
 * we keep track of scroll progress inside the container.
 * The scroll progress controls the scaling and rotation of the clip path
 * 
 * The scale has a 1:1 ratio with viewport so we scale to [vw, vh] to cover the whole viewport
 */

export const Parallax = () => {
  const [svgPath, setSvgPath] = useState(generatePath([
    {x: 100, y: 100},
    {x: 300, y: 100},
    {x: 300, y: 600},
    {x: 100, y: 600},
  ], 10));

  const trapezoidRef = useRef(null);
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [positionVector, setPositionVector] = useState(new Vector3(window.innerWidth / 2, window.innerHeight / 2, 0));

  const generator = useRef();
  generator.current = createClipPathGenerator({focalLength: 800});

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['10% end', '90% end']
  })

  const dx = useRef(0)
  const dy = useRef(0)
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 0.9], [DEFAULT_SCALE.x, window.innerWidth]),{ damping: 20, stiffness: 100 })
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 0.9], [DEFAULT_SCALE.y, window.innerHeight]), {damping: 20, stiffness: 100});

  const rotationX = useSpring(useTransform(() => {
    const scrollYProgressValue = scrollYProgress.get();
    let mouseRotation = dy.current;
    if (scrollYProgressValue >= ROTATION_THRESHOLD) {
      mouseRotation = 0;
    }
    return DEFAULT_ROTATION.x - (scrollYProgressValue * DEFAULT_ROTATION.x + mouseRotation)
  }), {damping: 20, stiffness: 100});

  const rotationY = useSpring(useTransform(() => {
    const scrollYProgressValue = scrollYProgress.get();
    let mouseRotation = dx.current;
    if (scrollYProgressValue >= ROTATION_THRESHOLD) {
      mouseRotation = 0;
    }
    return DEFAULT_ROTATION.y - (scrollYProgressValue * DEFAULT_ROTATION.y + mouseRotation)
  }), {damping: 20, stiffness: 100});

  const [currentScaleX, setCurrentScaleX] = useState(scaleX.get());
  const [currentScaleY, setCurrentScaleY] = useState(scaleY.get());
  const [currentRotationX, setCurrentRotationX] = useState(rotationX.get())
  const [currentRotationY, setCurrentRotationY] = useState(rotationY.get())

  // testing purposes only
  // useEffect(() => {
  //   const unsubscribe = scrollYProgress.on('change', (progress) => {
  //     console.log(progress)
  //   });
  //   return () => unsubscribe();
  // }, [scrollYProgress]);

  useEffect(() => {
    const unsubscribeX = scaleX.on('change', (latestValue) => {
      setCurrentScaleX(latestValue);
    });
    const unsubscribeY = scaleY.on('change', (latestValue) => {
      setCurrentScaleY(latestValue);
    });

    const unsubscribeRotationX = rotationX.on('change', v => setCurrentRotationX(v))
    const unsubscribeRotationY = rotationY.on('change', v => setCurrentRotationY(v))

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeRotationX();
      unsubscribeRotationY();
    };
  }, [scaleX, scaleY]);

  /**
   * Update PATH
   */
  useEffect(() => {
    const {transform} = generator.current;
    transform.scale = [currentScaleX, currentScaleY, 1];
    transform.position.copy(new Vector3(positionVector.x, positionVector.y, 0))
    transform.rotation.copy(new Euler(currentRotationX, currentRotationY, 0))
    generator.current.update();
    setSvgPath(generator.current.path.value);
  }, [currentScaleX, currentScaleY, currentRotationX, currentRotationY])

  /**
   * Hover Animation
   */
  useEffect(() => {
    const xOffset = (mousePosition.x - positionVector.x) / currentScaleX;
    const yOffset = (mousePosition.y - positionVector.y) / currentScaleY;
    dx.current = degToRad(-10 + 5 - 10 * yOffset) // top-bototm tilt
    dy.current = degToRad(-5 + 10 * xOffset); // left-right tilt
  }, [mousePosition.x])

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  /**
   * on Page load, we attach a listener that will mold the currently selected video to the viewport 
   */
  useEffect(() => {
    const handleWindowResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      }); 
      setPositionVector(new Vector3(w / 2, h / 2, 0));
    }

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  return (
    <div ref={containerRef} id="container" className="size-full bg-fuchsia-900 h-[300lvh] relative">
      <div className="sticky top-0 left-0 h-[100lvh]">
        <div
          className="cutout absolute left-0 top-0 size-full bg-green-400" 
          ref={trapezoidRef}
          style={{
            clipPath: `path('${svgPath}')`,
          }}
        >
          <img
            src="img/pilltover.jpg"
            width="100%"
            height="100%"
            alt="background image"
            className="absolute left-0 top-0 size-full object-cover object-center" 
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#3498db",
            }}
          />
        </div>
      </div>
    </div>
  );
};

