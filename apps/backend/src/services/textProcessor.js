const { logger } = require("@ims-systems-00/ims-core/lib/logger");

class TextProcessor {
  constructor(rawTextEditorDataStrucure) {
    if (!rawTextEditorDataStrucure)
      throw Error("Formated  Data Strucure is required");
    this.rawTextEditorDataStrucure = rawTextEditorDataStrucure;
  }
  parseMentions() {
    try {
      if (this.rawTextEditorDataStrucure) {
        let mentions = [];
        for (let entiy of Object.keys(
          this.rawTextEditorDataStrucure.entityMap
        )) {
          if (
            this.rawTextEditorDataStrucure.entityMap[entiy].type === "mention"
          )
            mentions.push(this.rawTextEditorDataStrucure.entityMap[entiy]);
        }
        return mentions;
      } else {
        logger.info("No data strucure found skipinng mention track...");
      }
    } catch (error) {
      logger.info(error);
      logger.info("invalid data skipping mention tracking");
    }
  }
}
module.exports = TextProcessor