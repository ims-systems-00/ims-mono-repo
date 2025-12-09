import useDraftPlainTextParser from "@/hooks/useDraftPlainTextParser";

export default function useTemplateCompiler() {
  const { parsePlainText } = useDraftPlainTextParser();
  function compile(template, local) {
    function getDeepValue(obj, path) {
      const keys = path.split(".");
      let value = obj;
      for (const key of keys) {
        if (value && typeof value === "object") {
          value = value[key];
        } else {
          value = undefined;
          break;
        }
      }
      return value;
    }
    function extractPlaceHolders(str) {
      const regex = /<=([^=>]+)=>/g;
      let match;
      const matches = [];
      while ((match = regex.exec(str)) !== null) {
        const content = match[1];
        matches.push(content.trim());
      }
      return matches;
    }
    const placeholders = extractPlaceHolders(template);
    const unwindStrings = template.split(/<=.*?=>/g);
    const parsedValuesForPlaceholders = placeholders.map((p) => {
      const propvalue = getDeepValue({ local }, p);
      return parsePlainText(propvalue);
    });
    /**
     * we loop over winded  string is because this will
     * always be one extra piece more than parsedValuesForPlaceholders.
     */
    let processedTemplate = [];
    for (let index = 0; index < unwindStrings.length; index++) {
      processedTemplate.push(
        unwindStrings[index] + (parsedValuesForPlaceholders[index] || "")
      );
    }
    processedTemplate = processedTemplate.join("");
    const compiledTemplate = new Function(
      "local",
      /**
       * this is the exact object name that needs to be the top level object.
       * so users must specify like  <= local.anyobject.childProp.childPop.... =>
       * if local is missing this will fail to properly render or crash of throw error.
       */
      `
        return \`${processedTemplate}\`;
      `
    );
    return compiledTemplate({
      ...local,
    });
  }
  return { compile };
}
