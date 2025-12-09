import openSocket from "socket.io-client";
let socket = null;
let socketConnection = {
  init: () =>
    (socket = openSocket(process.env.REACT_APP_API_URL, {
      query: {
        token: "",
      },
    })),
  isSet: () => socket,
  getSocket: () => {
    if (!socket) throw Error("Socket not initialized in client...");
    return socket;
  },
};
export default socketConnection;
export function startListening(event = "", callback = () => {}) {
  if (
    socketConnection?.isSet() &&
    !socketConnection?.getSocket()?._callbacks["$" + event]
  ) {
    socketConnection?.getSocket()?.on(event, callback);
  }
}
export function stopListening(event, callback = () => {}) {
  if (socketConnection?.isSet())
    socketConnection?.getSocket()?.off(event, callback);
}
