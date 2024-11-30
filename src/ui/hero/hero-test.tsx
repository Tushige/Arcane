import gsap from 'gsap';
import './zentry-hero.css';
import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { throttle } from '../../utils/util';
import useMousePosition from '../../hooks/use-mouse-position';

const calculateSVGPath = (vw: number, vh: number, length: number, offset = 10, mouseX: number, mouseY: number) => {
  const x = vw/2 + length/2;
  const y = vh/2 - length /2;
  const path = `M ${x} ${y} Q ${x+offset} ${y} ${x+offset} ${y+offset} L ${x+offset} ${y+length} Q ${x+offset} ${y+length+offset} ${x} ${y+length+offset} L ${x-length} ${y+length+offset} Q ${x-length-offset} ${y+length+offset} ${x-length-offset} ${y+length} L ${x-length-offset} ${y+offset} Q ${x-length-offset} ${y} ${x-length} ${y} Z`
  return path;
}

const calculateTilt = (mouseX: number, mouseY: number, elementWidth: number, elementHeight: number, vw: number, vh: number) => {
  const xOffset = mouseX - vw/2;
  const yOffset = mouseY - vh/2;
  const tiltX = 15 - 30 * (yOffset / (elementHeight));
  const tiltY = -15 + 30 * (xOffset / (elementWidth));
  return { tiltX, tiltY };
};

export const HeroTest = ({ }) => {
  const mousePosition = useMousePosition();
  const containerRef = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [svgPath, setSvgPath] = useState(`M ${window.innerWidth / 2} ${window.innerHeight / 2}`);
  const videoRef = useRef<HTMLElement>();
  const pathRef = useRef<HTMLElement>();
  const gsapContextRef = useRef<gsap.Context>();

  /**
   * when user hovers over the hit area, we animate the video preview UI into the center of the screen and it will execute a pulsating animation
   * when user leaves the hit area, the video preview UI will effectively scale to 0 into the center of the screen
   */
  useGSAP(() => {
    if (gsapContextRef && gsapContextRef.current) {
      gsapContextRef.current.revert();
    }
    gsapContextRef.current = gsap.context(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const videoTweenTarget = videoRef.current as gsap.TweenTarget;
      const borderPathTweenTarget = pathRef.current as gsap.TweenTarget;
      if (isHovering) {
        // calculate starting position which is the same logic as resizeWIndow
        const startPath = calculateSVGPath(w, h, Math.max(100, w/10), 10, mousePosition.x, mousePosition.y);
        const emptyPath = calculateSVGPath(w, h, 1, 0, mousePosition.x, mousePosition.y);
        // calculate a smaller version that we're going to transition to
        const endPath = calculateSVGPath(w, h, Math.max(100, w/10)-10, 10, mousePosition.x, mousePosition.y);
        // start from nothing
        gsap.set(videoTweenTarget, {
          clipPath: `path('${emptyPath}')`
        })
        gsap.to(videoTweenTarget, {
          clipPath: `path('${startPath}')`,
          duration: 1,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.to(videoTweenTarget, {
              clipPath:  `path('${endPath}')`,
              yoyo: true,
              repeat: -1,
              duration: 1,
              ease: 'power1.inOut'
            });
          }
        })
        gsap.set(borderPathTweenTarget, {
          attr: {
            d: emptyPath
          }
        });
        gsap.to(borderPathTweenTarget, {
          attr: {
            d: startPath
          },
          duration: 1,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.to(borderPathTweenTarget, {
              attr: {
                d: endPath,
              },
              repeat: -1,
              yoyo: true,
              duration: 1,
              ease: 'power1.inOut'
            })
          }
        });
      } else {
        // shrink when mouse leaves
        const startPath = calculateSVGPath(w, h, Math.max(100, w/10), 10, mousePosition.x, mousePosition.y);
        const endPath = calculateSVGPath(w, h, 0, 0, mousePosition.x, mousePosition.y);
        gsap.set(videoTweenTarget, {
          clipPath: `path('${startPath}')`
        });
        gsap.to(videoTweenTarget, {
          clipPath: `path('${endPath}')`,
          duration: 1,
          ease: 'power1.inOut'
        });
        gsap.set(borderPathTweenTarget, {
          attr: {
            d: startPath
          }
        });
        gsap.to(borderPathTweenTarget, {
          attr: {
            d: endPath
          },
          duration: 1,
          ease: 'power1.inOut'
        });
      }
    });
  }, {
    dependencies: [containerRef, videoRef, windowSize, isHovering],
    scope: containerRef
  });

  /**
   * when user hovers over the hit area, we use the mouse position to tilt the video preview UI
   */
  useEffect(() => {
    const {tiltX, tiltY} = calculateTilt(mousePosition.x, mousePosition.y, window.innerWidth / 10, window.innerHeight / 10, window.innerWidth, window.innerHeight);
    if (videoRef.current && pathRef.current) {
      videoRef.current.style.transform = `translate3d(0px, 0px, 0px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      pathRef.current.style.transform = `translate3d(0px, 0px, 0px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  }, [mousePosition.x]);

  const handleWindowResize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    setWindowSize({
      width: w,
      height: h
    });
    const path = calculateSVGPath(w, h, Math.max(100, w/10), 10, mousePosition.x, mousePosition.y)
    setSvgPath(path);
  }

  /**
   * on Page load, we attach a listener that will recalculate the position of the video preview UI
   */
  useEffect(() => {
    handleWindowResize();
    const throttledHandler = throttle(handleWindowResize, 300);
    window.addEventListener('resize', throttledHandler);
    return () => {
      window.removeEventListener('resize', throttledHandler);
    }
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      <div ref={containerRef} className="hero__slides">
        <div
          className="hero__hitArea"
          onMouseMove={() => {}}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        ></div>
        <div className="heroItem" style={{ display: 'block', position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {/* Container to hold both the video and the SVG border */}
          {/* <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          > */}
            {/* Video content */}
            <div
              id={`hero-cut-0`}
              ref={videoRef}
              className={`heroItem__content path-0`}
              style={{
                clipPath: `path('${svgPath}')`,
                position: 'relative',
                boxSizing: 'border-box', // Ensure that borders don't affect the size
              }}
              data-idx={0}
            >
              <div
                className="heroItem__inner"
                style={{
                  visibility: "visible",
                  opacity: 1,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "translate3d(0px, 0px, 0px) rotateX(0rad) rotateY(0rad) rotateZ(0rad) scale(1)"
                }}
              >
                <video
                  className="video asset"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  poster="videos-arcane/hero-cut-0-poster.png"
                  src="videos-arcane/hero-cut-0.mp4"
                />
              </div>
            </div>
            {/* SVG element to provide the border */}
            <svg
              className="heroItem__border"
            >
              {/* Path with a black stroke */}
              <path
                ref={pathRef}
                className="heroItem__borderPath path-0"
                d={svgPath}
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
            </svg>

          </div>
        </div>
      {/* </div> */}
    </div>
  );
};
