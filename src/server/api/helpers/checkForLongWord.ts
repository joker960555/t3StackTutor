export const checkForLongWord = (word: string, breakOn: number): boolean => {
  return word.split(" ").some((word) => word.length > breakOn);
};
