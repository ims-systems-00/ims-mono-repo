import React, { useEffect } from "react";
import { Editor, EditorState } from "draft-js";
import { TextEditorContext } from "./Context";
import { editorMediaBlockRenderer } from "./entities/editorMediaBlockRenderer";
export default function TextEditor({ readOnly = false, ...props }) {
  const {
    editorRef,
    editorState,
    handleEditorStateChange,
    handleDroppedFiles,
    handlePastedFiles,
    handleKeyCommand,
    editorFocused = false,
    toggleFocus = () => {},
  } = React.useContext(TextEditorContext);
  return (
    <>
      <Editor
        ref={editorRef}
        onFocus={() => {
          if (!editorFocused) {
            toggleFocus && toggleFocus(true);
          }
        }}
        onBlur={() => {
          toggleFocus && toggleFocus(false);
        }}
        blockRendererFn={editorMediaBlockRenderer}
        className="draft-editor"
        placeholder={
          props.placeholder || "Add a comment. Use @ to notify a user."
        }
        onChange={handleEditorStateChange}
        editorState={editorState}
        spellCheck={true}
        handleKeyCommand={handleKeyCommand}
        handleDroppedFiles={handleDroppedFiles}
        handlePastedFiles={handlePastedFiles}
        readOnly={readOnly}
      />
    </>
  );
}
