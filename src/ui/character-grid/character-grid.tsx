import { useEffect, useRef, useState } from 'react'
import './character-grid.css'
import gsap from 'gsap'
import { Flip, ScrollTrigger } from 'gsap/all';
import { AppAnimatedTitle } from '../../components/app-animated-title';
import { AppAnimatedText } from '../../components/app-animated-text';
import { motion, useInView } from 'motion/react';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollTrigger)
const images = [
  {
    src: 'img/characters/ambessa.png',
    class: 'intro-grid__img pos-11',
    name: 'Ambessa',
    description: 'Ambessa, a Noxian warrior and Mel’s mother, swears to protect her family’s name…even if it means going against her daughter’s wishes.'
  },
  {
    src: 'img/characters/caitlyn.png',
    class: 'intro-grid__img pos-16',
    name: 'Caitlyn',
    description: 'Caitlyn is an Enforcer from Piltover. She once used her investigative prowess to expose the source of corruption in Zaun and Piltover, but after Jinx’s attack on the council, she’s abandoned hope for peace.'
  },
  {
    src: 'img/characters/ekko.png',
    class: 'intro-grid__img pos-9',
    name: 'Ekko',
    description: 'Ekko empowers the Firelights, a group of Zaunites who build a new home they all fight to protect. He found an unlikely friend in Heimerdinger, and together they strive to make Zaun better.'
  },
  {
    src: 'img/characters/heimerdinger.png',
    class: 'intro-grid__img pos-12',
    name: 'Heimerdinger',
    description: 'Heimerdinger warned the Piltover Council about the dangers of using magic without tangible solutions for safeguarding its use. Learning from his mistakes with Jayce, Heimerdinger inspires Ekko to keep looking for a solution and works with him to solve the problem, instead of just offering advice.'
  },
  {
    src: 'img/characters/finn.webp',
    class: 'intro-grid__img pos-17',
    name: 'Finn',
    description: 'Finn is a chem-baron and the boss of the  Slickjaws.'
  },
  {
    src: 'img/characters/jinx.png',
    class: 'intro-grid__img pos-20',
    name: 'Jinx',
    description: 'Jinx was torn between two identities: the strong, powerful, daughter Silco raised and the fearful, weak, little sister Vi protected. Now, accepting she’s the monster that Vi created, Jinx becomes a hollow shell—she is the cursed "Jinx" that ruins everything.'
  },
  {
    src: 'img/characters/mel.jpg',
    class: 'intro-grid__img pos-21',
    name: 'Mel',
    description: "Mel’s prudent investment in Hextech has transformed Piltover into one of the greatest trading hubs in Runeterra, and her into one of the most influential people in the city. Reeling from Jinx’s attack, Mel takes a stand against her mother and Councilman Salo to protect Jayce's dream."
  },
  {
    src: 'img/characters/sevika.jpg',
    class: 'intro-grid__img pos-13',
    name: 'Sevika',
    description: 'Sevika has lived her entire life in the shadows of Piltover. As chem-barons wage war against each other for the Zaun throne left vacant by Silco’s death, Sevika never loses sight of what the true enemy is - Topside.'
  },
  {
    src: 'img/characters/vi.png',
    class: 'intro-grid__img pos-14',
    name: 'Vi',
    description: 'Accepting Powder is gone, Vi comes to terms with what she must do—handle the monster she created: Jinx. Knowing how dangerous her sister is, Vi teams up with Caitlyn and gives in to her request to don the Enforcer badge.'
  },
  {
    src: 'img/characters/viktor.jpg',
    class: 'intro-grid__img pos-19',
    name: 'Viktor',
    description: 'Viktor pushes the limits of Hextech despite warnings of its dangers. Driven by guilt, Viktor sets out to fulfill his dream of giving Hextech to the people.'
  },
  {
    src: 'img/characters/warwick.jpg',
    class: 'intro-grid__img pos-15',
    name: 'Warwick',
    description: "A beast of Singed's creation, Warwick’s primal rage clashes with the fragmented humanity that still lies within the creature—can Vander be saved beneath all the pain?"
  },
  {
    src: 'img/characters/silco.jpg',
    class: 'intro-grid__img pos-18',
    name: 'Silco',
    description: "Silco sought to free the undercity from Piltover Crest icon Piltover's control and was willing to resort to brutal and unethical methods to achieve that goal."
  },
  {
    src: 'img/characters/singed.webp',
    class: 'intro-grid__img pos-22',
    name: 'Singed',
    description: 'Singed is a Zaun Crest icon Zaunite scientist of unmatched intellect, who has devoted his life to pushing the boundaries of knowledge—with no price, even his own sanity, too high to pay.'
  },
  {
    src: 'img/characters/jayce.jpg',
    class: 'intro-grid__img pos-10',
    name: 'Jayce',
    description: 'After a series of events, Jayce questions his vision of using Hextech to better the lives of Piltovans. Meanwhile, together with Heimerdinger and Ekko, Jayce discovers that the use of Hextech has been poisoning the undercity. And as they investigate, they come across something more.'
  },
]

