import { useSpring, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useMousePosition from "../../hooks/use-mouse-position";
import { createClipPathGenerator } from "../../utils/clip-path-generator";
import { degToRad } from "../../utils/util";
import { Euler, Vector3 } from "three";
import { useScroll, useTransform } from "framer-motion";
import { animate, inView } from "motion";

const ROTATION_X = Math.PI / 8;
const ROTATION_Y = -Math.PI / 8;

export function CharacterItem ({src, text, description, containerRef, i}: {src: string}) {
  const elementRef = useRef();
  const [path, setPath] = useState('');

  const {scrollYProgress} = useScroll({
    target: containerRef,
    // [top of the element bottom of the container, bottom of the element bottom of the container
    offset: ['0% 100%', '100% 100%']
  })
  
  const positionX = useSpring(0, {damping: 20, stiffness: 100});
  const positionY = useSpring(1000, {damping: 20, stiffness: 100});
  const [currentPositionX, setCurrentPositionX] = useState(positionX.get());
  const [currentPositionY, setCurrentPositionY] = useState(positionY.get());

  const scaleX =  useSpring(300, {damping: 20, stiffness: 100});
  const scaleY = useSpring(300, {damping: 20, stiffness: 100});
  const [currentScaleX, setCurrentScaleX] = useState(scaleX.get());
  const [currentScaleY, setCurrentScaleY] = useState(scaleY.get());

  const rotateX = useSpring(ROTATION_X, {damping: 20, stiffness: 100});
  const rotateY = useSpring(ROTATION_Y, {damping: 20, stiffness: 100});
  const [currentRotationX, setCurrentRotationX] = useState(rotateX.get());
  const [currentRotationY, setCurrentRotationY] = useState(rotateY.get());

  const mousePosition = useMousePosition()
  const generator = useRef();
  generator.current = createClipPathGenerator({focalLength: 800})

  const isInView = useInView(elementRef);

  useEffect(() =>{
    if (isInView) {
      scaleX.set(300);
      scaleY.set(300);
    } else {
      // positionY.set(500);
      scaleX.set(0);
      scaleY.set(0);
    }
  }, [isInView])

  // on load
  useEffect(() => {
    // set the position at the midpoint of the container
    const rect = elementRef.current.getBoundingClientRect();
    setCurrentPositionX(rect.width / 2);
    // setCurrentPositionY(rect.height / 2);
    // scaleX.set(Math.min(rect.width * 0.6, rect.width - 300));
    // scaleY.set(Math.min(rect.height * 0.6, rect.height - 300));
  }, [elementRef.current]);

  /**
   * Update PATH
   */
  useEffect(() => {
    const {transform} = generator.current;
    transform.scale = [currentScaleX, currentScaleY, 1];
    transform.position.copy(new Vector3(currentPositionX, currentPositionY, 0))
    transform.rotation.copy(new Euler(currentRotationX, currentRotationY, 0))
    generator.current.update();
    setPath(generator.current.path.value);
  }, [currentRotationX, currentRotationY, currentScaleX, currentScaleY, currentPositionX, currentPositionY]);

  /**
   * Hover Animation
   */
  useEffect(() => {
    const rect = elementRef.current.getBoundingClientRect();

    // const xOffset = Math.min(mousePosition.x - currentPositionX, rect.width * 1.5) / currentScaleX;
    // const yOffset = Math.min(mousePosition.y - currentPositionY, rect.height *1.5) / currentScaleY;
    const xOffset = Math.min(mousePosition.x - currentPositionX, rect.width * 1.5) / window.innerWidth;
    const yOffset = Math.min(mousePosition.y - currentPositionY, rect.height *1.5) / window.innerHeight;
    const dx = degToRad( -5 + 10 * yOffset) // top-bototm tilt
    const dy = degToRad(5 - 10 * xOffset); // left-right tilt

    rotateX.set(ROTATION_X + dx);
    rotateY.set(ROTATION_Y + dy);
  }, [mousePosition.x]);

  /**
   * Motion value listeners
   */
  useEffect(() => {
    const unsubscribePositionX = positionX.on('change', val => setCurrentPositionX(val))
    const unsubscribePositionY = positionY.on('change', val => setCurrentPositionY(val))
    const unsubscribeRotationX = rotateX.on('change', val => setCurrentRotationX(val));
    const unsubscribeRotationY = rotateY.on('change', val => setCurrentRotationY(val));
    const unsubscribeScaleX = scaleX.on('change', val => {
      console.log(`scale: ${val}`)
      setCurrentScaleX(val)
    });
    const unsubscribeScaleY = scaleY.on('change', val => setCurrentScaleY(val));

    const s = scrollYProgress.on('change', val => {
      // console.log(`progress: ${val}`);
    })
    return () => {
      s();
      unsubscribePositionX();
      unsubscribePositionY();
      unsubscribeRotationX();
      unsubscribeRotationY();
      unsubscribeScaleX();
      unsubscribeScaleY();
    }
  }, [])

  /**
   * on Page load, we attach a listener that will mold the currently selected video to the viewport 
   */
  useEffect(() => {
    const handleWindowResize = () => {
      // set the position at the midpoint of the container
      const rect = elementRef.current.getBoundingClientRect();
      setCurrentPositionX(rect.x + rect.width / 2)
      setCurrentPositionY(rect.height / 2);
    }

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  return (
    <div  
      className="snap-item grid grid-cols-1 sm:grid-cols-2 m-8 justify-center lg:px-[8rem]"
      style={{
        zIndex: i
      }}
    >
      <div className="character-frame">
        <motion.div
          ref={elementRef}
          className="size-full"
          style={{
            clipPath: `path('${path}')`,
          }}
        >
          <img src={src} width="100%" height="100%" />
        </motion.div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <h2 className="text-text-primary text-6xl font-black mb-4">{text}</h2>
        <p className="text-text-primary font-medium text-md w-[400px]">{description}</p>
      </div>
    </div>
  )
}