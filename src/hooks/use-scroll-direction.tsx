import { useEffect, useRef, useState } from "react"
import { useMotionValueEvent, useScroll } from "motion/react";

const useScrollDirection = () => {

  const { scrollY } = useScroll()
  const [scrollDirection, setScrollDirection] = useState("up")

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious()
    setScrollDirection(diff > 0 ? "down" : "up")
  })
  return scrollDirection
}

export default useScrollDirection;