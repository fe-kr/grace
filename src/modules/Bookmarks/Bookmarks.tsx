import { MouseEvent, useCallback, useEffect, useState } from "react";

import { Bookmark } from "@/components";
import { BookmarkEventType } from "@/constants/enums";

const Bookmarks = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [data, setData] = useState<Bookmark[] | null>(null);

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
      meta: { videoId: new URL(activeTab.url!).searchParams.get("v") },
    });
  };

  const onInitBookmarks = useCallback(async () => {
    const [activeTab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (!activeTab?.url) {
      return;
    }

    setActiveTab(activeTab);

    const videoId = new URL(activeTab.url).searchParams.get("v") as string;

    chrome.storage.sync.get(videoId, data => {
      const parsedData = data[videoId] ? JSON.parse(data[videoId]) : null;

      setData(parsedData);
    });
  }, []);

  useEffect(() => {
    onInitBookmarks();
  }, [onInitBookmarks]);

  if (!data) {
    return "No Bookmarks";
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
