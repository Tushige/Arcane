import gsap from 'gsap';
import { ScrollTrigger } from "gsap/all";
import './zentry-hero.css';
import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import AppAnimatedButton from '../../components/app-animated-button';
import { calculateFullScreenSVGPath, calculateSVGPath } from '../../utils/util';

gsap.registerPlugin(ScrollTrigger);

type VideoType = {
  src: string,
  poster: string
};

const videos = [
  {
    src: 'videos-arcane/hero-cut-0.mp4',
    poster: 'videos-arcane/hero-cut-0-poster.png'
  },
  {
    src: 'videos-arcane/hero-cut-1.mp4',
    poster: 'videos-arcane/hero-cut-1-poster.png'
  },
  {
    src: 'videos-arcane/hero-cut-2.mp4',
    poster: 'videos-arcane/hero-cut-2-poster.png'
  },
  {
    src: 'videos-arcane/hero-cut-3.mp4',
    poster: 'videos-arcane/hero-cut-3-poster.png'
  },
];

const getNextIdx = (idx: number) => {
  return (idx + 1) % videos.length;
}

export const Hero = ({ }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [prevIdx, setPrevIdx] = useState(-1);
  const [currIdx, setCurrIdx] = useState(0);
  const videoRefs = useRef([]);
  const videoRef = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const [locked, setLocked] = useState(false)
  const gsapContextRef = useRef<gsap.Context>();

  const [svgPath, setSvgPath] = useState(calculateSVGPath(window.innerWidth, window.innerHeight, 0, 0));
  const [svgPreviewPath, setSVGPreviewPath] = useState(calculateSVGPath(window.innerWidth, window.innerHeight, Math.max(100, window.innerWidth/10), 10));
  const { contextSafe } = useGSAP({scope: videoRef})


  const clickHandler = contextSafe( () => {
    if (locked) return;
    if (gsapContextRef.current) {
      /**
       * animation conflict occurs if we don't revert on click
       */
      gsapContextRef.current.revert();
    }
    setPrevIdx(currIdx);
    setCurrIdx(prev => (prev + 1) % videos.length);
    setLocked(true);
  });

  /**
   * On page load, the current video expands to fill the full viewport
   */
  useGSAP(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const fullScreenPath = calculateFullScreenSVGPath(window.innerWidth, window.innerHeight)
    const emptyPath = calculateSVGPath(window.innerWidth, window.innerHeight, 0, 0);
    const previewPath = calculateSVGPath(w, h, Math.max(100, w/10)-10, 10);

    const prevTarget = `#hero-cut-${prevIdx}`;
    const currTarget = `#hero-cut-${currIdx}`;  
    const nextTarget = `#hero-cut-${getNextIdx(currIdx)}`;
    const prevTargetBorder = `#hero-border-${prevIdx}`;
    const currTargetBorder = `#hero-border-${currIdx}`;
    const nextTargetBorder = `#hero-border-${getNextIdx(currIdx)}`;

    videoRefs.current[currIdx].play();
    /**
     * VIDEO wrapper animation
     */
    gsap.set(currTarget, {
      display: 'block',
      clipPath: `path('${previewPath}')`,
      transform: "translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)"
    });
    gsap.to(currTarget, {
      clipPath: `path('${fullScreenPath}')`,
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => {
        /**
         * Spawn the next video preview
         */
        gsap.set(nextTarget, {
          zIndex: 1,
          display: 'block',
          clipPath: `path('${emptyPath}')`,
          transform: "translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)"
        });
        gsap.to(nextTarget, {
          display: 'block', 
          clipPath: `path('${previewPath}')`,
          duration: 1,
          ease: 'power4.inOut',
        });
        /**
         * remove previous - we need to undo the state of the previous videos because when we eventually cycle again, we will want to start from a clean slate
         */
        if (prevTarget) {
          console.log(`resetting previous ${prevIdx}`)
          if (videoRefs.current[prevIdx]) {
            videoRefs.current[prevIdx].pause();
          }
          gsap.set(prevTarget, {
            clipPath: `path('${emptyPath}')`,
          })
          gsap.set(prevTargetBorder, {
            attr: {
              d: emptyPath
            },
          })
        }
      }
    });  

    /**
     * BORDER PATH animation
     */
    // BUG : this displays on page load and lingers for a few seconds. 
    gsap.set(currTargetBorder, {
      display: 'block',
      attr: {
        d: previewPath
      },
    });
    gsap.to(currTargetBorder, {
      attr: {
        d: fullScreenPath
      },
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => {
        // spawn preview video UI
        gsap.set(nextTargetBorder, {
          attr: {
            d: emptyPath
          },
        });
        gsap.to(nextTargetBorder, {
          attr: {
            d: previewPath
          },
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => {
            setLocked(false)
          }
        })
      }
    })
  }, [currIdx, windowSize.width]);

  /**
   * Hover animation
   */
  useGSAP(() => {
    if (locked) return;
    if (gsapContextRef && gsapContextRef.current) {
      gsapContextRef.current.revert();
    }
    gsapContextRef.current = gsap.context(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const emptyPath = calculateSVGPath(w, h, 0, 0);
      // preview shape
      const startPath = calculateSVGPath(w, h, Math.max(100, w/10), 10);
      const endPath = calculateSVGPath(w, h, Math.max(100, w/10)-20, 10);
      const nextIdx = getNextIdx(currIdx);

      const target = `#hero-cut-${nextIdx}`;
      const targetBorder = `#hero-border-${nextIdx}`;
      const tl = gsap.timeline();
      const duration = 0.7;

      if (isHovering) {
        tl
        // tl.set(target, {
        //   clipPath: `path('${emptyPath}')`,
        // })
        // tl.set(targetBorder, {
        //   attr: {
        //     d: emptyPath
        //   }
        // })
        .to(target, {
          clipPath: `path('${startPath}')`,
          duration,
          ease: 'power1.inOut',
        }, 0)
        .to(targetBorder, {
          attr: {
            d: startPath
          },
          duration,
          ease: 'power1.inOut',
        }, 0)
        // Continue both animations simultaneously
        .to(target, {
          clipPath: `path('${endPath}')`,
          yoyo: true,
          repeat: -1,
          duration,
          ease: 'power1.inOut'
        }, duration)
        .to(targetBorder, {
          attr: {
            d: endPath
          },
          yoyo: true,
          repeat: -1,
          duration,
          ease: 'power1.inOut'
        }, duration);
      }
      else {
        // hide the preview
        tl.set(target, {
          clipPath: `path('${startPath}')`
        }, 0)
        .set(targetBorder, {
          attr: {
            d: startPath
          }
        }, 0)
        .to(target, {
          clipPath: `path('${emptyPath}')`,
          duration,
          ease: 'power1.inOut'
        }, duration)
        .to(targetBorder, {
          attr: {
            d: emptyPath
          },
          duration,
          ease: 'power1.inOut',
        }, duration)
      }
    })
    return () => {
      gsapContextRef.current.revert();
    }
  }, [isHovering, locked]);

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
      const path = calculateFullScreenSVGPath(w, h);
      const previewPath = calculateSVGPath(w, h, Math.max(100, w/10)-10, 10);
      setSvgPath(path);
      setSVGPreviewPath(previewPath);
    }

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  /**
   * scroll animation
   */
  useGSAP(() => {
    gsap.set(videoRef.current, {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: '0% 0% 40% 10%',
    });
    gsap.from(videoRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: videoRef.current,
        // start: "center center",
        // end: "bottom center",
        start: 'center center', // when the top of the trigger hits the top of the viewport
        end: '+=500', // end after scrolling 500px beyond the start
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        // scrub: true,
      },
    });
  })

  return (
    <div className="min-h-screen w-full relative">
      <div ref={videoRef} className="hero__slides">
        <div
          className="hero__hitArea"
          onClick={clickHandler}
          onMouseMove={() => {}}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        ></div>
        {
          videos.map((video: VideoType, idx: number) => (
            <HeroItem
              key={video.src}
              video={video}
              idx={idx}
              selectedIdx={currIdx}
              prevIdx={prevIdx}
              videoRefs={videoRefs}
              svgPath={svgPath}
              svgPreviewPath={svgPreviewPath}
            />
          ))
        }
      <div className="px-5 sm:px-10 z-[100] relative">
        <h1 className="special-font text-left uppercase font-zentry text-5xl font-black sm:right-10 sm:text-7xl md:text-9xl lg:text-[12rem] text-white ">
          Arca<b>n</b>e
        </h1>
        <p className="text-left font-bold text-white text-sm sm:text-xl lg:text-2xl">
          Season 2 Out NOW
        </p>
        <AppAnimatedButton text="WATCH Now"/>
      </div>
        <h2 className="absolute bottom-5 right-5 uppercase font-zentry text-5xl font-black sm:right-10 sm:text-7xl md:text-9xl lg:text-[12rem] text-[#E50914] z-[10]">
          WEBFLIX
        </h2>
      </div>
      <h2 className="absolute bottom-5 right-5 uppercase font-zentry text-5xl font-black sm:right-10 sm:text-7xl md:text-9xl lg:text-[12rem] text-black z-0">
        WEBFLIX
      </h2>
    </div>
  );
};

