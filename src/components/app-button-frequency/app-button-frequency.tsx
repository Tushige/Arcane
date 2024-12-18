import { useRef, useState, useEffect } from 'react';
import './app-button-frequency.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type AppButtonFrequencyProps = {
  onActive: () => void,
  onInActive: () => void
}
export const AppButtonFrequency = ({onActive, onInActive}: AppButtonFrequencyProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef();
  const buttonRef = useRef();
  const turbRef = useRef();
  const btnTimeline = useRef();
  const btnBg = useRef();

  const turbVal = useRef({
    val: 0.000002
  });

  const turbValX = useRef({
    val: 0.000002
  });

  const play = () => {
    onActive();
    btnTimeline.current.play();
    btnBg.current.style.filter = 'url(#filter-music)';
  }
  const pause = () => {
    onInActive();
    btnTimeline.current.pause();
    const throwaway = gsap.timeline({
      onUpdate: () => {
        turbRef.current.setAttribute('baseFrequency', turbVal.current.val + ' ' + turbValX.current.val)
      }
    })
    throwaway.to(turbVal.current, {
      val: 0.000099,
      duration: 0.1
    }, 0)
    throwaway.to(turbValX.current, {
      val: 0.0000099,
      duration: 0.1
    }, 0);
    btnBg.current.style.filter = 'none';
  }
  useGSAP(() => {
    btnTimeline.current = gsap.timeline({
      paused: true,
      onUpdate: () => {
        turbRef.current.setAttribute('baseFrequency', turbVal.current.val + ' ' + turbValX.current.val)
      },
      onComplete: () => {
        // btnTimeline.current.reverse();
        btnTimeline.current.restart();
      },
      onReverseComplete: () => {
        btnTimeline.current.restart();
      }
    });

    // Add the animations to the timeline
    btnTimeline.current.to(turbValX.current, {
      val: 4,
      ease: 'power4.out',
      duration: 0.4
    }, 0);

    btnTimeline.current.to(turbVal.current, {
      val: 0.2,
      ease: 'power4.out',
      duration: 0.1
    }, 0);
  });

  const clickHander = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    setIsPlaying(prev => !prev);
  }

  return (
    <div ref={containerRef}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="svg-filters absolute">
        <defs>
          <filter id="filter-music">
            <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.000001" numOctaves="1" result="warp" />
            <feOffset dx="0" dy="-90" result="warpOffset" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" />
          </filter>
        </defs>
      </svg>
      <button
        ref={buttonRef}
        onClick={clickHander}
        className="button relative z-0 py-4 px-8 bg-transparent font-general font-black group text-black"
      >
        <span className="button__text">{isPlaying ? 'Pause' : 'Play'}</span>
        <span ref={btnBg} className="button__bg bg-yellow-400 group-hover:bg-yellow-100"></span>
      </button>
    </div>
  );
};
