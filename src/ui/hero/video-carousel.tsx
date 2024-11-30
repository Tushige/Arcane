import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const numVideos = 5;

const getNextVideo = (vid: number) => {
  const nextIdx = (vid + 1) % numVideos;
  return nextIdx === 0 ? 1 : nextIdx;
}

export function VideoCarousel() {
  const [currVideoIdx, setCurrVideoIdx] = useState(1);
  const [prevVideoIdx, setPrevVideoIdx] = useState(1); // Track the previous video index
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(new Array(numVideos).fill(null));

  const videoURL = (idx: number) => `videos/hero-${idx}.mp4`;

  const onNextVideoClick = () => {
    setPrevVideoIdx(currVideoIdx); // Update previous video index before changing
    setCurrVideoIdx(prev => getNextVideo(prev));
  }

  useGSAP(() => {
    gsap.set('#next-video', { visibility: 'visible' });

    gsap.from("#next-video", {
      transformOrigin: "center center",
      scale: 0,
      duration: 1,
      ease: "power1.inOut",
      onStart: () => {
        if (videoRefs.current[prevVideoIdx - 1] && videoRefs.current[currVideoIdx - 1]) {
          // Continue playing the previous video's time in the background video
          videoRefs.current[currVideoIdx - 1]!.currentTime = videoRefs.current[prevVideoIdx - 1]!.currentTime;
          videoRefs.current[currVideoIdx - 1]!.play();
        }
      },
    });
  }, {
    dependencies: [currVideoIdx],
    revertOnUpdate: true
  });

  return (
    <div id="video-frame">
      {/* Render all videos in the background, with only one visible at a time */}
      {[...Array(numVideos)].map((_, idx) => {
        const videoIdx = idx + 1;
        return (
          <BackgroundVideo
            key={videoIdx}
            videoUrl={videoURL(videoIdx)}
            ref={(el) => (videoRefs.current[videoIdx - 1] = el)}
            isVisible={currVideoIdx === videoIdx || prevVideoIdx === videoIdx} // Make the previous and current video visible
            videoIdx={videoIdx}
          />
        );
      })}

      <ForegroundVideo
        videoUrl={videoURL(currVideoIdx)}
        onClick={onNextVideoClick}
      />
    </div>
  )
}

interface BackgroundVideoProps {
  videoUrl: string;
  isVisible: boolean;
  videoIdx: number;
  ref: React.Ref<HTMLVideoElement>;
}

const BackgroundVideo = React.forwardRef(
  ({ videoUrl, isVisible, videoIdx }: BackgroundVideoProps, ref: React.Ref<HTMLVideoElement>) => {
    return (
      <video
        ref={ref}
        src={videoUrl}
        loop
        muted
        preload="metadata"
        className={`absolute left-0 top-0 size-full object-cover object-center transition-opacity duration-1000`}
        style={{
          opacity: isVisible ? 1 : 0, // Make it visible or hidden based on the current and previous video index
          zIndex: isVisible ? 1 : 0,  // Keep the previous and current video on top
        }}
      />
    );
  }
);

const ForegroundVideo = ({ videoUrl, onClick }: { videoUrl: string, onClick: () => void }) => {
  return (
    <video
      id="next-video"
      src={videoUrl}
      loop
      muted
      className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-20 size-64 object-cover object-center"
      onClick={onClick}
    />
  );
};
