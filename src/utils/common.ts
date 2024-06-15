export const checkIsNil = (value: unknown): value is null | undefined =>
  value === undefined || value === null;

export const formatTimestamp = (timestamp: number) => {
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const seconds = Math.floor((timestamp % 3600) % 60);

  return [hours, minutes, seconds].join(":");
};
