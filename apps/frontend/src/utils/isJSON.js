export function isJSON(string) {
  if (!string) return false;
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }
  return true;
}
