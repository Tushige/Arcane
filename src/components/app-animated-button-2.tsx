import { Clapperboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClipPathGenerator } from "../utils/clip-path-generator";
import { useSpring, motion } from "motion/react";
import { Vector3, Euler } from "three";

// const spring = { damping: 20, stiffness: 100, restDelta: 0.001 };
const spring = {bounce: 0.6}

export const AppAnimatedButton2 = ({text}: {text: string}) => {
  const buttonRef = useRef();
  const pathRef = useRef();
  const [buttonPath, setButtonPath] = useState('');
  const [isMouseOver, setIsMouseOver] = useState(false);

  const generator = useRef();
  generator.current = createClipPathGenerator({focalLength: 800});

  const scaleX = useSpring(1, spring);
  const scaleY = useSpring(1, spring);

  const [currentScaleX, setCurrentScaleX] = useState(scaleX.get());
  const [currentScaleY, setCurrentScaleY] = useState(scaleY.get());

  const rotationX = useSpring(0, spring);
  const rotationY = useSpring(0, spring);
  const rotationZ = useSpring(0, spring);

  const [currentRotationX, setCurrentRotationX] = useState(rotationX.get());
  const [currentRotationY, setCurrentRotationY] = useState(rotationY.get());
  const [currentRotationZ, setCurrentRotationZ] = useState(rotationZ.get());

  const borderRadius = useSpring(5, spring);

  useEffect(() => {
    const unsubScaleX = scaleX.on('change', (val) => setCurrentScaleX(val));
    const unsubScaleY = scaleY.on('change', (val) => setCurrentScaleY(val));

    const unsubRotationX = rotationX.on('change', val => setCurrentRotationX(val))
    const unsubRotationY = rotationY.on('change', val => setCurrentRotationY(val))
    const unsubRotationZ = rotationZ.on('change', val => setCurrentRotationZ(val))

    return () => {
      unsubScaleX();
      unsubScaleY();
      unsubRotationX()
      unsubRotationY();
      unsubRotationZ();
    }
  }, [scaleX, scaleY]);


  useEffect(() => {
    const { transform } = generator.current;
    const rect = buttonRef.current.getBoundingClientRect();

    transform.scale = [currentScaleX, currentScaleY, 1];
    transform.position.copy(new Vector3(rect.width / 2, rect.height / 2, 0))
    transform.rotation.copy(new Euler(currentRotationX, currentRotationY, currentRotationZ));
    transform.borderRadius = borderRadius.get();

    generator.current.update();
    setButtonPath(generator.current.path.value);
  }, [currentScaleX, currentScaleY, currentRotationX, currentRotationY])

  useEffect(() => {
    const rect = buttonRef.current.getBoundingClientRect();
    scaleX.set(rect.width)
    scaleY.set(rect.height * 0.7);
  }, [])

  const onMouseEnter = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setIsMouseOver(true)
    scaleX.set(rect.width * 0.8);
    scaleY.set(rect.height * 0.9)
    rotationX.set(0.4);
    rotationY.set(-0.1);
    rotationZ.set(0);
    borderRadius.set(5);
  }

  const onMouseLeave = () => {
    setIsMouseOver(false)
    const rect = buttonRef.current.getBoundingClientRect();
    scaleX.set(rect.width);
    scaleY.set(rect.height * 0.7);
    rotationX.set(0);
    rotationY.set(0);
    rotationZ.set(0);
    borderRadius.set(20);
  }
  const variants = {
    hover: {
      y: '-100%'
    }
  }
  return (
    <motion.button
      ref={buttonRef}
      className="btnMain textCaptionBtn hero__cta gap-4 items-center outline-none"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover="hover"
    >
      <span className="btnMain__text uppercase font-bold text-center">
        <motion.span
          className="font-general font-black"
          initial={{
            y: '0%',
            opacity: 1
          }}
          variants={{
            hover: {
              y: '-100%',
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: 'easeOut'
              }
            }
          }}
          transition={{
            delay: 0.3,
            duration: 0.3,
            ease: 'easeOut'
          }}
        >
          {text}
        </motion.span>
        <motion.span
          className="rollover font-general font-bold absolute left-0 top-0"
          style={{
            transform: 'translate(0px, 100%)',
          }}
          initial={{
            y: '100%',
            opacity: 0,
          }}
          variants={{
            hover: {
              y: '0%',
              opacity: 1,
              transition: {
                delay: 0.3,
                duration: 0.3,
                ease: 'easeOut'
              }
            }
          }}
        >
          {text}
        </motion.span>
      </span>
      <div className="btnMain__icon z-[1] relative size-[1.4rem] order-[-1]">
        <motion.span
          className="state-0 absolute inline-block size-full left-0 top-0"
          style={{
            transform: 'translate(0px, 0px)',
            opacity: 1,
          }}
          initial={{
            y: '0%',
            opacity: 1
          }}
          variants={{
            hover: {
              y: '-100%',
              opacity: 0
            }
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
            delay: 0.1
          }}
          >
          <Clapperboard />
        </motion.span>
        <motion.span className="btnMain__iconRollover state-1 absolute inline-block size-full left-0 top-0"
          style={{
            transform: 'translate(0px, 100%)',
          }}
          initial={{
            y: '100%',
            opacity: 0
          }}
          variants={{
            hover: {
              y: '0%',
              opacity: 1
            }
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
            delay: 0.1
          }}
        >
          <Clapperboard />
        </motion.span>
      </div>

      <div className="btnMain__shape">
        <svg className="btnMain__shapeIcon" stroke-width="1">
          <path
            ref={pathRef}
            className="btnMain__shapePath"
            d={buttonPath}
            fill="steelblue"
          >
          </path>
        </svg>
      </div>
    </motion.button>
  )
}