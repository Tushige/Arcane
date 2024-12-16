import { motion } from "motion/react";
import useScrollDirection from "../hooks/use-scroll-direction"
import { AppButtonFrequency } from "./app-button-frequency/app-button-frequency"
import { useEffect, useRef, useState } from "react";
import {Howl} from 'howler';

export const AppNavBar = () => {
  const audioElementRef = useRef();
  const direction = useScrollDirection();
  const [isReady, setIsReady] = useState(true);

  const onActive = () => {
    if (!audioElementRef.current) return;
    audioElementRef.current.play();
  }
  const onInActive  = () => {
    if (!audioElementRef.current) return;
    audioElementRef.current.pause();
  }

  return (
    <>
      <audio
        ref={audioElementRef}
        onCanPlayThrough={() => setIsReady(true)}
        className="hidden"
        src="/audio/Arcane_ Season_2 _Official_Trailer.mp3"
        loop
        playsinline="true"
      />
      {
        isReady && (
          <motion.div
            animate={{
              y: direction === 'up' ? 0 : -100
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut'
            }}
            className="fixed right-0 top-0 p-8 z-10"
          >
            <AppButtonFrequency onActive={onActive} onInActive={onInActive}/>
          </motion.div>
        )
      }
    </>
  )
}