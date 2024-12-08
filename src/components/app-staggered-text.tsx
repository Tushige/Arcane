import { motion } from "motion/react"

export const AppStaggeredText = () => {
  return (
    <TextContainer>
      The City of Progress
    </TextContainer>
  )
}

const DURATION = 0.25;
const STAGGER = 0.025;
const ease = 'easeInOut';

const TextContainer = ({children}: {children: string}) => {
  const text = children || 'no text'
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="relative z-[1] overflow-hidden whitespace-nowrap text-4xl font-black uppercase "
      >
        <div>
          {text.split('').map((char, i) => (
            <motion.span
              className="inline-block"
              style={{
                lineHeight: '0.95'
              }}
              variants={{
                initial: {y: 0},
                hover: {
                  y: "-100%",
                }
              }}
              transition={{
                delay: i * STAGGER,
                duration: DURATION,
                ease
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-0">
          {text.split('').map((char, i) => (
            <motion.span
              className="inline-block"
              style={{
                lineHeight: '0.95'
              }}
              variants={{
                initial: {y: "100%"},
                hover: {
                  y: 0,
                }
              }}
              transition={{
                delay: i * STAGGER,
                duration: DURATION,
                ease
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
    </motion.div>
  )
}