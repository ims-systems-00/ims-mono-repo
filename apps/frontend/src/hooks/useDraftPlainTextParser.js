import { ContentState, EditorState, convertFromRaw } from "draft-js";

function useDraftPlainTextParser() {
  function prepareEditorState(datastructure) {
    let currentContent;
    try {
      if (typeof datastructure === "string") {
        currentContent = JSON.parse(datastructure);
      }
      if (typeof datastructure === "object") {
        currentContent = datastructure;
      }
      currentContent = convertFromRaw(currentContent);
      return EditorState.push(
        EditorState.createEmpty(),
        currentContent,
        "change-block-data"
      );
    } catch (err) {
      /**
       * this block means it's invlid draft js .
       */
      return EditorState.createWithContent(
        ContentState.createFromText(datastructure?.toString() || "")
      );
    }
  }
  function parsePlainText(ds) {
    return prepareEditorState(ds).getCurrentContent().getPlainText();
  }
  return {
    parsePlainText,
  };
}

export default useDraftPlainTextParser;
