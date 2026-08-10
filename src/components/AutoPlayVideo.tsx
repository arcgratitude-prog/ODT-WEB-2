import React, { useEffect, useRef } from 'react';

interface AutoPlayVideoProps {
  src: string;
  isMuted?: boolean;
  className?: string;
  onCanPlay?: () => void;
}

export const AutoPlayVideo: React.FC<AutoPlayVideoProps> = ({
  src,
  isMuted = true,
  className = "w-full h-full object-cover object-center",
  onCanPlay
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Force native DOM properties for iOS Safari & Android Chrome autoplay compliance
    videoEl.defaultMuted = isMuted;
    videoEl.muted = isMuted;
    if (isMuted) {
      videoEl.setAttribute('muted', 'true');
    } else {
      videoEl.removeAttribute('muted');
    }
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');

    const attemptPlay = () => {
      if (!videoEl) return;
      videoEl.muted = isMuted;
      if (!isMuted) {
        videoEl.removeAttribute('muted');
      }
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback: If autoplay with unmuted sound failed, force muted and play
          if (!isMuted) {
            videoEl.muted = true;
            videoEl.setAttribute('muted', 'true');
            videoEl.play().catch(() => {});
          }
        });
      }
    };

    attemptPlay();

    // User interaction unlock events for mobile browsers
    const handleGesture = () => {
      attemptPlay();
    };

    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('touchend', handleGesture, { passive: true });
    window.addEventListener('click', handleGesture, { passive: true });
    window.addEventListener('scroll', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('touchend', handleGesture);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('scroll', handleGesture);
    };
  }, [src, isMuted]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted={isMuted}
      playsInline
      preload="auto"
      onLoadedMetadata={() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }}
      onCanPlay={() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
        if (onCanPlay) onCanPlay();
      }}
      className={className}
    />
  );
};

