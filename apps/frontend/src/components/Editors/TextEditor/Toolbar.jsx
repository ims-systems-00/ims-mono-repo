import React, { useEffect } from "react";
import { TextEditorContext } from "./Context";
import toolTypes, { BLOCK_TYPES } from "./toolTypes";
import ButtonSeparator from "./ButtonSeparator";
import TooltipButton from "@/components/Tooltip/TooltipButton";
import FilePicker from "./FilePicker";
import classNames from "classnames";
export default function ToolBar(props) {
  const {
    getFileInputProps,
    handleToolClick,
    editorState,
    editorFocused = false,
  } = React.useContext(TextEditorContext);

  const hasCurrentStyle = (style) => {
    try {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FilePicker {...getFileInputProps()} />
      {Object.keys(toolTypes).map((type, index) => {
        return (
          <React.Fragment key={type}>
            {toolTypes[type]?.map((tool) => {
              return (
                <span className="toolbar-icon-wrapper">
                  <TooltipButton
                    tooltip={tool?.label}
                    disabled={editorFocused ? false : true}
                    type="button"
                    className={classNames("btn  m-0", {
                      "text-success": hasCurrentStyle(tool.style),
                      "toolbar-icon-inactive": !hasCurrentStyle(tool.style),
                    })}
                    key={tool?.style}
                    onMouseDown={(e) => handleToolClick(tool, e)}
                  >
                    {tool.icon ? (
                      <i className={`${tool.icon} toolbar-icons`} />
                    ) : (
                      tool?.label
                    )}
                  </TooltipButton>
                </span>
              );
            })}
            {index < Object.keys(toolTypes).length - 1 && <ButtonSeparator />}
          </React.Fragment>
        );
      })}
    </>
  );
}
