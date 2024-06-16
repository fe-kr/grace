import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

import { Bookmark } from "@/components";
import { BookmarkEventType } from "@/constants/enums";
import storage from "@/services/storage";
import { parseVideoIdFromUrl } from "@/utils/common";

const Bookmarks = () => {
  const [data, setData] = useState<Bookmark[] | null>(null);
  const idsRef = useRef<{ tabId?: number; videoId?: string }>({});

  const onPlayVideo = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(BookmarkEventType.PLAY, idsRef, data);
    chrome.tabs.sendMessage(idsRef.current.tabId!, {
      type: BookmarkEventType.PLAY,
      payload: data?.find(({ id }) => id === e.currentTarget.dataset.id),
    });
  };

  const onUpdateBookmarks = useCallback((changes: Record<string, chrome.storage.StorageChange>) => {
    const videoId = idsRef.current?.videoId;

    if (!videoId || !changes[videoId]) return;

    const parsedData = JSON.parse(changes[videoId].newValue || null);

    setData(parsedData);
  }, []);

  const onDeleteBookmark = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    chrome.runtime.sendMessage({
      type: BookmarkEventType.DELETE,
      payload: e.currentTarget.dataset,
      meta: idsRef.current,
    });
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

  useEffect(() => {
    storage.addListener(onUpdateBookmarks);

    return () => {
      storage.removeListener(onUpdateBookmarks);
    };
  }, [onUpdateBookmarks]);

  if (!data?.length) {
    return <div className="p-2 text-nowrap">No Bookmarks</div>;
  }

  return (
    <div className="p-2">
      <h3 className="w-full font-bold box-border text-center text-white m-0 p-2 rounded-lg bg-red-500">
        YouTube Bookmarks
      </h3>
      <ul className="m-0">
        {data
          .toSorted((a, b) => a.timestamp - b.timestamp)
          .map(item => (
            <Bookmark {...item} key={item.id} onPlay={onPlayVideo} onDelete={onDeleteBookmark} />
          ))}
      </ul>
    </div>
  );
};

export default Bookmarks;
