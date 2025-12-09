import { useState } from "react";
import * as aiApi from "@/services/ai";
import { getTenant } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import { useApplication } from "@/stores/applicationStore";
const useGPTResponseGenerator = () => {
  const [currentlyStreaming, setCurrentlyStreaming] = useState(null);
  const { tokenPair } = useApplication();
  async function streamResponse(payload) {
    try {
      setCurrentlyStreaming(null);
      await aiApi.streamResponse(
        {
          prompt: payload.prompt,
          systemInstructions: payload.systemInstructions || [],
          conversation: payload.conversation || [],
        },
        {
          headers: {
            "x-auth-accesstoken": tokenPair.accessToken,
            "x-tenant": getTenant(),
          },
          onStream: function (streamString) {
            /** updating stream state */
            setCurrentlyStreaming((prev) => {
              let currentResponseStream = prev?.responseStream
                ? prev.responseStream + streamString
                : streamString;
              return {
                ...prev,
                prompt: payload.prompt,
                responseStream: currentResponseStream,
                isStreamComplete: false,
              };
            });
          },
          onError: function (err) {
            imsLogger(err);
          },
          onTokenRefreshNeed: async function () {},
          onStreamEnd: function (fullStreamString) {
            setCurrentlyStreaming((prev) => {
              return {
                ...prev,
                responseStream: fullStreamString,
                isStreamComplete: true,
              };
            });
          },
        }
      );
    } catch (err) {
      imsLogger(err);
    }
  }
  return {
    currentlyStreaming,
    streamResponse,
  };
};

export default useGPTResponseGenerator;
