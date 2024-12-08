import { motion } from "motion/react"
import { useState } from "react"

type props = {
  text: string
}

export const AppAnimatedText = ({}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const text = "The City of Progress";
  const textArr = text.split(' ')
  return (
    <div
      style={{
        perspective: '1000px',
        contain: 'layout'
      }}
    >
      <motion.h2
        className="relative font-general text-sm md:text-md font-medium uppercase tracking-wide mb-10"
        style={{
          transformOrigin: '330px 60px',
        }}
        initial={{
          opacity: 1,
          transform: 'translate3d(-100px, 100px, -60px) rotateX(20deg) rotateY(-60deg) scale(0.5)',
        }}
        whileInView={{
          opacity: 1,
          transform: `translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)`,
          transition: {
            duration: 1,
            ease: [.46, 0.99, .65, 1],
          },
        }}
      >
        <p className="z-[1] special-font font-zentry uppercase text-black font-black text-4xl md:text-8xl lg:text-[8rem]">
          {
            textArr.map((word, i) => (
              <motion.span
                key={i}
                initial={{
                  opacity: 0
                }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    duration: 0.1,
                    delay: i * 0.1
                  }
                }}
              >
                {word}{' '}
              </motion.span>
            ))
          }
        </p>
      </motion.h2>
    </div>
  )
}