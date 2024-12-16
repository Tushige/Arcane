import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { rotatePath } from "../utils/rotate";
import { generatePath } from "../utils/util";
import { createClipPathGenerator } from "../utils/clip-path-generator";
import { Euler, Vector2, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const calculatePath = ({
  vw,
  vh,
  width = 320,
  height = 100,
  offset = 10
}: {
  vw: number,
  vh: number,
  width: number,
  height: number,
  offset?: number
}) => {
  const x = vw / 2 - width / 2;
  const y = vh / 2 - height / 2;
  const path = `
    M ${x} ${y}
    L ${x + width} ${y + 20}
    L ${x + width} ${y + height - 20}
    L ${x - 40} ${y + height}
    Z
  `.replace(/\n/g, '').trim();
  return path;
}

const firstPath = "M 1375.43 209.634 L 1375.43 209.634 Q 1383.42 210.102 1384.75 217.99 L 1517.79 1007.55 Q 1519.12 1015.43 1511.28 1016.99 L 850.766 1148.19 Q 842.92 1149.75 842.769 1141.75 L 824.805 185.407 Q 824.655 177.408 832.641 177.875 Z";
const secondPath = "M 847.805 260.738 L 847.805 260.738 Q 855.213 263.757 856.6 271.636 L 980.435 975.025 Q 981.822 982.904 974.155 985.188 L 338.422 1174.52 Q 330.755 1176.81 331.152 1168.82 L 385.279 80.3982 Q 385.676 72.4081 393.085 75.4272 Z";
const thirdPath = "M 1413.62 266.416 L 1413.62 266.416 Q 1420.97 269.576 1422.41 277.445 L 1550.61 977.603 Q 1552.06 985.472 1544.36 987.658 L 899.875 1170.73 Q 892.179 1172.92 892.677 1164.93 L 960.331 79.6812 Q 960.829 71.6967 968.178 74.8572 Z";


export const Parallax = () => {
  const [svgPath, setSvgPath] = useState(generatePath([
    {x: 100, y: 100},
    {x: 300, y: 100},
    {x: 300, y: 600},
    {x: 100, y: 600},
  ], 10));

  const trapezoidRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [positionVector, setPositionVector] = useState(new Vector3(window.innerWidth / 2, window.innerHeight / 2, 0));
  const scaleVector = useRef(new Vector3(300, 500, 1));
  const rotationEulor = useRef(new Euler(Math.PI / 6, 0, 0));
  const dx = useRef(0)
  const dy = useRef(0)
  const generator = useRef();
  generator.current = createClipPathGenerator({focalLength: 800});

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

  useEffect(() => {
    if (!generator.current || !scaleVector.current) return;
    const { transform } = generator.current;
    if (scaleVector.current.x >= window.innerWidth - 100) return;

    const xOffset = (mousePosition.x - positionVector.x) / scaleVector.current.x;
    const yOffset = (mousePosition.y - positionVector.y) / scaleVector.current.y;

    dx.current = degToRad(-10 + 5 - 10 * xOffset); //left-right tilt
    dy.current = degToRad(-5 + 10 * yOffset); // top-bottom tilt

    const xRad = rotationEulor.current.x + dx.current;
    const yRad = rotationEulor.current.y + dy.current;
    const rotation = new Euler(yRad, xRad, 0);

    transform.position.copy(positionVector);
    transform.rotation.copy(rotation);
    transform.scale = [scaleVector.current.x, scaleVector.current.y, scaleVector.current.z];

    generator.current.update();
    setSvgPath(generator.current.path.value);
  }, [mousePosition.x]);

  useGSAP(() => {

    gsap.to(rotationEulor.current, {
      x: 0,
      y: 0,
      scrollTrigger: {
        trigger: trapezoidRef.current,
        // end: "bottom center",
        start: 'center center', // when the top of the trigger hits the top of the viewport
        end: 'bottom center',
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar,,
      },
    })

    gsap.to(scaleVector.current, {
      x: window.innerWidth,
      y: window.innerHeight,
      scrollTrigger: {
        trigger: trapezoidRef.current,
        // end: "bottom center",
        start: 'center center', // when the top of the trigger hits the top of the viewport
        end: '+=1000',
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar,
      },
      onUpdate: (arg) => {
        const {transform} = generator.current;
        transform.scale = [scaleVector.current.x, scaleVector.current.y, scaleVector.current.z];
        transform.position.copy(new Vector3(positionVector.x, positionVector.y, 0))
        transform.rotation.copy(new Euler(rotationEulor.current.x, rotationEulor.current.y, 0))
        generator.current.update();
        setSvgPath(generator.current.path.value);
      }
    });
  })

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
    <div className="size-full bg-fuchsia-900 h-[300lvh]">
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

