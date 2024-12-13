
import { cn } from "../utils/util"

type props = {
  text: string,
  className?: string
}

export const AppAnimatedTitle = ({text, className, ...props}: props) => {
  return (
    <h2
      {...props}
      className={cn("font-general text-sm md:text-md font-medium uppercase tracking-wide", className)}
    >
      {text}
    </h2>
  )
}