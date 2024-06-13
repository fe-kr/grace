import { MouseEvent } from "react";

import DeleteIcon from "@/assets/delete.svg?react";
import PlayIcon from "@/assets/play_arrow.svg?react";
import { BookmarkEventType } from "@/constants/enums";
import { formatTimestamp } from "@/utils/common";

import IconButton from "../IconButton";

interface BookmarkProps extends Bookmark {
  onDelete: (e: MouseEvent<HTMLButtonElement>) => void;
  onPlay: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Bookmark = ({ id, name, timestamp, onDelete, onPlay }: BookmarkProps) => {
  return (
    <li className="flex items-center p-2 gap-2 border-b border-gray-200">
      <b className="grow line-clamp-2 text-sm" title={name}>
        {name}
      </b>
      <span>{formatTimestamp(timestamp)}</span>

      <IconButton
        icon={PlayIcon}
        label="Play"
        data-id={id}
        data-type={BookmarkEventType.PLAY}
        data-timestamp={timestamp}
        onClick={onPlay}
      />

      <IconButton
        label="Delete"
        icon={DeleteIcon}
        data-id={id}
        data-type={BookmarkEventType.DELETE}
        data-timestamp={timestamp}
        iconClassName="text-red-500"
        onClick={onDelete}
      />
    </li>
  );
};

export default Bookmark;
