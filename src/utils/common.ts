export const checkIsNil = (value: unknown): value is null | undefined =>
  value === undefined || value === null;

export const formatTimestamp = (timestamp: number) => {
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const seconds = Math.floor((timestamp % 3600) % 60);

  return [hours, minutes, seconds].map(item => item.toString().padStart(2, "0")).join(":");
};

export const parseVideoIdFromUrl = (url: string = "") => {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
};
