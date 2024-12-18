import { motion } from "motion/react";
import useScrollDirection from "../hooks/use-scroll-direction"
import { AppButtonFrequency } from "./app-button-frequency/app-button-frequency"
import { useRef, useState } from "react";

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
        src="/audio/Arcane_ Season_2_Official_Trailer.mp3"
        loop
        playsInline={true}
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
            className="fixed right-10 top-10 z-10"
          >
            <AppButtonFrequency onActive={onActive} onInActive={onInActive}/>
          </motion.div>
        )
      }
    </>
  )
}