import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

import { Bookmark } from "@/components";
import { BookmarkEventType } from "@/constants/enums";

const Bookmarks = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [data, setData] = useState<Bookmark[] | null>(null);
  const videoIdRef = useRef<string>("");

  const onPlayBookmark = async (e: MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget.dataset;
    const payload = data?.find(bookmark => bookmark.id === id);

    if (!activeTab?.id) {
      return;
    }

    chrome.tabs.sendMessage(activeTab.id, {
      type: BookmarkEventType.PLAY,
      payload,
    });
  };

  const onDeleteBookmark = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!activeTab?.id) return;

    const { id } = e.currentTarget.dataset;

    chrome.runtime.sendMessage({
      type: BookmarkEventType.DELETE,
      payload: { id },
      meta: { videoId: videoIdRef.current, tabId: activeTab.id },
    });
  };

  const onInitBookmarks = useCallback(async () => {
    const [activeTab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (!activeTab?.url) {
      return;
    }

    setActiveTab(activeTab);

    videoIdRef.current = new URL(activeTab.url).searchParams.get("v")!;

    chrome.storage.sync.get(videoIdRef.current, data => {
      const parsedData = data[videoIdRef.current] ? JSON.parse(data[videoIdRef.current]) : null;

      setData(parsedData);
    });
  }, []);

  useEffect(() => {
    onInitBookmarks();
  }, [onInitBookmarks]);

  useEffect(() => {
    chrome.storage.onChanged.addListener(changes => {
      const parsedData = changes[videoIdRef.current]?.newValue
        ? JSON.parse(changes[videoIdRef.current].newValue)
        : null;

      setData(parsedData);
    });
  }, []);

  if (!data?.length) {
    return <div className="p-2 text-nowrap">No Bookmarks</div>;
  }

  return (
    <div className="p-2">
      <h3 className="w-full font-bold box-border text-center text-white m-0 p-2 rounded-lg bg-red-500">
        YouTube Bookmarks
      </h3>
      <ul className="m-0">
        {data.map(item => (
          <Bookmark {...item} key={item.id} onPlay={onPlayBookmark} onDelete={onDeleteBookmark} />
        ))}
      </ul>
    </div>
  );
};

export default Bookmarks;
