export function truncate(input, char) {
  if (input?.length > 5) {
    return input.substring(0, char) + "...";
  }
  return input;
}

export function truncateMiddle(input) {
  let text = input
    .slice(0, 5)
    .concat(".....")
    .concat(input.slice(input.length - 10));
  return text;
}
