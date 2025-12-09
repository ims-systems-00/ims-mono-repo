import React from "react";
import TextEditor from "./TextEditor";
import { TextEditorContext } from "./Context";
import ToolBar from "./Toolbar";
import classnames from "classnames";
export default function WrappedEditor(props) {
  const { forceFocusEditorEnd, editorFocused, toggleFocus } =
    React.useContext(TextEditorContext);
  const { shouldRenderBelow = false } = props || {};
  return (
    <>
      {!props.readOnly && (
        <>
          <div className="d-flex align-items-center justify-content-between toolbar-container flex-wrap">
            <div className="toolbar-tab">
              <div className="toolbar-tab-inner">Write</div>
            </div>
            {!shouldRenderBelow && (
              <div className="d-none d-lg-block">
                <ToolBar editorFocused={editorFocused} {...props} />
              </div>
            )}
          </div>
        </>
      )}

      <div
        className={classnames("draft-editor-container d-flex flex-column", {
          "editor-disabled": props.readOnly,
        })}
      >
        {!props.readOnly && (
          <div className={`${shouldRenderBelow ? "" : "d-block d-lg-none"}`}>
            <ToolBar editorFocused={editorFocused} {...props} />
            {/* <hr></hr> */}
          </div>
        )}
        <div className=" p-2 draft-editor-container-inner d-flex flex-column">
          <TextEditor
            {...props}
            editorFocused={editorFocused}
            toggleFocus={toggleFocus}
          />
          {/**
           * following portion helps to focus on the actual text area
           * when unedited remaing area is clicked.
           */}
          <div
            onClick={(e) => {
              forceFocusEditorEnd(e);
            }}
            className="flex-grow-1"
          ></div>
        </div>
      </div>
    </>
  );
}
