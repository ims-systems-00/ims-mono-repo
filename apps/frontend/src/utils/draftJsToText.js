import { ContentState, convertToRaw, genKey } from "draft-js";

/**
 * Converts Draft.js content to plain text
 * @param {string|object} draftJSContent - The Draft.js content either as a JSON string or parsed object
 * @returns {string} Plain text representation of the Draft.js content
 */
export function draftJSToText(draftJSContent) {
  try {
    // If the content is already an object, use it directly
    // Otherwise, try to parse it as JSON
    const content =
      typeof draftJSContent === "string"
        ? JSON.parse(draftJSContent)
        : draftJSContent;

    // Extract text from each block and join with newlines
    return content.blocks.map((block) => block.text).join("\n");
  } catch (error) {
    // If parsing fails, return the original content as is
    return typeof draftJSContent === "string"
      ? draftJSContent
      : JSON.stringify(draftJSContent);
  }
}

export function mergeDraftJSWithEditorState(content1, content2) {
  try {
    // Convert both contents to RawDraftContentState
    const getRawContent = (content) => {
      if (typeof content === "string") {
        return JSON.parse(content);
      } else if (content instanceof ContentState) {
        return convertToRaw(content);
      }
      return content;
    };

    const rawContent1 = getRawContent(content1);
    const rawContent2 = getRawContent(content2);

    // Filter out empty blocks from content1 (where text is empty and no entities)
    const filteredContent1Blocks = (rawContent1.blocks || []).filter(
      (block) =>
        block.text.trim() !== "" ||
        (block.entityRanges && block.entityRanges.length > 0)
    );

    // If content1 is completely empty (no blocks with content), just return content2
    if (
      filteredContent1Blocks.length === 0 &&
      Object.keys(rawContent1.entityMap || {}).length === 0
    ) {
      return JSON.stringify(rawContent2);
    }

    // Merge blocks with proper key generation to avoid conflicts
    const mergedBlocks = [
      ...filteredContent1Blocks.map((block) => ({
        ...block,
        key: `block1_${genKey()}`,
      })),
      ...(rawContent2.blocks || []).map((block) => ({
        ...block,
        key: `block2_${genKey()}`,
      })),
    ];

    // Merge entityMaps with proper key management
    const mergedEntityMap = { ...(rawContent1.entityMap || {}) };
    const entityMap2 = rawContent2.entityMap || {};

    // Find the highest existing key in content1's entityMap
    let maxKey = -1;
    if (rawContent1.entityMap) {
      Object.keys(rawContent1.entityMap).forEach((key) => {
        const numKey = parseInt(key, 10);
        if (numKey > maxKey) {
          maxKey = numKey;
        }
      });
    }

    // Merge content2's entities with renumbered keys
    Object.keys(entityMap2).forEach((key) => {
      const newKey = parseInt(key, 10) + maxKey + 1;
      mergedEntityMap[newKey.toString()] = entityMap2[key];

      // Update entity references in blocks
      mergedBlocks.forEach((block) => {
        if (block.key.startsWith("block2_")) {
          block.entityRanges = block.entityRanges?.map((range) => {
            if (range.key.toString() === key) {
              return { ...range, key: newKey };
            }
            return range;
          });
        }
      });
    });

    // Create the merged content
    const mergedContent = {
      blocks: mergedBlocks,
      entityMap: mergedEntityMap,
    };

    // Return as JSON string
    return JSON.stringify(mergedContent);
  } catch (error) {
    console.error("Error merging Draft.js content:", error);

    // Fallback: create a new ContentState with both texts
    const getText = (content) => {
      if (typeof content === "string") {
        try {
          const parsed = JSON.parse(content);
          return parsed.blocks?.map((b) => b.text).join("\n") || content;
        } catch {
          return content;
        }
      } else if (content instanceof ContentState) {
        return content.getPlainText();
      } else {
        return content.blocks?.map((b) => b.text).join("\n") || "";
      }
    };

    const text1 = getText(content1);
    const text2 = getText(content2);

    return JSON.stringify(
      convertToRaw(ContentState.createFromText(`${text1}\n${text2}`))
    );
  }
}
