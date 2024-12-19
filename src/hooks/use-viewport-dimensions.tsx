import { useEffect, useState } from "react"

const useViewportDimension = () => {
  const [dimension, setDimension] = useState({
    width: 0,
    height: 0
  })
  useEffect(() => {
    const resizeHandler = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
  }, [window.innerHeight])
  return dimension
}

export default useViewportDimension;