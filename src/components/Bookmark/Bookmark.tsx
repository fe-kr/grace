import { MouseEvent } from "react";

import FlagIcon from "@/assets/bookmark_flag.svg?react";
import DeleteIcon from "@/assets/delete.svg?react";
import PlayIcon from "@/assets/play_arrow.svg?react";
import { formatTimestamp } from "@/utils/common";

import IconButton from "../IconButton";

interface BookmarkProps extends Bookmark {
  onDeleteBookmark: (e: MouseEvent<HTMLButtonElement>) => void;
  onSetBookmark: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Bookmark = ({ id, timestamp, onDeleteBookmark, onSetBookmark }: BookmarkProps) => {
  return (
    <li className="flex items-center p-2 gap-2 border-b border-gray-200">
      <span className="text-nowrap">{`Bookmark at ${formatTimestamp(timestamp)}`}</span>

      <IconButton
        icon={PlayIcon}
        label="Play Bookmark"
        data-id={id}
        data-should-play
        onClick={onSetBookmark}
      />

      <IconButton
        icon={FlagIcon}
        label="Move to Bookmark"
        iconClassName="text-green-500"
        data-id={id}
        onClick={onSetBookmark}
      />

      <IconButton
        label="Delete Bookmark"
        icon={DeleteIcon}
        data-id={id}
        iconClassName="text-red-500"
        onClick={onDeleteBookmark}
      />
    </li>
  );
};

export default Bookmark;
