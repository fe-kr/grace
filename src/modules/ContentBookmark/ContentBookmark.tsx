import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import BookmarkIcon from "@/assets/bookmark.svg?react";
import { BookmarkEventType } from "@/constants/enums";
import useDebounce from "@/hooks/useDebounce";
import { checkIsNil, parseVideoIdFromUrl } from "@/utils/common";

const ContentBookmark = () => {
  const youtubePlayerRef = useRef<HTMLVideoElement | null>(null);
  const [bookmarkTarget, setBookmarkTarget] = useState<Element | null>(null);

  const onAddBookmark = useDebounce(async () => {
    const videoId = parseVideoIdFromUrl(window.location.href);
    const currentTime = youtubePlayerRef.current?.currentTime;

    if (!videoId || checkIsNil(currentTime)) {
      return;
    }

    chrome.runtime.sendMessage({
      type: BookmarkEventType.CREATE,
      payload: {
        id: Date.now().toString(),
        timestamp: Math.floor(currentTime),
      },
      meta: { videoId },
    });
  }, 500);

  const onPlayVideo = useCallback((timestamp: number) => {
    if (!youtubePlayerRef.current) {
      return;
    }

    youtubePlayerRef.current.currentTime = timestamp;
  }, []);

  const onInitVideo = useCallback(() => {
    const bookmarkTarget = document.querySelector("ytd-player div.ytp-right-controls");
    youtubePlayerRef.current = document.querySelector("ytd-player video.video-stream");

    setBookmarkTarget(bookmarkTarget);
  }, []);

  const onContentUpdate = useCallback(
    /* eslint-disable @typescript-eslint/no-explicit-any */
    ({ type, payload }: any) => {
      switch (type) {
        case BookmarkEventType.INIT_VIDEO: {
          onInitVideo();
          break;
        }

        case BookmarkEventType.PLAY:
          onPlayVideo(payload.timestamp);
          break;

        default:
          break;
      }
    },
    [onInitVideo, onPlayVideo],
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onContentUpdate);

    return () => {
      chrome.runtime.onMessage.removeListener(onContentUpdate);
    };
  }, [onContentUpdate]);

  if (!bookmarkTarget) {
    return null;
  }

  return createPortal(
    <button
      style={{ float: "left" }}
      className="ytp-button"
      title="Add Bookmark"
      onClick={onAddBookmark}
    >
      <BookmarkIcon />
    </button>,
    bookmarkTarget,
  );
};

export default ContentBookmark;
