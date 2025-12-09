import { getCurrentSessionData } from "@/services/authService";
import socketConnection from "@/services/webSocketService";
export function startListening(event = "", callback = () => {}) {
  if (
    getCurrentSessionData() &&
    socketConnection?.isSet() &&
    !socketConnection?.getSocket()?._callbacks["$" + event]
  ) {
    socketConnection?.getSocket()?.on(event, callback);
  }
}
export function stopListening(event = "", callback = () => {}) {
  socketConnection?.isSet() &&
    socketConnection?.getSocket()?.removeListener(event, callback);
}
