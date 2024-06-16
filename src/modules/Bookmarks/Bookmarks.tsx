import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

import { Bookmark } from "@/components";
import { BookmarkEventType } from "@/constants/enums";
import storage from "@/services/storage";
import { parseVideoIdFromUrl } from "@/utils/common";

const Bookmarks = () => {
  const [data, setData] = useState<Bookmark[] | null>(null);
  const idsRef = useRef<{ tabId?: number; videoId?: string }>({});

  const isEmptyBookmarksList = !data?.length;

  const onPlayVideo = (e: MouseEvent<HTMLButtonElement>) => {
    const { id, shouldPlay } = e.currentTarget.dataset;

    chrome.tabs.sendMessage(idsRef.current.tabId!, {
      type: BookmarkEventType.SET_VIDEO_PLAYER_TIMESTAMP,
      payload: { ...data?.find((item: Bookmark) => item.id === id), shouldPlay },
    });
  };

  const onDeleteBookmark = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    const { videoId, tabId } = idsRef.current;
    const { id } = e.currentTarget.dataset;

    if (!videoId) {
      return;
    }

    const data = await storage
      .getParsedItem(videoId)
      .then(data => (data ?? []).filter((item: Bookmark) => item.id !== id));

    storage.setItem(videoId, data);
    chrome.action.setBadgeText({ text: data.length.toString(), tabId });

    setData(data);
  }, []);

  const onInitBookmarks = useCallback(async () => {
    const [activeTab] = await chrome.tabs.query({ currentWindow: true, active: true });
    const videoId = parseVideoIdFromUrl(activeTab.url)!;

    if (!videoId) return;

    const data = await storage.getParsedItem(videoId);
    idsRef.current = { videoId, tabId: activeTab.id };

    setData(data);
  }, []);

  useEffect(() => {
    onInitBookmarks().catch(Error);
  }, [onInitBookmarks]);

  return (
    <div className="p-2 min-w-60">
      <h3 className="w-full font-bold box-border text-center text-white m-0 p-2 rounded-lg bg-red-500">
        YouTube Bookmarks
      </h3>
      {isEmptyBookmarksList && <div className="mt-2 text-center">No Data</div>}

      {!isEmptyBookmarksList && (
        <ul className="m-0 max-h-60 overflow-auto scrollbar-gutter-stable">
          {data
            .toSorted((a, b) => a.timestamp - b.timestamp)
            .map(item => (
              <Bookmark
                {...item}
                key={item.id}
                onSetBookmark={onPlayVideo}
                onDeleteBookmark={onDeleteBookmark}
              />
            ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmarks;
