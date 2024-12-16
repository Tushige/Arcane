import gsap from 'gsap';
import { ScrollTrigger } from "gsap/all";
import './carousel.css'
import { useEffect, useRef, useState } from 'react';
import { CarouselItem } from './carousel-item';

gsap.registerPlugin(ScrollTrigger);

const characters = [
  {
    src: '/img/characters/ambessa.png',
    name: 'Ambessa'
  },
  {
    src: '/img/characters/caitlyn.png',
    name: 'Caitlyn'
  },
  {
    src: '/img/characters/ekko.png',
    name: 'Ekko'
  },
  {
    src: '/img/characters/heimerdinger.png',
    name: 'Heimerdinger'
  },
  {
    src: '/img/characters/jayce.jpg',
    name: 'Jayce'
  },
  {
    src: '/img/characters/jinx.png',
    name: 'Jinx'
  },
  {
    src: '/img/characters/mel.jpg',
    name: 'Mel'
  },
  {
    src: '/img/characters/sevika.jpg',
    name: 'Sevika'
  },
  {
    src: '/img/characters/vi.png',
    name: 'Vi'
  },
  {
    src: '/img/characters/viktor.jpg',
    name: 'Viktor'
  },
  {
    src: '/img/characters/warwick.jpg',
    name: 'Warwick'
  },
]
export const Carousel = () => {
  const [iteration, setIteration] = useState(0); 

  const galleryRef = useRef();
  const cardsRef = useRef([]);
  const seamlessLoopRef = useRef(null);
  const scrubRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!galleryRef.current) return;
    const spacing = 0.1;
    const snap = gsap.utils.snap(spacing);
    const cards = cardsRef.current;
    seamlessLoopRef.current = buildSeamlessLoop(cards, spacing);
    const seamlessLoop = seamlessLoopRef.current;

    scrubRef.current = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: 'power3',
      paused: true
    });

    const scrub = scrubRef.current;

    triggerRef.current = ScrollTrigger.create({
      start: 0,
      onUpdate(self) {
        scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
        scrub.invalidate().restart();
      },
      end: '+=1000',
      pin: galleryRef.current
    });
    return () => {
      triggerRef.current.kill();
    }
  }, [iteration, galleryRef.current]);

  const scrubTo = (totalTime) => {
    const seamlessLoop = seamlessLoopRef.current;
    const progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
    const scrollToTime = triggerRef.current.start + progress * (triggerRef.current.end - triggerRef.current.start);
    triggerRef.current.scroll(scrollToTime);
  } 

  return (
    <div ref={galleryRef} className="gallery h-[100vh]">
      <ul className="cards">
        {characters.map((character, i) => (
          <li key={character.name} ref={(el) => cardsRef.current[i] = el}>
            <CarouselItem item={character} />
          </li>
        ))}
      </ul>

      <div className="actions">
        <button className="prev" onClick={() => scrubTo(scrubRef.current.vars.totalTime - 0.1)}>
          Prev
        </button>
        <button className="next" onClick={() => scrubTo(scrubRef.current.vars.totalTime + 0.1)}>
          Next
        </button>
      </div>
    </div>
  )
}

// Build the seamless loop for card animations
function buildSeamlessLoop(items, spacing) {
  const overlap = Math.ceil(1 / spacing);
  const startTime = items.length * spacing + 0.5;
  const loopTime = (items.length + overlap) * spacing + 1;
  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      if (this._time === this._dur) this._tTime += this._dur - 0.01;
    },
  });
  const l = items.length + overlap * 2;
  let time = 0;

  gsap.set(items, { xPercent: 400, opacity: 1, scale: 1 });

  for (let i = 0; i < l; i++) {
    const index = i % items.length;
    const item = items[index];
    time = i * spacing;

    rawSequence
      .fromTo(
        item,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.in', immediateRender: false },
        time
      )
      .fromTo(item, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: 'none', immediateRender: false }, time);

    if (i <= items.length) seamlessLoop.add('label' + i, time);
  }

  rawSequence.time(startTime);
  seamlessLoop.to(rawSequence, {
    time: loopTime,
    duration: loopTime - startTime,
    ease: 'none',
  }).fromTo(
    rawSequence,
    { time: overlap * spacing + 1 },
    { time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: 'none' }
  );

  return seamlessLoop;
}