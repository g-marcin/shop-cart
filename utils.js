export default const trimWhiteSpace = (string) => {
  return string.replace(/\s/g, "");
};

export const trimSpecialCharacters = (string) => {
  return string.replace(/^a-zA-Z0-9 ]/g, "").replace(/[&-']/g, "");
};
