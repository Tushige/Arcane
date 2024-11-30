import { useRef, useState } from 'react';
import './zentry-hero.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type VideoType = {
  src: string,
  poster: string
};

type Coord = {
  x: number,
  y: number
}
const createPolygon = (topLeft: Coord, topRight: Coord, bottomLeft: Coord, bottomRight: Coord) => {
  return `polygon(${topLeft.x}% ${topLeft.y}%, ${topRight.x}% ${topRight.y}%, ${bottomRight.x}% ${bottomRight.y}%, ${bottomLeft.x}% ${bottomRight.y}%)`
}
const CLIP_PATH_EMPTY = createPolygon({x: 49, y: 41}, {x: 50, y: 44}, {x: 50, y: 45}, {x: 50, y:44});
// const CLIP_PATH_PREVIEW = createPolygon({x: 40, y: 35}, {x: 60, y: 35}, {x: 40, y: 55}, {x: 60, y:55});
// const CLIP_PATH_PREVIEW = `M 40,35 L 60,35 L 60,55 L 40,55 Z`;
const CLIP_PATH_PREVIEW = `M45 45 H55 V55 H45 Z`;
const CLIP_PATH_FULL = createPolygon({x: 0, y: 0}, {x: 100, y: 0}, {x: 0, y: 100}, {x: 100, y:100});

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

// returns a random value in [val - 10, val + 10]
const getValueAround = (val: number) => {
  return val + Math.floor(Math.random() * 2 - 1);
}

const getNextIdx = (idx: number) => {
  return (idx + 1) % videos.length;
}

export const ZentryHero = ({}) => {
  const [currIdx, setCurrIdx] = useState(0);
  const videoRefs = useRef([]);
  const containerRef = useRef();
  const tl = useRef();
  tl.current = gsap.timeline();
  const {contextSafe } = useGSAP({scope: containerRef})

  const clickHandler = contextSafe((e) => {
    gsap.set(`#hero-cut-${(currIdx+1) % videos.length}`, {display: 'block', clipPath: `path(M45 45 H55 V55 H45 Z)`})
    gsap.to(`#hero-cut-${(currIdx+1) % videos.length}`, {
      clipPath: `path(M45 45 H55 V55 H45 Z)`,
      ease: "power1.inOut",
      duration: 1.5,
      onStart: () => {
        videoRefs?.current[(currIdx+1) % videos.length].play();
      },
      onComplete: () => {
        gsap.set(`#hero-cut-${currIdx}`, {display: 'none'});
        setCurrIdx(prev => (prev + 1) % videos.length);
      }
    });
  });

  useGSAP(() => {
    const nextIdx = getNextIdx(currIdx);
    // after the video has expanded to full screen, we animate the next video into existence in the center of the screen.
    const tl = gsap.timeline();
    tl.set(`.path-${nextIdx}`, {display: 'block', clipPath: `path(M45 45 H55 V55 H45 Z)`});
    tl.to(`.path-${nextIdx}`, {display: 'block', clipPath: `path(M45 45 H55 V55 H45 Z)`});
  }, {
    dependencies: [currIdx],
    scope: containerRef
  })

  const setVideoRef = (element, index) => {
    videoRefs.current[index] = element;
  };

  return (
    <div className="min-h-screen w-full relative">
      <div ref={containerRef} className="hero__slides">
        <div className="hero__hitArea" onClick={clickHandler}>
        {
          videos.map((video: VideoType, idx: number) => {
            return (
              <div
                key={video.src}
                className="heroItem"
                style={{ zIndex: idx === getNextIdx(currIdx) ? 5 : idx, display: (idx === currIdx || idx === getNextIdx(currIdx)) ? 'block' : 'none'}}
              >
                <div
                  id={`hero-cut-${idx}`}
                  className={`heroItem__content path-${idx}`}
                  style={{
                    clipPath: `path('M45 45 H55 V55 H45 Z')`, // Ensure this matches your SVG path
                    position: 'relative', // Add relative positioning to ensure proper layout
                    width: '100%', // Ensure the content has full width
                    height: '100%' // Ensure the content has full height
                  }}
                  data-idx={idx}
                >
                  <div
                    className="heroItem__inner"
                    style={{
                      visibility: "visible",
                      opacity: 1,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform:
                        "translate3d(0px, 0px, 0px) rotateX(0rad) rotateY(0rad) rotateZ(0rad) scale(1)"
                    }}
                  >
                    <video
                      ref={(el) => setVideoRef(el, idx)}
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
              </div>
            )
          })
        }
      </div>
    </div>
  </div>
  )
}