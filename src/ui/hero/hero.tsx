import { ForwardedRef, forwardRef, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const numVideos = 5;

const getNextVideo = (vid: number) => {
  const nextIdx = (vid + 1) % numVideos;
  return nextIdx === 0 ? 1 : nextIdx;
}

export function Hero() {
  const [currVideoIdx, setCurrVideoIdx] = useState(1);
  const [prevVideoIdx, setPrevVideoIdx] = useState(1);  // To store the previous video index
  const foregroundVideoRef = useRef<HTMLVideoElement | null>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement | null>(null);

  const videoURL = (idx: number) => `videos/hero-${idx}.mp4`;
  const videoPosterURL = (idx: number) => `videos/hero-cut-${idx}.png`;

  const onNextVideoClick = () => {
    // Capture the current time before changing the video index
    if (foregroundVideoRef.current) {
      const currentTime = foregroundVideoRef.current.currentTime;
      setPrevVideoIdx(currVideoIdx);  // Store the current index as the previous index

      // Update the current video index after storing the previous one
      setCurrVideoIdx(prev => getNextVideo(prev));

      // Sync the background video with the captured current time after a small delay
      setTimeout(() => {
        if (backgroundVideoRef.current) {
          backgroundVideoRef.current.currentTime = currentTime; // Set background video to current time
          backgroundVideoRef.current.play();  // Continue playing the background video from that time
        }
      }, 50); // Small delay to ensure that the video source change happens after syncing
    }
  };

  useGSAP(() => {
    gsap.set('#next-video', { visibility: 'visible' });

    gsap.from("#next-video", {
      transformOrigin: "center center",
      scale: 0,
      duration: 1,
      ease: "power1.inOut",
      onStart: () => {
        if (foregroundVideoRef.current && backgroundVideoRef.current) {
          // Ensure foreground video continues playing
          foregroundVideoRef.current.play();
        } else {
          console.log('oops');
        }
      },
    });
  }, {
    dependencies: [currVideoIdx],
    revertOnUpdate: true
  });

  return (
    <div id="video-frame">
      <BackgroundVideo
        videoUrl={videoURL(prevVideoIdx)}  // Use the previous video's index for the background
        poster={videoPosterURL(prevVideoIdx)}
        ref={backgroundVideoRef}
      />
      <ForegroundVideo
        videoUrl={videoURL(currVideoIdx)}  // Use the current video index for the foreground
        poster={videoPosterURL(currVideoIdx)}
        ref={foregroundVideoRef}
        onClick={onNextVideoClick}
      />
    </div>
  );
}

const BackgroundVideo = forwardRef(
  ({ videoUrl, poster }: { videoUrl: string, poster: string }, ref: ForwardedRef<HTMLVideoElement>) => {
    return (
      <video
        ref={ref}
        poster={poster}
        src={videoUrl}
        autoPlay
        loop
        muted
        preload="auto"  // Ensure preloading
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
    );
  }
);

const ForegroundVideo = forwardRef(
  ({ videoUrl, onClick, poster }: { videoUrl: string, onClick: () => void, poster: string }, ref: ForwardedRef<HTMLVideoElement>) => {
    return (
      <video
        id="next-video"
        ref={ref}
        src={videoUrl}
        poster={poster}
        loop
        muted
        preload="auto"  // Ensure preloading
        className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-20 size-full object-cover object-center"
        onClick={onClick}
      />
    );
  }
);
