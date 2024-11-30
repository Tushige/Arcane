import { useEffect, useState } from "react"
import { throttle } from "../utils/util";

interface MousePosition {
  x: number;
  y: number;
}

const useMousePosition = () => {
  const [pos, setPos] = useState<MousePosition>({
    x: 0,
    y: 0
  });

  const updateMousePosition = (e: MouseEvent) => {
    setPos({
      x: e.clientX,
      y: e.clientY
    });
  }

  useEffect(() => {
    const throttled = throttle(updateMousePosition, 300);
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    }
  }, []);

  return pos
}

export default useMousePosition;