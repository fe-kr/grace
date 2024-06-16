import { BookmarkEventType, TabStatus } from "@/constants/enums";
import { youtubeVideoRegExp } from "@/constants/regex";

class BackgroundScript {
  constructor() {
    chrome.tabs.onCreated.addListener(tab => this.onInitExtension(tab));
    chrome.tabs.onUpdated.addListener((_, __, tab) => this.onInitExtension(tab));

    chrome.runtime.onMessage.addListener(({ type, payload }, { tab }) => {
      if (type === BookmarkEventType.UPDATE_EXT_COUNTER) {
        chrome.action.setBadgeText({ text: payload, tabId: tab?.id });
      }
    });
  }

  async disableExtension(tabId?: number) {
    const isEnabled = await chrome.action.isEnabled(tabId);

    if (isEnabled) {
      chrome.action.disable(tabId);
      chrome.action.setBadgeText({ text: "", tabId });
    }
  }

  async enableExtension(tab: chrome.tabs.Tab) {
    chrome.action.enable(tab.id);
    chrome.action.setBadgeBackgroundColor({ color: "red" });
    chrome.action.setBadgeTextColor({ color: "white" });

    const data = await chrome.storage.sync.get();
    const videoId = new URL(tab.url!).searchParams.get("v");
    const count = JSON.parse(data[videoId!] || null)?.length;

    chrome.action.setBadgeText({ text: `${count || ""}`, tabId: tab.id });
  }

  async onInitExtension(tab: chrome.tabs.Tab) {
    if (!youtubeVideoRegExp.test(tab.url ?? "")) {
      await this.disableExtension(tab.id);
      return;
    }

    if (tab.status === TabStatus.LOADING) {
      this.enableExtension(tab);
    }

    if (tab.status === TabStatus.COMPLETE) {
      chrome.tabs.sendMessage(tab.id!, { type: BookmarkEventType.INIT_VIDEO_PLAYER });
    }
  }
}

new BackgroundScript();
