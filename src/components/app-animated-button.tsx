import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Clapperboard, X } from 'lucide-react';

const drawButton = ({x, y, padding, elWidth, elHeight, xQOffset, yQOffset}: {
  x: number,
  y: number,
  padding: number, 
  elWidth: number, 
  elHeight: number, 
  xQOffset: number,
  yQOffset: number
}) => {
  const width = elWidth - padding * 2;
  const height = elHeight - padding * 2;
  if (height < 2 * yQOffset) {
    yQOffset = Math.floor(height / 2);
  }
  const d = `
    M ${x + padding + width - xQOffset} ${y + padding}
    Q ${x + padding + width} ${y + padding} ${x + padding + width} ${y + padding + yQOffset}
    L ${x + padding + width} ${y + padding + height - yQOffset}
    Q ${x + padding + width} ${y + padding + height} ${x + padding + width - xQOffset} ${y + padding + height}
    L ${x + padding + xQOffset} ${y + padding + height}
    Q ${x + padding} ${y + padding + height} ${x + padding} ${y + padding + height - yQOffset}
    L ${x + padding} ${y + padding + yQOffset} 
    Q ${x + padding} ${y + padding} ${x + padding + xQOffset} ${y + padding}
    Z
  `
  return d;
}
const AppAnimatedButton = ({text}: {text: string}) => {
  const buttonRef = useRef();
  const pathRef = useRef();
  const [buttonPath, setButtonPath] = useState('');

  const [isMouseOver, setIsMouseOver] = useState(false);

  useGSAP(() => {
    if (!buttonRef.current) return;
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    let x = 0,
      y = 0;

    // regular button
    const d = drawButton({
      x: 0,
      y: 0,
      elWidth: rect.width,
      elHeight: rect.height,
      padding: 10,
      xQOffset: 10,
      yQOffset: 10
    });
    const smallBtn = drawButton({
      x: 0,
      y: 0,
      elWidth: rect.width,
      elHeight: rect.height,
      padding: 12,
      xQOffset: 10,
      yQOffset: 10
    });
    const padding2 = 7;
    const XOffset = 5;
    const qOffset2 = 10;
    const width2 = rect.width - padding2 * 2;
    const height2 = rect.height - padding2 * 2;
    const tilt = 5;

    // big
    const d2 = `
      M ${x + padding2 + width2 - qOffset2} ${y + padding2}
      Q ${x + padding2 + width2 - XOffset} ${y + padding2} ${x + padding2 + width2 - XOffset} ${y + padding2 + qOffset2}
      L ${x + padding2 + width2 - XOffset} ${y + padding2 + height2 - qOffset2}
      Q ${x + padding2 + width2 - XOffset} ${y + padding2 + height2} ${x + padding2 + width2 - qOffset2} ${y + padding2 + height2}
      L ${x + padding2 + qOffset2} ${y + padding2 + height2}
      Q ${x + padding2 + XOffset} ${y + padding2 + height2} ${x + padding2 + XOffset} ${y + padding2 + height2 - qOffset2}
      L ${x + padding2 + XOffset} ${y + padding2 + qOffset2 - tilt} 
      Q ${x + padding2 + XOffset} ${y + padding2 - tilt} ${x + padding2 + qOffset2} ${y + padding2 - tilt}
      Z
    `;
    const padding3 = 5;
    const width3 = rect.width - padding3 * 2;
    const height3 = rect.height - padding3 * 2;
    // expanded big
    const d3 = `
    M ${x + padding3 + width3 - qOffset2} ${y + padding3}
    Q ${x + padding3 + width3 - XOffset} ${y + padding3} ${x + padding3 + width3 - XOffset} ${y + padding3 + qOffset2}
    L ${x + padding3 + width3 - XOffset} ${y + padding3 + height3 - qOffset2}
    Q ${x + padding3 + width3 - XOffset} ${y + padding3 + height3} ${x + padding3 + width3 - qOffset2} ${y + padding3 + height3}
    L ${x + padding3 + qOffset2} ${y + padding3 + height3}
    Q ${x + padding3 + XOffset} ${y + padding3 + height3} ${x + padding3 + XOffset} ${y + padding3 + height3 - qOffset2}
    L ${x + padding3 + XOffset} ${y + padding3 + qOffset2 - tilt} 
    Q ${x + padding3 + XOffset} ${y + padding3 - tilt} ${x + padding3 + qOffset2} ${y + padding3 - tilt}
    Z
  `        
  
    setButtonPath(smallBtn);
    const duration = 0.5;
    const ease = "back.inOut(4)";
    const staggerDelay = 0.1;
    if (isMouseOver) {
      const tl = gsap.timeline();
      tl.to(pathRef.current, {
        attr: {
          d: smallBtn
        },
        duration: 0.1,
        ease: "power4.Out"
      })
      .to(pathRef.current, {
        attr: {
          d: d2
        },
        duration,
        ease,
      })
      .to(pathRef.current, {
        attr: {
          d: d3
        },
        duration: 1,
        ease: "power1.Out",
      })
      .to('.state-0', {
        transform: 'translate(0, -100%)',
        opacity: 0,
        duration,
        ease,
        stagger: staggerDelay
      }, '<-=0.5')
      .to('.state-1', {
        transform: 'translate(0, 0%)',
        opacity: 1,
        duration,
        ease,
        stagger: staggerDelay
      }, '<');
      tl.play();
    } else {
      const tl = gsap.timeline();
      tl.to(pathRef.current, {
        attr: {  
          d: d
        },
        duration,
        ease,
      })
      // leaving
      .to('.state-1', {
        transform: 'translate(0, 100%)',
        opacity: 0,
        duration,
        ease,
        stagger: staggerDelay
      }, '')
      // showing up
      .to('.state-0', {
        transform: 'translate(0, 0%)',
        opacity: 1,
        duration,
        ease,
        stagger: staggerDelay
      }, '0')
    }
  }, {
    dependencies: [isMouseOver]
  })

  const handleMouseOver = () => {
    setIsMouseOver(true);
  }
  return (
    <button
      ref={buttonRef}
      className="btnMain textCaptionBtn hero__cta gap-4 items-center outline-none"
      onMouseEnter={handleMouseOver}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <span className="btnMain__text uppercase font-bold text-center">
        <span
          className="state-0"
          style={{
            opacity: 1,
            transform: 'translate(0px, 0px)'
          }}
        >
          {text}
        </span>
        <span
          className="rollover state-1 absolute left-0 top-0"
          style={{
            transform: 'translate(0px, 100%)',
            opacity: 0
          }}
        >
          {text}
        </span>
      </span>

      <div className="btnMain__icon z-[1] relative size-[1.4rem] order-[-1]">
        <span
          className="state-0 absolute inline-block size-full left-0 top-0"
          style={{
            transform: 'translate(0px, 0px)',
            opacity: 1,
          }}
          >
          <Clapperboard />
        </span>
        <span className="btnMain__iconRollover state-1 absolute inline-block size-full left-0 top-0"
          style={{
            transform: 'translate(0px, 100%)',
            opacity: 0
          }}
        >
          <Clapperboard />
        </span>
      </div>

      <div className="btnMain__shape">
        <svg className="btnMain__shapeIcon" stroke-width="1">
          <path ref={pathRef} className="btnMain__shapePath" d={buttonPath} fill="steelblue">
          </path>
        </svg>
      </div>
    </button>
  )
}

export default AppAnimatedButton;