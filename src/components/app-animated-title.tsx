
import { cn } from "../utils/util"
import {motion} from 'motion/react'

type props = {
  text: string,
  className?: string
}

export const AppAnimatedTitle = ({text, className, ...props}: props) => {
  return (
    <motion.h2
      {...props}
      className={cn("font-general text-sm md:text-md font-medium uppercase tracking-wide", className)}
      initial={{
        y: 50,
        opacity: 1  
      }}
      whileInView={{
        y:0,
        opacity: 1,
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