import { youtubeVideoRegExp } from "@/constants/regex";

export const BookmarkEventType = {
  INIT_VIDEO: "INIT_VIDEO",
  CREATE: "CREATE",
  PLAY: "PLAY",
  DELETE: "DELETE",
};

const sendInitVideoMessage = (tab: chrome.tabs.Tab) => {
  if (!youtubeVideoRegExp.test(tab.url ?? "")) {
    return;
  }

  chrome.tabs.sendMessage(tab.id!, {
    type: BookmarkEventType.INIT_VIDEO,
    payload: {},
  });
};

const updateStorage = <T>(key: string, mapper: (arg: T[]) => T[]) => {
  chrome.storage.sync.get(key, values => {
    const parsedValues = JSON.parse(values[key] ?? null);
    const mappedValues = mapper(parsedValues ?? []);

    chrome.storage.sync.set({ [key]: JSON.stringify(mappedValues) });
  });
};

chrome.tabs.onUpdated.addListener((_, __, tab) => {
  sendInitVideoMessage(tab);
});

chrome.tabs.onCreated.addListener(tab => {
  sendInitVideoMessage(tab);
});

chrome.runtime.onMessage.addListener(({ type, payload, meta }) => {
  switch (type) {
    case BookmarkEventType.CREATE:
      updateStorage<Bookmark>(meta.videoId, data => [...data, payload]);
      break;

    case BookmarkEventType.DELETE:
      updateStorage<Bookmark>(meta.videoId, data => data.filter(({ id }) => id !== payload.id));
      break;

    default:
      return;
  }
});
