import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import BookmarkIcon from "@/assets/bookmark.svg?react";
import { BookmarkEventType } from "@/constants/enums";
import useDebounce from "@/hooks/useDebounce";
import { checkIsNil } from "@/utils/common";

const ContentBookmark = () => {
  const youtubePlayerRef = useRef<HTMLVideoElement | null>(null);
  const [bookmarkTarget, setBookmarkTarget] = useState<Element | null>(null);

  const onAddBookmark = useDebounce(async () => {
    const videoId = new URLSearchParams(window.location.search).get("v");

    const { currentTime } = youtubePlayerRef.current || {};

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
  }, 1000);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(({ type, payload }) => {
      switch (type) {
        case BookmarkEventType.INIT_VIDEO: {
          youtubePlayerRef.current = document.querySelector("ytd-player video.video-stream");
          setBookmarkTarget(document.querySelector("ytd-player div.ytp-right-controls"));
          break;
        }

        case BookmarkEventType.PLAY: {
          if (!youtubePlayerRef.current) return;
          youtubePlayerRef.current.currentTime = payload.timestamp;
          break;
        }

        default:
          return null;
      }
    });
  }, []);

  if (!bookmarkTarget) {
    return null;
  }

  return createPortal(
    <button
      className="ytp-button ytp-button-grace-ext-bookmark"
      title="Add Bookmark"
      onClick={onAddBookmark}
    >
      <BookmarkIcon />
    </button>,
    bookmarkTarget,
  );
};

export default ContentBookmark;
