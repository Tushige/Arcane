import { useEffect, useRef, useState } from "react";
import { AppAnimatedText } from "../../components/app-animated-text"
import { AppAnimatedTitle } from "../../components/app-animated-title"
import { Euler, Vector3 } from "three";
import { degToRad } from "../../utils/util";
import useMousePosition from "../../hooks/use-mouse-position";
import { createClipPathGenerator } from "../../utils/clip-path-generator";
import { useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { CharacterItem } from "./character-item";

const data = [
  {
    title: 'Jinx',
    description: 'Jinx was torn between two identities: the strong, powerful, daughter Silco raised and the fearful, weak, little sister Vi protected. Now, accepting she’s the monster that Vi created, Jinx becomes a hollow shell—she is the cursed "Jinx" that ruins everything.',
    imageSrc: 'img/characters/jinx.png'
  },
  // {
  //   title: 'Vi',
  //   description: 'Accepting Powder is gone, Vi comes to terms with what she must do—handle the monster she created: Jinx. Knowing how dangerous her sister is, Vi teams up with Caitlyn and gives in to her request to don the Enforcer badge.',
  //   imageSrc: 'img/characters/vi.png'
  // },
  // {
  //   title: 'Caitlyn',
  //   description: 'Caitlyn is an Enforcer from Piltover. She once used her investigative prowess to expose the source of corruption in Zaun and Piltover, but after Jinx’s attack on the council, she’s abandoned hope for peace.',
  //   imageSrc: 'img/characters/caitlyn.png'
  // },
];

export const CharactersJS = () => {
  const topTextRef = useRef();
  const containerRef = useRef();
  const scrollableContainerRef = useRef();

  const [topTextHeight, setTopTextHeight] = useState(0);

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['0% end', '100% end']
  });

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
    <section ref={containerRef} className="relative min-h-screen">
      <div className="">   
        <div ref={topTextRef}>
          <AppAnimatedTitle text="Meet the Cast" className="text-text-primary" />
          <AppAnimatedText text="Characters" className="text-text-primary" />
        </div>
        <div
          className="relative mt-12"
          ref={scrollableContainerRef}
        >
          {
            data.map((item, i) => (
              <CharacterItem
                key={i}
                i={i}
                src={item.imageSrc}
                containerRef={containerRef}
                text={item.title}
                description={item.description}
              />
            ))
          }
        </div>
      </div>
    </section>
  )
}
