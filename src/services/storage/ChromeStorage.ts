export class ChromeStorage {
  storage;

  constructor(areaName: chrome.storage.AreaName) {
    this.storage = chrome.storage[areaName];
  }

  async getItem(key: string) {
    return this.storage.get(key);
  }

  async getParsedItem(key: string) {
    try {
      const data = await this.getItem(key);

      return JSON.parse(data[key]);
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: unknown) {
    return this.storage.set({ [key]: JSON.stringify(value) });
  }

  async removeItem(key: string) {
    return this.storage.remove(key);
  }

  async clear() {
    return this.storage.clear();
  }

  addListener(...args: Parameters<typeof chrome.storage.onChanged.addListener>) {
    chrome.storage.onChanged.addListener(...args);
  }

  removeListener(...args: Parameters<typeof chrome.storage.onChanged.removeListener>) {
    chrome.storage.onChanged.removeListener(...args);
  }
}
