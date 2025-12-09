let staticAssetUrl = "https://assets.imssystems.tech";
export let SOUNDS = {
  NOTIFICATION: staticAssetUrl + "/sounds/notification.mp3",
};
export function playSound(url) {
  if (!url) throw new Error("Url is required");
  let audio = new Audio(url);
  audio.play();
}
