import { useEffect, useRef, useState } from "react";
import { createClipPathGenerator } from "../../utils/clip-path-generator";
import { useSpring } from "motion/react";
import { Euler, Vector3 } from "three";
import useMousePosition from "../../hooks/use-mouse-position";
import { degToRad } from "../../utils/util";

const ROTATION_X = 0;
const ROTATION_Y = 0;

export const CarouselItem = ({item}) => {
  const elementRef = useRef();
  const [path, setPath] = useState();


  const positionX = useSpring(0, {damping: 20, stiffness: 100});
  const positionY = useSpring(0, {damping: 20, stiffness: 100});
  const [currentPositionX, setCurrentPositionX] = useState(positionX.get());
  const [currentPositionY, setCurrentPositionY] = useState(positionY.get());

  const scaleX =  useSpring(600, {damping: 20, stiffness: 100});
  const scaleY = useSpring(600, {damping: 20, stiffness: 100});
  const [currentScaleX, setCurrentScaleX] = useState(scaleX.get());
  const [currentScaleY, setCurrentScaleY] = useState(scaleY.get());

  const rotateX = useSpring(ROTATION_X, {damping: 20, stiffness: 100});
  const rotateY = useSpring(ROTATION_Y, {damping: 20, stiffness: 100});
  const [currentRotationX, setCurrentRotationX] = useState(rotateX.get());
  const [currentRotationY, setCurrentRotationY] = useState(rotateY.get());

  const mousePosition = useMousePosition()

  const generator = useRef();
  generator.current = createClipPathGenerator({focalLength: 800});

  // on load
  useEffect(() => {
    // set the position at the midpoint of the container
    const rect = elementRef.current.getBoundingClientRect();
    setCurrentPositionX(rect.width / 2);
    setCurrentPositionY(rect.height / 2);
    scaleX.set(rect.width * 0.8);
    scaleY.set(rect.height * 0.6);
  }, [elementRef.current]);

  
  useEffect(() => {
    const { transform } = generator.current;
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
    const xOffset = Math.min(mousePosition.x - currentPositionX, rect.width * 1.5) / currentScaleX;
    const yOffset = Math.min(mousePosition.y - currentPositionY, rect.height *1.5) / currentScaleY;
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
      setCurrentScaleX(val)
    });
    const unsubscribeScaleY = scaleY.on('change', val => setCurrentScaleY(val));

    return () => {
      unsubscribePositionX();
      unsubscribePositionY();
      unsubscribeRotationX();
      unsubscribeRotationY();
      unsubscribeScaleX();
      unsubscribeScaleY();
    }
  }, [])

  return (
    <div className="character-frame">
      <div
        ref={elementRef}
        className="size-full"
        style={{
          clipPath: `path('${path}')`,
        }}
      >
        <img src={item.src} width="100%" height="100%" />
      </div>
    </div>
  )
}