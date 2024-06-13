export const checkIsNil = (value: unknown): value is null | undefined =>
  value === undefined || value === null;

export const formatTimestamp = (timestamp: number) => {
  const [formattedValue] = new Date(timestamp).toTimeString().split(" ");

  return formattedValue;
};
