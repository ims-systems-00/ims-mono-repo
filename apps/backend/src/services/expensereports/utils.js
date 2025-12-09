/**
 * Modifies an object by prepending a specified string to the property names
 * @param {Object} object - The object to be modified
 * @param {string} string - The string to be prepended
 * @returns {Object} The modified object
 */

exports.prependStringToObjectProps = function prependStringToObjectProps(
  object,
  string
) {
  return Object.keys(object).reduce(
    (prev, curr, currind, array) => ({
      ...prev,
      [string + curr]: object[array[currind]],
    }),
    {}
  );
};
