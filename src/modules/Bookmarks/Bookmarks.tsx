import { MouseEvent } from "react";

import { Bookmark } from "@/components";
import { getActiveTab } from "@/utils/browser";
import { checkIsNil } from "@/utils/common";

interface BookmarksProps {
  data: Array<Bookmark>;
}

const Bookmarks = ({ data }: BookmarksProps) => {
  const onBookmarkIconClick = async (e: MouseEvent<HTMLButtonElement>) => {
    const { timestamp, type, id } = e.currentTarget.dataset;

    const activeTab = await getActiveTab();

    if (checkIsNil(activeTab.id)) {
      return;
    }

    chrome.tabs.sendMessage(activeTab.id, {
      id,
      type,
      value: timestamp,
    });
  };

  return (
    <div className="p-2">
      <h3 className="w-full font-bold box-border text-center text-white m-0 p-2 rounded-lg bg-red-500">
        YouTube Bookmarks
      </h3>
      <ul className="m-0">
        {data.map(item => (
          <Bookmark
            {...item}
            key={item.id}
            onPlay={onBookmarkIconClick}
            onDelete={onBookmarkIconClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default Bookmarks;
