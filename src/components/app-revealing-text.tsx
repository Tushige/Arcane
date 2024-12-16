
import { ReactLenis, useLenis } from 'lenis/react'

import { forwardRef, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import gsap from 'gsap';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  'Piltover, also known as the City of Progress',
  'is a thriving, progressive city',
  'whose power and influence is on the rise.',
  "It is Valoran's cultural center, where art,",
  'craftsmanship, trade and innovation walk hand in hand.'
]


export const AppRevealingText = forwardRef(({text, className, containerId}) => {
  const contentRef = useRef();
  
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.2,
      smooth: true
    });


    Splitting({target: contentRef.current})
    const chars = contentRef.current.querySelectorAll('.char');
    chars.forEach(char => gsap.set(char.parentNode, { perspective: 1000 }));
    gsap.fromTo(
      chars,
      {
        'will-change': 'opacity, transform',
        opacity: 0.2,
        z: -800,
      },
      {
        opacity: 1,
        z: 0,
        ease: 'back.out(1.2)',
        stagger: 0.04,
        scrollTrigger: {
          trigger: `#${containerId}`,
          start: 'center bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

    // To enable Lenis smooth scrolling
    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update(); // Ensure ScrollTrigger updates with the new scroll position
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf); // Start the animation frame loop for Lenis

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, [])
  
  return (
    // <ReactLenis options={{ autoRaf: false }} ref={lenisRef}>
      <div ref={contentRef} className={`content`} data-splitting>
        {
          lines.map((line, idx) => (
            <div key={idx} className={className}>
              {line}
            </div>
          ))
        }
      </div>
    // </ReactLenis>
  )
});