import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, RotateCcw, X } from "lucide-react";

interface EMDRVideoPlayerProps {
  videoUrl: string;
  title: string;
  description: string;
  onVideoComplete: () => void;
  isVideoCompleted: boolean;
  autoPlay?: boolean;
  onClose?: () => void;
}

export default function EMDRVideoPlayer({
  videoUrl,
  title,
  description,
  onVideoComplete,
  isVideoCompleted,
  autoPlay = true,
  onClose,
}: EMDRVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onVideoComplete();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadedData = () => {
      console.log("Video loaded successfully:", videoUrl);
      setVideoError(null);
      setIsLoading(false);
      setShowSkeleton(false);
    };

    const handleError = (e: any) => {
      console.error("Video load error:", e);
      console.error("Video URL:", videoUrl);
      setVideoError(`Failed to load video: ${videoUrl}`);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [onVideoComplete]);

  // Auto-play after user interaction
  useEffect(() => {
    if (hasUserInteracted && autoPlay && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [hasUserInteracted, autoPlay]);

  // Force video reload when URL changes + preload for faster start
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setIsLoading(true);
      // Set preload for faster loading
      video.preload = 'metadata';
      video.load(); // Force reload the video source
      console.log("Video reloaded with URL:", videoUrl);
      
      // Show skeleton only if loading takes too long
      const skeletonTimer = setTimeout(() => {
        if (isLoading) setShowSkeleton(true);
      }, 250);
      
      return () => clearTimeout(skeletonTimer);
    }
  }, [videoUrl, isLoading]);

  // Preload Script 1 video on mount for faster session start
  useEffect(() => {
    if (videoUrl && videoUrl.includes('script1')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = videoUrl;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    video.play().catch(console.error);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Video Container with Title */}
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
              <p className="text-slate-600">{description}</p>
            </div>
            
            <div className="relative rounded-lg overflow-hidden aspect-[9/16] bg-black max-w-sm mx-auto">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                preload="metadata"
                playsInline
                muted={isMuted}
                crossOrigin="anonymous"
              >
                <source src={videoUrl} type="video/mp4" />
                <p className="text-white text-center p-8">
                  Your browser does not support the video tag. Please update your browser or try a different one.
                </p>
              </video>

              {/* Close Button - Top Right */}
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}

              {/* Loading skeleton - only shown if loading exceeds 250ms */}
              {showSkeleton && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading video...</p>
                  </div>
                </div>
              )}

              {/* Play overlay for initial interaction */}
              {!hasUserInteracted && !isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 rounded-full p-4"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Simplified Controls - Only main play button and close per amendments */}
          <div className="flex items-center justify-center">
            <Button
              onClick={togglePlay}
              className="bg-primary-green hover:bg-primary-green/90"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 mr-2" />
              ) : (
                <Play className="h-5 w-5 mr-2" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>

          {/* Error Status */}
          {videoError && (
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                ⚠ {videoError}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}