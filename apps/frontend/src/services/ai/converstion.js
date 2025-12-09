import { imsLogger } from "@/services/loggerService";
import http from "../httpServices";
const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/ai`;
/**
 * ALERT: We should not user fetch with any other cases unless it's a
 * special case like this where axios does'nt have support for stream response
 * in browsers. limited  by XMLHTTPRequest  standards.
 */
const SYSTEM_PROMPT = {
  role: "system",
  content: `You are an AI assistant named Alice. You respond contents in Markdown fomrat, you usually split your output into paragraphs 
  Always comprehend your answers when asked for any documentation or policies. Also try to explain or comprehend your general 
  answers with details as much as possible. Use UK english in your reseponses.`,
};
export async function streamResponse(
  data,
  options = {
    onStream: function () {},
    onStreamEnd: function () {},
    onError: function () {},
    onTokenRefreshNeed: async function () {},
    headers: {},
  }
) {
  imsLogger(
    "sending charecters:",
    data.conversation.reduce((accumulator, currentValue) => {
      return currentValue.content + accumulator;
    }, "").length
  );
  imsLogger(
    "sending charecters trim:",
    data.conversation.reduce((accumulator, currentValue) => {
      return currentValue.content + accumulator.trim();
    }, "").length
  );

  async function _successResponseHandler(response) {
    const reader = response.body.getReader();
    let fullText = "";
    while (true) {
      try {
        const { value, done } = await reader.read();
        if (done) break;
        const decodedtext = new TextDecoder("utf-8").decode(value);
        fullText += decodedtext;
        options?.onStream(decodedtext);
      } catch (err) {
        imsLogger(err);
      }
    }
    options?.onStreamEnd(fullText);
  }
  try {
    const URL =
      process.env.REACT_APP_API_URL +
      "/api/" +
      process.env.REACT_APP_API_VERSION +
      `/ai/gpt-stream`;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      // credentials: "include",
      body: JSON.stringify({
        systemInstructions: [SYSTEM_PROMPT, ...data.systemInstructions],
        conversation: data.conversation,
        prompt: data.prompt,
      }),
    };
    const response = await fetch(URL, config);
    if (response.ok) {
      _successResponseHandler(response);
    } else {
      if (response.status === 401) {
        const data = await options?.onTokenRefreshNeed();
        const tokenPair = data?.tokenPair;
        try {
          let newResponse = await fetch(URL, {
            ...config,
            headers: {
              ...config.headers,
              "x-auth-accesstoken": tokenPair?.accessToken,
            },
          });
          if (newResponse.ok) {
            _successResponseHandler(newResponse);
          }
        } catch (err) {
          options?.onError(err);
        }
      }
    }
  } catch (err) {
    options?.onError(err);
  }
}
export async function normalResponse(data) {
  return http.post(`${apiEndPoint}/gpt-normal`, {
    systemInstructions: data.systemInstructions || [SYSTEM_PROMPT],
    conversation: data.conversation,
    prompt: data.prompt,
  });
}
