"use client";

export const dynamic = "force-dynamic";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import nextDynamic from "next/dynamic";
import BottomNav from "@/components/BottomNav";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/track";

const ReelCard = nextDynamic(
() => import("@/components/ReelCard"),
{
ssr:false
}
);

type Video = {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

function FeedContent() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] =
  useState(false);

  const [promptOptions, setPromptOptions] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const startIndex = Number(searchParams.get("index") || 0);
  const [initialIndex, setInitialIndex] = useState(0);

  const startY = useRef(0);

  const sessionStart =
  useRef<number>(0);

  const wheelLock = useRef(false);

  useEffect(() => {
    sessionStart.current =
      Date.now();
  }, []);

  const goToIndex = useCallback(
     (index: number, smooth: boolean = true) => {
        const safeIndex = Math.max(0, Math.min(index, videos.length - 1));

        setCurrentIndex(safeIndex);

        track(
          "reel_view",
          {
            reelIndex: safeIndex,
            reelId:
              videos[safeIndex]?._id
          }
        );

        const target = document.getElementById(`reel-${safeIndex}`);

        target?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
        });
     },
     [videos] 
 );

  useEffect(() => {
    const promptPool = [
      "Starting the hard task",
      "Failure",
      "Being judged",
      "Your unfinished work",
      "Wasted time",
      "Phone addiction",
      "Discomfort",
      "Your future self",
      "Responsibility",
      "Hard work",
      "Consistency",
      "The truth about your habits",
      "Trying again",
      "Silence",
      "Reality",
    ];

    const getRandomPrompts = () => {
      return [...promptPool]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    };

    const init = async () => {
      const cachedFeed =
        localStorage.getItem("cachedFeed");

      if (cachedFeed) {
        const parsed =
          JSON.parse(cachedFeed);

        setVideos(parsed);
      }

    const res = await fetch(
      "/api/videos"
    );

    const data = await res.json();

    localStorage.setItem(
      "cachedFeed",
      JSON.stringify(data.data)
    );

    const lastIndex = Number(
      localStorage.getItem(
        "lastIndex"
      ) || 0
    );

    const lastOpen = Number(
      localStorage.getItem(
        "lastOpen"
      ) || 0
    );

    const now = Date.now();

    const shouldRefresh =
      now - lastOpen >
      1000 * 60 * 60 * 2;

    localStorage.setItem(
      "lastOpen",
      now.toString()
    );

    track("app_open");

    const finalVideos =
      shouldRefresh
        ? [...data.data].sort(
            () => Math.random() - 0.5
          )
        : data.data;

    setVideos(finalVideos);

    setInitialIndex(
      shouldRefresh
        ? 0
        : lastIndex
    );

    const introSeen =
      sessionStorage.getItem(
        "introSeen"
      );

    if (introSeen) {
      setIsLoading(false);
      setShowPrompt(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);

      setPromptOptions(
        getRandomPrompts()
      );

      setShowPrompt(true);

    setTimeout(() => {
      setShowPrompt(false);

      sessionStorage.setItem(
        "introSeen",
        "true"
      );
    }, 8000);

  }, 600);
};

    init();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "lastIndex",
      currentIndex.toString()
    );
  }, [currentIndex]);

 useEffect(() => {
  const startTime =
    sessionStart.current;

  return () => {
    track(
      "session_duration",
      {
        seconds: Math.floor(
          (
            Date.now() -
            startTime
          ) / 1000
        )
      }
    );
  };
}, []);

  useEffect(() => {
  const nextVideo =
    videos[currentIndex + 1];

  if (!nextVideo) return;

  const video =
    document.createElement("video");

  video.src =
    nextVideo.videoUrl;

  video.preload =
    "metadata";

}, [currentIndex, videos]);

  useEffect(() => {
    const handler = (
      e: Event
    ) => {
      e.preventDefault();

      setInstallPrompt(
        e as BeforeInstallPromptEvent
      );
    };

    setTimeout(() => {
      setShowInstallBanner(true);

      setTimeout(() => {
        setShowInstallBanner(false);
      }, 10000);
    }, 9000);

    window.addEventListener(
      "beforeinstallprompt",
      handler as EventListener
    );

    const appInstalledHandler = () => {
       track("install_success");

      setShowInstallBanner(false);
      setInstallPrompt(null);
    };

    window.addEventListener(
      "appinstalled",
      appInstalledHandler
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
      window.removeEventListener(
        "appinstalled",
        appInstalledHandler
      );
    };
  }, []);

  useEffect(() => {
    if (!videos.length) return;
    if (isLoading || showPrompt) return;

    const timer = setTimeout(() => {  
      goToIndex(initialIndex, false);
    }, 150);

    return () => clearTimeout(timer);
  }, [videos.length,  initialIndex, startIndex, isLoading, showPrompt, goToIndex]);

  

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;

    if (Math.abs(diff) < 60) return;

    if (diff > 0) {
      goToIndex(currentIndex + 1);
    } else {
      goToIndex(currentIndex - 1);
    }
  };

  const handleWheel = (
  e: React.WheelEvent
) => {
  if (wheelLock.current) return;

  wheelLock.current = true;

  if (e.deltaY > 0) {
    goToIndex(currentIndex + 1);
  } else {
    goToIndex(currentIndex - 1);
  }

  setTimeout(() => {
    wheelLock.current = false;
  }, 400);
};

  const handleInstall = async () => {
    if (!installPrompt) return;

    track(
      "install_clicked"
    );

    installPrompt.prompt();

    const choice =
      await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  return (
    <main
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative h-dvh overflow-hidden overscroll-none pb-24 flex justify-center bg-linear-to-b from-zinc-900 to-black"
    >
    <div className="relative h-full w-full bg-black overflow-hidden md:max-w-[430px]">
      
       {showInstallBanner && installPrompt && (
        <div className="fixed top-4 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border border-white/10 bg-black/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Install InspireX
              </p>

              <p className="text-xs text-zinc-400">
                Open instantly like a real app
              </p>
            </div>

            <button
              onClick={handleInstall}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black"
            >
              Install
            </button>
          </div>
        </div>
      )}
      
      {videos.map((video, index) => (
        <div
          id={`reel-${index}`}
          key={video._id}
        >
          <ReelCard
            title={video.title}
            videoUrl={video.videoUrl}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            canPlay={
              !isLoading &&
              !showPrompt
            }
            shouldPreload={
              index === currentIndex
            }
          />
        </div>
      ))}

      {showPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/88 px-6">
          <div className="w-full max-w-md text-center text-white animate-fadeIn">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
              InspireX
            </p>

            <h1 className="text-3xl font-semibold leading-tight">
              What are you avoiding?
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Choose honestly.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {promptOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setShowPrompt(false)}
                  className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-zinc-200 backdrop-blur active:scale-95"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
          <h1 className="text-4xl font-semibold tracking-tight">
            InspireX
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Loading focus...
          </p>

          <div className="mt-6 flex gap-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:0.3s]" />
          </div>
        </div>
      )}

      {!isLoading && !showPrompt && <BottomNav />}

      {!isLoading && !showPrompt && (
        <div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
          <button
            onClick={() => goToIndex(currentIndex - 1)}
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur text-white"
          >
            ↑
          </button>

          <button
            onClick={() => goToIndex(currentIndex + 1)}
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur text-white"
          >
            ↓
          </button>
        </div>
      )}

    </div>
    </main>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"><h1 className="text-4xl font-semibold tracking-tight">InspireX</h1><p className="mt-3 text-sm text-zinc-400">Loading focus...</p></div>}>
      <FeedContent />
    </Suspense>
  );
}