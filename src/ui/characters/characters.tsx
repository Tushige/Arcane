import { useEffect, useRef, useState } from "react";
import { AppAnimatedText } from "../../components/app-animated-text"
import { AppAnimatedTitle } from "../../components/app-animated-title"
import { Euler, Vector3 } from "three";
import { degToRad } from "../../utils/util";
import useMousePosition from "../../hooks/use-mouse-position";
import { createClipPathGenerator } from "../../utils/clip-path-generator";
import { useScroll, useSpring, useTransform } from "motion/react";
import { CharacterItem } from "./character-item";

const data = [
  {
    title: 'Jinx',
    description: 'Jinx was torn between two identities: the strong, powerful, daughter Silco raised and the fearful, weak, little sister Vi protected. Now, accepting she’s the monster that Vi created, Jinx becomes a hollow shell—she is the cursed "Jinx" that ruins everything.',
    imageSrc: 'img/characters/jinx.png'
  },
  {
    title: 'Vi',
    description: 'Accepting Powder is gone, Vi comes to terms with what she must do—handle the monster she created: Jinx. Knowing how dangerous her sister is, Vi teams up with Caitlyn and gives in to her request to don the Enforcer badge.',
    imageSrc: 'img/characters/vi.png'
  },
];

export const Characters = () => {
  const topTextRef = useRef();
  const containerRef = useRef();
  const [topTextHeight, setTopTextHeight] = useState(0);
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['0% end', '100% end']
  });

  const currIdx = useTransform(scrollYProgress, [0, 1], [0, data.length-1]);

  useEffect(() => {
    const resizeHandler = () => {
      setTopTextHeight(topTextRef.current.getBoundingClientRect().height);
    }
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    }
  }, []);
  
  return (
    <section ref={containerRef} className="relative min-h-screen h-[300lvh]">
      <div className="sticky top-10 left-0">   
        <div ref={topTextRef}>
          <AppAnimatedTitle text="Meet the Cast" className="text-text-primary" />
          <AppAnimatedText text="Characters" className="text-text-primary" />
        </div>
        <div
          className="relative mt-12 snap-container"
          style={{
            maxHeight: `calc(100lvh - ${topTextHeight}px)`
          }}
        >
          {
            data.map((item, i) => (
              <div  
                key={i}
                className="snap-item grid grid-cols-1 sm:grid-cols-2 m-8 justify-center lg:px-[8rem]"
                style={{
                  zIndex: i,
                  minHeight: `calc(100lvh - ${topTextHeight}px)`,
                  scrollSnapType: currIdx.get()  < data.length-1 ? 'y mandatory' : 'none'
                }}
              >
                <div className="character-frame">
                  <CharacterItem src={item.imageSrc}/>
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-text-primary text-6xl font-black mb-4">{item.title}</h2>
                  <p className="text-text-primary font-medium text-md">{item.description}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}
