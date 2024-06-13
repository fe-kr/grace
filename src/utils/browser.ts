export const getActiveTab = async () => {
  const [activeTab] = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return activeTab;
};
