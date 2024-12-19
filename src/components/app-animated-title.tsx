
import { cn } from "../utils/util"
import {motion} from 'motion/react'

type props = {
  text: string,
  className?: string,
  hidden?: boolean
}

export const AppAnimatedTitle = ({text, hidden, className, ...props}: props) => {
  return (
    <motion.h2
      {...props}
      className={cn("font-general text-sm md:text-md font-medium uppercase tracking-wide", className)}
      initial={{
        y: 50,
        opacity: 0
      }}
      whileInView={{
        y: hidden ? '-100%' : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut'
      }}
    >
      {text}
    </motion.h2>
  )
}