const INTRO_GRID = '.intro-grid--images';
const GRID_IMAGES = '.intro-grid__img';
const GRID_LABELS = '.intro-grid--labels > .intro-grid__label > .oh__inner';

const SLIDER_TITLE_EL = '.slider-title';

const CLOSE_CTRL = 'button.close';
const NAV = 'nav.nav';

function CharacterGrid() {
  const gridImagesContainerRef = useRef();
  const [mode, setMode] = useState<'slider' | 'grid'>('grid');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const gridImagesRef = useRef(Array(images.length));
  const isInView = useInView(gridImagesContainerRef, { once: true })
  const [isTitleVisible, setIsTitleVisible] = useState(true);

  const showSlider = (idx: number) => {
    if (isAnimating || mode === 'slider') return;
    setIsAnimating(true);
    setMode('slider');

    const DURATION = 1;
    const EASE = 'power4.inOut';
    const labelSelectors = ['.intro-title > .intro-title__main > .oh__inner', '.intro-title > .intro-title__sub > .oh__inner'];
    const image = gridImagesRef.current[idx];

    gsap.timeline({
      defaults: {
        duration: DURATION,
        ease: EASE
      },
      onComplete: () => setIsAnimating(false)
    })
    .addLabel('start', 0)
    .to(labelSelectors, {
      yPercent: -100
    }, 'start')
    .to(image, {
      filter: 'grayscale(0)'
    }, 'start')
    .add(() => {
      const flipState = Flip.getState(GRID_IMAGES);
      document.querySelector(INTRO_GRID)?.classList.add('intro-grid--slider');
      gsap.set(INTRO_GRID, {
        yPercent: -100 * idx
      });
      // animate all
      Flip.from(flipState, {
        duration: DURATION,
        ease: EASE,
        absolute: true,
        stagger: {
          each: 0.02,
          from: idx
        },
        simple: true,
        prune: true
      });
    }, 'start')
    // hide the main title
    .set(SLIDER_TITLE_EL, {
      opacity: 1,
      onComplete: () => {
        setIsTitleVisible(false);
      }
    }, 'start')
    // show the name tag
    .fromTo([`.name-tag-${idx}`], {
      y: '-100%',
    }, {
      y: 0,
    }, 'start+=1')
    // show the character description
    .fromTo([`.character-description-${idx}`], {
      y: '100%'
    }, {
      y: 0
    }, 'start+=1')
    .add(() => {
      // add controls--open to .controls
    }, 'start')
    .fromTo([CLOSE_CTRL, NAV], {
      scale: 0
    }, {
      opacity: 1,
      scale: 1,
      stagger: 0.02
    }, 'start')
    setCurrentIdx(idx);
  }

  const hideSlider = () => {
    if (isAnimating || mode === 'grid') return;
    setIsAnimating(true);
    setMode('grid');

    const DURATION = 1;
    const EASE = 'power4.inOut';

    gsap
    .timeline({
      defaults: {
        duration: DURATION,
        ease: EASE
      },
      onComplete: () => setIsAnimating(false)
    })
    .to([CLOSE_CTRL, NAV], {
      opacity: 0,
      scale: 0
    }, 'start')
    // hide the name tag
    .to([`.name-tag-${currentIdx}`], {
      y: '-100%',
    }, 'start')
    // hide the character description
    .to(`.character-description-${currentIdx}`, {
      y: '100%'
    }, 'start')
    .add(() => {
      // remove controls--open
      
    }, 'start')
    .add(() => {
      const flipState = Flip.getState(GRID_IMAGES, {
        props: 'filter'
      });
      // remove intro-grid--slider
      document.querySelector(INTRO_GRID)?.classList.remove('intro-grid--slider');
      gsap.set(INTRO_GRID, {
        yPercent: 0
      });
      // animate all
      Flip.from(flipState, {
        duration: DURATION,
        ease: EASE,
        absolute: true,
        stagger: {
          each: 0.02,
          from: currentIdx
        },
        simple: true,
        prune: true
      });
    }, 'start+=1')
    .to(gridImagesRef.current[currentIdx], {
      filter: 'grayscale(100%)',
      scale: 1.3,
    }, 'start+=1')
    .to([GRID_LABELS], {
      yPercent: 0,
      onComplete: () => {
        setIsTitleVisible(true);
      }
    }, 'start+=1')

  }

  const onMouseEnterHandler = (e) => {
    if (mode === 'slider') return;
    gsap.to(e.target, {
      filter: 'grayscale(0)',
      scale: 1,
      duration: 1,
      ease: 'power4',
    });
  }
  const onMouseLeaveHandler = (e) => {
    if (mode === 'slider') return;
    gsap.to(e.target, {
      filter: 'grayscale(100%)',
      scale: 1.3,
      duration: 1,
      ease: 'power4'
    });
  }

  /**
   * In View Animation
   * we apply the animation individually to each target because we want to assign a different delay value to each
   * we set the isAnimating to true to ensure that we don't fire a character animation whilst other characters are loading. If we allow that, it messes up the layout.
   */
  useGSAP(() => {
    let completedAnimations = 0;
    const characterContainers = gsap.utils.toArray('.character-container');
    setIsAnimating(true);
    characterContainers.forEach((container: TweenTarget, idx) => {
      gsap.fromTo(
        container, {
          scale: 0,
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          delay: Math.random() * 2,
          scrollTrigger: {
            trigger: gridImagesContainerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            once: true
          },
          onComplete: () => {
            completedAnimations++;
            if (completedAnimations === characterContainers.length) {
              setIsAnimating(false);
            }
          }
        }
      )
    })
  })

  return (
    <section className="overflow-hidden grid-container">
			<div className="frame">
			</div>
			<div className="intro-grid intro-grid--labels">
				<span className="intro-grid__label pos-1 relative overflow-hidden"><span className="will-change-transform inline-block">I</span></span>
				<span className="intro-grid__label pos-2 relative overflow-hidden"><span className="will-change-transform inline-block">II</span></span>
				<span className="intro-grid__label pos-3 relative overflow-hidden"><span className="will-change-transform inline-block">III</span></span>
				<span className="intro-grid__label pos-4 relative overflow-hidden"><span className="will-change-transform inline-block">IV</span></span>
				<span className="intro-grid__label pos-5 relative overflow-hidden"><span className="will-change-transform inline-block">V</span></span>
				<span className="intro-grid__label pos-6 relative overflow-hidden"><span className="will-change-transform inline-block">VI</span></span>
				<span className="intro-grid__label pos-7 relative overflow-hidden"><span className="will-change-transform inline-block">VII</span></span>
				<span className="intro-grid__label pos-8 relative overflow-hidden"><span className="will-change-transform inline-block">VIII</span></span>
			</div>
      <div ref={gridImagesContainerRef} className={`intro-grid intro-grid--images`}>
				{
          images.map((image, idx) => (
            <div
              key={idx}
              className={`${image.class} character-container relative overflow-hidden`}
            >
              <div
                ref={(el) => gridImagesRef.current[idx] = el}
                style={{
                  backgroundImage: `url(${image.src})`,
                  transform: 'scale(1.3)'
                }}
                className="size-full object-cover bg-cover bg-center grayscale"
                onMouseEnter={onMouseEnterHandler}
                onMouseLeave={onMouseLeaveHandler}
                onClick={() => showSlider(idx)}
              />
              <div className="slider-title size-full absolute top-0 left-0 overflow-hidden">
                <span className={`name-tag-${idx} will-change-transform translate-y-[-100%] text-lg text-white p-4 uppercase absolute top-0 left-0 bg-[#141514]`}>
                  {image.name}
                </span>
                <p className={`character-description-${idx} translate-y-[100%] will-change-transform text-md text-white p-4 uppercase absolute bottom-0 left-0 bg-[#141514]`}>
                  {image.description}
                </p>
              </div>
            </div>
          ))
        }
			</div>

			<div className="intro-title overflow-hidden">
        <AppAnimatedTitle
          id="characters-title"
          text="Meet The Cast"
          hidden={!isTitleVisible}
          className="text-2xl md:text-6xl lg:text-8xl font-bold text-red-700 will-change-transform" 
        />
			</div>

			<div className={`controls ${mode === 'slider' ? 'controls--open' : ''}`}>
				<button className="unbutton close border-solid border-2 rounded-full text-red-500 border-red-500" onClick={hideSlider}>X</button>
			</div>

		</section>
  )
}

export default CharacterGrid