const HeroItem = ({
  video,
  idx,
  selectedIdx,
  prevIdx,
  videoRefs,
  svgPath,
  svgPreviewPath
}: {
  video: VideoType,
  idx: number,
  selectedIdx: number,
  prevIdx: number,
  videoRefs: React.MutableRefObject<HTMLDivElement[]>,
  svgPath: string,
  svgPreviewPath: string
}) => {
  const isPrevious = getNextIdx(idx) === selectedIdx;
  const emptyPath = calculateSVGPath(window.innerWidth, window.innerHeight, 0, 0);
  let zIndex = 0;
  let path = emptyPath;
  /**
   * we determine stacking order as follows : previous -> current -> next
   * everything else is not visible so their zIndex can be set to 0. They just have to be less than 1.
   */
  if (isPrevious) {
    zIndex = 0;
    path = svgPath;
  } else if (idx === selectedIdx || isPrevious) {
    zIndex = 1;
    path = svgPath;
  } else if (idx === getNextIdx(selectedIdx)) {
    zIndex = 2;
    path = svgPreviewPath;
  }
  return (
    <div
      className="heroItem"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: zIndex,
      }}
    >
      {/* Video content */}
      <div
        id={`hero-cut-${idx}`}
        className={`heroItem__content path-0`}
        style={{
          position: 'relative',
          display: (idx === selectedIdx || prevIdx === idx) ? 'block' : 'none',
          boxSizing: 'border-box',
          clipPath: `path('${path}')`
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
          }}
        >
          <video
            ref={(el) => videoRefs.current[idx] = el}
            className="video asset"
            muted
            playsInline
            loop
            preload="metadata"
            poster={video.poster}
            src={video.src}
          />
        </div>
      </div>
      {/* SVG element to provide the border */}
      <svg
        className="heroItem__border"
      >
        {/* Path with a black stroke */}
        <path
          id={`hero-border-${idx}`}
          className="heroItem__borderPath path-0"
          fill="none"
          stroke="black"
          strokeWidth="2px"
        />
      </svg>
    </div>
  )
}