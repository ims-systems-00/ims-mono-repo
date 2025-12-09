import React from "react";
import {
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  convertToRaw,
  convertFromRaw,
  ContentState,
  CompositeDecorator,
  Modifier,
  SelectionState,
} from "draft-js";
import { INLINE_TYPES, BLOCK_TYPES } from "./toolTypes";
import { ELEMENT_TYPES } from "./elementTypes";
import { imsLogger } from "@/services/loggerService";
import { checkFileSize } from "@/utils/fileCheckers";
import { ENTITY_NAME } from "./entities/entityNames";
import { mentionDecorator } from "./entities/Mentions";
const compositeDecorator = new CompositeDecorator([mentionDecorator]);
export default function useTextEditor(config) {
  const editorRef = React.useRef(null);
  const [editorFocused, setEditorFocused] = React.useState(false);
  const toggleFocus = () => setEditorFocused(!editorFocused);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty(compositeDecorator)
  );

  const [
    computedPosForMentionSuggestions,
    setComputedPosForMentionSuggestions,
  ] = React.useState({ display: "none" });
  const updateComputedPosForMentionSuggestions = (position) =>
    setComputedPosForMentionSuggestions(position);
  const [activeTools, setActiveTools] = React.useState({});
  /**
   * the following effect block handles if the component is being
   * controlled by outside values.
   */
  React.useEffect(() => {
    let currentContent;
    try {
      if (typeof config.value === "string") {
        currentContent = JSON.parse(config.value);
      }
      if (typeof config.value === "object") {
        currentContent = config.value;
      }
    } catch (err) {
      imsLogger(err);
      /**
       * here we are handling if the content parsing failes because if preexisting
       * plain text, we are converting that into a draft data structure for future
       * this is usefull for handling legacy data or automatic migration to draft data
       * structure
       */
      if (typeof config.value === "string")
        return handleEditorStateChange(
          EditorState.createWithContent(
            ContentState.createFromText(config.value)
          )
        );
    }
    if (config.value || currentContent) {
      return handleEditorStateChange(
        EditorState.set(editorState, {
          currentContent: convertFromRaw(currentContent),
          /**
           * following solution is implemented to get the direction map for the editor
           * with current content. Draftjs has got an issue with direction map.
           * see issue : https://github.com/facebook/draft-js/issues/1820
           */
          directionMap: EditorState.createWithContent(
            convertFromRaw(currentContent)
          ).getDirectionMap(),
        })
      );
    }
    return handleEditorStateChange(EditorState.createEmpty(compositeDecorator));
  }, [config.value]);
  const fileInput = React.useRef(null);
  const toggleActiveTool = (style) => {
    const isInline = INLINE_TYPES.find((type) => type.style === style)
      ? true
      : false;
    const isBlock = BLOCK_TYPES.find((type) => type.style === style)
      ? true
      : false;

    if (style === "reset") return setActiveTools({});
    if (isInline || isBlock) {
      if (activeTools[style])
        setActiveTools((currenActivated) => {
          delete currenActivated[style];
          return currenActivated;
        });
      else
        setActiveTools((currenActivated) => {
          currenActivated[style] = true;
          return currenActivated;
        });
    }
  };
  const _openFilePrompt = () => fileInput.current.click();
  const _createEntity = (command, data) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      command,
      "IMMUTABLE",
      { ...data }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      "create-entity"
    );
    handleEditorStateChange(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };
  /**
   * this function allows this component user to define own link generator.
   * usefull if someone wants to preprocess a file through a backend before
   * using as am image src or achor href
   * @param {*} metaData
   * @returns {Promise}
   */
  const generateLink = async (metaData) => {
    if (!config.linkGeneratorFn || typeof config.linkGeneratorFn !== "function")
      return null;
    return config.linkGeneratorFn(metaData);
  };
  /**
   * this function updates editors state for the current instance of the component
   * @param {EditorState} editorState
   */
  const handleEditorStateChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    setEditorState(editorState);

    if (_hasContent()) {
      config.onDataStructureChange(JSON.stringify(convertToRaw(contentState)));
    } else {
      config.onDataStructureChange("");
    }
  };
  const handleKeyCommand = (command, editorState) => {
    let newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorStateChange(newState);
      return "handled";
    }
    return "not-handled";
  };
  const _handleFiles = async (files) => {
    if (!config.handleUpload)
      return imsLogger("Uploader function not specified");
    let areImages = files.every((file) => file.type.split("/")[0] === "image");
    if (!files.every((file) => checkFileSize(file)))
      return imsLogger("one or mutiple files exceed the limit");
    if (!areImages) return imsLogger("All files has to be images");
    try {
      let storageInformations = await Promise.all(
        files.map((file) => config.handleUpload(file))
      );
      imsLogger(storageInformations);
      if (!storageInformations.every((storageInfo) => storageInfo))
        imsLogger("one or mutiple files don't have storage info");
      storageInformations.map((storageInfo) =>
        _createEntity(ENTITY_NAME.IMAGE, {
          storageInfo,
        })
      );
    } catch (err) {
      return imsLogger(err);
    }
  };
  const _handleFileInputChange = (e) => {
    e.preventDefault();
    let files = e.target.files;
    _handleFiles(Array.from(files));
  };
  const getFileInputProps = () => ({
    ref: fileInput,
    onChange: _handleFileInputChange,
  });
  const _atomicEntityController = {
    [ENTITY_NAME.IMAGE]: _openFilePrompt,
    [ENTITY_NAME.LINK]: () => {
      let link = window.prompt("Paste the link below:");
      let linkText = window.prompt("Enter the display text for link below:");
      _createEntity(ENTITY_NAME.LINK, { href: link, linkText });
    },
    [ENTITY_NAME.DIVIDER]: () => _createEntity(ENTITY_NAME.DIVIDER, {}),
    [ENTITY_NAME.MENTION]: () => {},
    [ENTITY_NAME.CHECKLIST]: () => {
      _createEntity(ENTITY_NAME.CHECKLIST, {});
    },
  };
  const _buttonHandlers = {
    [ELEMENT_TYPES.INLINE_DEFAULT]: (command, e) => {
      e.preventDefault();
      handleEditorStateChange(
        RichUtils.toggleInlineStyle(editorState, command)
      );
    },
    [ELEMENT_TYPES.BLOCK_DEFAULT]: (command, e) => {
      e.preventDefault();
      handleEditorStateChange(RichUtils.toggleBlockType(editorState, command));
    },
    [ELEMENT_TYPES.ATOMIC_ENTITY]: (command, e) => {
      e.preventDefault();
      _atomicEntityController[command]();
    },
  };
  const handleToolClick = (tool, e) => {
    if (!tool?.element) {
      return null;
    }
    _buttonHandlers[tool.element](tool.style, e);

    toggleActiveTool(tool.style);
  };
  const handleDroppedFiles = (selection, files) => _handleFiles(files);
  const handlePastedFiles = (files) => _handleFiles(files);
  const handleMentionSelect = (
    contentState,
    blockKey,
    position,
    mentionData
  ) => {
    let selectionState = SelectionState.createEmpty(blockKey);
    let newContentState = contentState.createEntity(
      ENTITY_NAME.MENTION,
      "IMMUTABLE",
      {
        ...mentionData,
      }
    );
    let entityKey = newContentState.getLastCreatedEntityKey();
    newContentState = Modifier.replaceText(
      contentState,
      selectionState.merge({
        // The starting position of the range to be replaced.
        anchorOffset: position.start,
        // The end position of the range to be replaced.
        focusOffset: position.end,
      }),
      mentionData.mention,
      editorState.getCurrentInlineStyle(),
      entityKey
    );
    handleEditorStateChange(
      /**
       * in following solution we had to use moveFocusToEnd() and the force the
       * selecion back to replaced text from  new content through forceSelection().
       * This creates an effect that the cursor is at the end of mentioend name.
       * Draftjs has got an issue with cursor positioning with entity and modifier.
       * see issue : https://github.com/facebook/draft-js/issues/627
       *
       * otherwise expected behaviour is to only do an EditorState.set() to put the
       * mentioned entity in the editor in the identified selection state starting with @.
       */
      EditorState.forceSelection(
        EditorState.moveFocusToEnd(
          EditorState.set(editorState, {
            currentContent: newContentState,
          })
        ),
        newContentState.getSelectionAfter()
      )
    );
  };
  const forceFocusEditorEnd = (e) => {
    e?.preventDefault && e.preventDefault();
    if (window.getSelection().toString()) return;
    editorRef.current?.focus();
    handleEditorStateChange(EditorState.moveFocusToEnd(editorState));
  };

  const _hasContent = () => {
    let content = editorState.getCurrentContent();
    const hasText =
      content.getPlainText().length > 0 &&
      content.getPlainText().trim().length > 0;
    const hasAtomicBlock = content.getBlockMap().some((block) => {
      return block.getType() === "atomic";
    });
    const hasBlock = content.getBlockMap().some((block) => {
      return (
        block.getType() === "header-three" ||
        block.getType() === "unordered-list-item" ||
        block.getType() === "ordered-list-item" ||
        block.getType() === "blockquote" ||
        block.getType() === "code-block"
      );
    });
    return hasAtomicBlock || hasText || hasBlock;
  };

  return {
    editorRef,
    activeTools,
    editorState,
    computedPosForMentionSuggestions,
    getFileInputProps,
    generateLink,
    handleDroppedFiles,
    handlePastedFiles,
    handleEditorStateChange,
    handleKeyCommand,
    handleToolClick,
    forceFocusEditorEnd,
    updateComputedPosForMentionSuggestions,
    handleMentionSelect,
    toggleActiveTool,
    editorFocused,
    toggleFocus,
  };
}
