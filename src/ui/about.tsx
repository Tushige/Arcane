import { useEffect, useRef, useState } from "react";
import useMousePosition from "../hooks/use-mouse-position";
import { createClipPathGenerator } from "../utils/clip-path-generator";
import { Euler, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useScroll, useSpring, useTransform } from "motion/react";
import { AppAnimatedTitle } from "../components/app-animated-title";
import { AppAnimatedText } from "../components/app-animated-text";

const DEFAULT_SCALE = {x: 300, y: 500};
const DEFAULT_ROTATION = {x: -Math.PI / 12, y: -Math.PI / 6};

const ROTATION_THRESHOLD = 0.8;

const About = () => {
  const mainImageRef = useRef<HTMLImageElement>();
  const containerRef = useRef(null);
  const mainImagePathRef = useRef();
  // the origin coordinates
  const [positionVector, setPositionVector] = useState(new Vector3(window.innerWidth / 2, window.innerHeight / 2, 0));
  const [svgPath, setSvgPath] = useState();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const mousePosition = useMousePosition()
  const generator = useRef();
  generator.current = createClipPathGenerator({focalLength: 800});

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['10% end', '90% end']
  });
  
  const dx = useRef(0)
  const dy = useRef(0)
  const translateX = useRef(0)
  const translateY = useRef(0)

  const imageScale = useSpring(useTransform(scrollYProgress, [0, 0.9], [1.3, 1]), {damping: 20, stiffness: 100});
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 0.9], [DEFAULT_SCALE.x, window.innerWidth]),{ damping: 20, stiffness: 100 })
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 0.9], [DEFAULT_SCALE.y, window.innerHeight]), {damping: 20, stiffness: 100});

  const rotationX = useSpring(useTransform(() => {
    const scrollYProgressValue = scrollYProgress.get();
    let mouseRotation = dx.current;
    if (scrollYProgressValue >= ROTATION_THRESHOLD) {
      mouseRotation = 0;
      translateX.current = 0;
      translateY.current = 0;
    }
    return DEFAULT_ROTATION.x - (scrollYProgressValue * DEFAULT_ROTATION.x + mouseRotation)
  }), {damping: 20, stiffness: 100});

  const rotationY = useSpring(useTransform(() => {
    const scrollYProgressValue = scrollYProgress.get();
    let mouseRotation = dy.current;
    if (scrollYProgressValue >= ROTATION_THRESHOLD) {
      mouseRotation = 0;
      translateX.current = 0;
      translateY.current = 0;
    }
    return DEFAULT_ROTATION.y - (scrollYProgressValue * DEFAULT_ROTATION.y + mouseRotation)
  }), {damping: 20, stiffness: 100});

  const [currentScaleX, setCurrentScaleX] = useState(scaleX.get());
  const [currentScaleY, setCurrentScaleY] = useState(scaleY.get());
  const [currentRotationX, setCurrentRotationX] = useState(rotationX.get())
  const [currentRotationY, setCurrentRotationY] = useState(rotationY.get())
  const [currentImageScale, setCurrentImageScale] = useState(imageScale.get());

  useEffect(() => {
    const unsubscribeScaleX = scaleX.on('change', (latestValue) => {
      setCurrentScaleX(latestValue);
    });
    const unsubscribeScaleY = scaleY.on('change', (latestValue) => {
      setCurrentScaleY(latestValue);
    });

    const unsubscribeImageScale = imageScale.on('change', val => setCurrentImageScale(val))

    const unsubscribeRotationX = rotationX.on('change', v => setCurrentRotationX(v))
    const unsubscribeRotationY = rotationY.on('change', v => setCurrentRotationY(v))

    return () => {
      unsubscribeScaleX();
      unsubscribeScaleY();
      unsubscribeRotationX();
      unsubscribeRotationY();
      unsubscribeImageScale();
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
  }, [currentScaleX, currentScaleY, currentRotationX, currentRotationY]);

  /**
   * Hover Animation
   */
  useEffect(() => {
    const xOffset = (mousePosition.x - positionVector.x) / currentScaleX;
    const yOffset = (mousePosition.y - positionVector.y) / currentScaleY;
    dx.current = degToRad(-10 + 5 - 10 * yOffset) // top-bototm tilt
    dy.current = degToRad(-5 + 10 * xOffset); // left-right tilt

    translateX.current = xOffset * 10;
    translateY.current = yOffset * 10;
  }, [mousePosition.x]);

  /**
   * on Page load, we attach a listener that will mold the currently selected video to the viewport 
   */
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setPositionVector(new Vector3(window.innerWidth / 2, window.innerHeight / 2, 0))
    }

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen h-[300lvh]">
      <AppAnimatedTitle text="Welcome to Pilltover" className="text-text-primary"/>
      {/* <AppStaggeredText/> */}
      <AppAnimatedText text="The City of Progress" className="text-text-primary"/>

      <div className="intro__frameWrap h-[100lvh] w-full sticky top-0">
        <div className="frame size-full absolute top-0 left-0">
          {/**
           * the outer container for the main image
           * on scroll, we expand the clip path to reveal the image
           */}
          <div
            ref={mainImagePathRef}
            id="mainImagePath"
            className="frame__mask size-full absolute top-0 left-0"
            style={{
              clipPath: `path('${svgPath}')`
            }}
          >
            <div
              className="frame__content size-full absolute top-0 left-0"
              style={{
                transform: `translate3d(${translateX.current}px, ${translateY.current}px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(${currentImageScale})`
              }}
            >
              <img  
                ref={mainImageRef}
                // src="img/arcane_season_1_cover_art_gkids_1590.webp"
                src="img/pilltover3.jpg"
                width="100%"
                height="100%"
                alt="background image"
                className="absolute left-0 top-0 size-full object-cover object-center" 
              />
            </div>
            <svg
              className="frame__border absolute size-full top-0 left-0"
              stroke="#e5e5e5"
              strokeWidth="2"
              fill="none"
            >
              <path className="frame__borderPath" d={svgPath}></path>
            </svg>

          </div>
          {/**
           * the outer container for the floating elements
           * on mouse hover, we shift their position to create a parallax fx
           */}
          <div
            className="frame__outer size-full absolute top-0 left-0"
            style={{
              transform: `translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.3)`
            }}
          >
            <img 
              src="img/zentry/stones.webp"
              width="100%"
              height="100%"
              className="absolute top-0 left-0 object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default About;