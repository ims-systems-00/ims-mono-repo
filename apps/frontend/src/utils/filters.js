export function filterIt(arr, searchKey) {
  /**
   * if search key is not given we are assuming no filtering is required and returns all data by deefault
   */
  if (!searchKey) return true;
  arr = arr.filter((obj) =>
    Object.keys(obj).some((key) => obj[key] === searchKey)
  );
  return arr.length ? true : false;
}
export function filterUsersByGroup(arr, searchKey) {
  if (!searchKey) return true;
  return arr.some((member) => member.groups?.includes(searchKey));
}
