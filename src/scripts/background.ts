import { youtubeVideoRegExp } from "@/constants/regex";

export const BookmarkEventType = {
  INIT_VIDEO: "INIT_VIDEO",
  CREATE: "CREATE",
  PLAY: "PLAY",
  DELETE: "DELETE",
};

const sendInitVideoMessage = (tab: chrome.tabs.Tab) => {
  if (!youtubeVideoRegExp.test(tab.url ?? "")) {
    chrome.action.disable(tab.id);
    return;
  }

  chrome.action.enable(tab.id);
  chrome.action.setBadgeBackgroundColor({ color: "red" });
  chrome.action.setBadgeTextColor({ color: "white" });

  chrome.tabs.sendMessage(tab.id!, {
    type: BookmarkEventType.INIT_VIDEO,
    payload: {},
  });
};

const updateStorage = <T>(key: string, mapper: (arg: T[]) => T[]) => {
  const { promise, resolve } = Promise.withResolvers<T[]>();

  chrome.storage.sync.get(key, values => {
    const parsedValues = JSON.parse(values[key] ?? null);
    const mappedValues = mapper(parsedValues ?? []);

    resolve(mappedValues);

    chrome.storage.sync.set({ [key]: JSON.stringify(mappedValues) });
  });

  return promise;
};

chrome.tabs.onUpdated.addListener((_, __, tab) => {
  sendInitVideoMessage(tab);
});

chrome.tabs.onCreated.addListener(tab => {
  sendInitVideoMessage(tab);
});

chrome.runtime.onMessage.addListener(async ({ type, payload, meta }, { tab }) => {
  const tabId = tab?.id || meta?.tabId;

  switch (type) {
    case BookmarkEventType.CREATE: {
      const data = await updateStorage<Bookmark>(meta.videoId, data => [...data, payload]);
      chrome.action.setBadgeText({ text: data.length.toString(), tabId });
      break;
    }

    case BookmarkEventType.DELETE: {
      const data = await updateStorage<Bookmark>(meta.videoId, data =>
        data.filter(({ id }) => id !== payload.id),
      );
      chrome.action.setBadgeText({ text: data.length.toString(), tabId });
      break;
    }

    default:
      return;
  }
});
