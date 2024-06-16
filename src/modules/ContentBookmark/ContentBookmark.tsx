import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "react-tooltip";

import BookmarkIcon from "@/assets/bookmark.svg?react";
import { BookmarkEventType } from "@/constants/enums";
import storage from "@/services/storage";
import { checkIsNil, parseVideoIdFromUrl } from "@/utils/common";

const styles = {
  tooltip: {
    "background-color": "rgba(28, 28, 28, .9)",
    "border-radius": "5px",
    padding: "5px 9px",
    "font-weight": "500",
    "font-size": "13px",
    "font-family": `"YouTube Noto",Roboto,Arial,Helvetica,sans-serif`,
    "line-height": "15px",
  },
};

const ContentBookmark = () => {
  const youtubePlayerRef = useRef<HTMLVideoElement | null>(null);
  const [bookmarkTarget, setBookmarkTarget] = useState<Element | null>(null);
  const tooltipId = useId();

  const onAddBookmark = useCallback(async () => {
    const videoId = parseVideoIdFromUrl(window.location.href);
    const currentTime = youtubePlayerRef.current?.currentTime;

    if (!videoId || checkIsNil(currentTime)) {
      return;
    }

    const payload = {
      id: Date.now().toString(),
      timestamp: Math.floor(currentTime),
    };

    const data = await storage.getParsedItem(videoId).then(data => [...(data ?? []), payload]);

    storage.setItem(videoId, data);

    chrome.runtime.sendMessage({
      type: BookmarkEventType.UPDATE_EXT_COUNTER,
      payload: data.length.toString() || "",
    });
  }, []);

  const onSetBookmark = useCallback((timestamp: number, shouldPlay?: boolean) => {
    if (!youtubePlayerRef.current) {
      return;
    }

    youtubePlayerRef.current.currentTime = timestamp;

    if (shouldPlay) {
      youtubePlayerRef.current.play();
    } else {
      youtubePlayerRef.current.pause();
    }
  }, []);

  const onInitVideo = useCallback(() => {
    const bookmarkTarget = document.querySelector("ytd-player div.ytp-right-controls");
    youtubePlayerRef.current = document.querySelector("ytd-player video.video-stream");

    setBookmarkTarget(bookmarkTarget);
  }, []);

  const onKeyboardPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyB" && e.altKey) {
        onAddBookmark();
      }
    },
    [onAddBookmark],
  );

  const onContentUpdate = useCallback(
    /* eslint-disable @typescript-eslint/no-explicit-any */
    ({ type, payload }: any) => {
      switch (type) {
        case BookmarkEventType.INIT_VIDEO_PLAYER: {
          onInitVideo();
          break;
        }

        case BookmarkEventType.SET_VIDEO_PLAYER_TIMESTAMP:
          onSetBookmark(payload.timestamp, payload.shouldPlay);
          break;

        default:
          break;
      }
    },
    [onInitVideo, onSetBookmark],
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onContentUpdate);

    document.addEventListener("keyup", onKeyboardPress);

    return () => {
      chrome.runtime.onMessage.removeListener(onContentUpdate);
      document.removeEventListener("keyup", onKeyboardPress);
    };
  }, [onContentUpdate, onKeyboardPress]);

  if (!bookmarkTarget) {
    return null;
  }

  return createPortal(
    <>
      <button
        style={{ float: "left" }}
        data-tooltip-id={tooltipId}
        data-tooltip-content={"Add Bookmark (alt + b)"}
        className="ytp-button"
        onClick={onAddBookmark}
      >
        <BookmarkIcon />
      </button>

      <Tooltip style={styles.tooltip} noArrow id={tooltipId} />
    </>,
    bookmarkTarget,
  );
};

export default ContentBookmark;
