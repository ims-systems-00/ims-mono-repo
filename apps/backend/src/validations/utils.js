function sortSanitizer(obj) {
  if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = sortSanitizer(obj[key]);
      }
    }
  } else if (typeof obj === "string") {
    if (obj === "1") {
      obj = 1;
    } else if (obj === "-1") {
      obj = -1;
    }
  }
  return obj;
}

exports.trimQuery = (data) => {
  let { page, size, sort } = data;
  page = !parseInt(page) || parseInt(page < 1) ? 1 : parseInt(page);
  size =
    parseInt(size) < 1 || parseInt(size) > 100 || !parseInt(size)
      ? 10
      : parseInt(size);
  sort = sort ? sortSanitizer(sort) : { createdAt: -1 };
  let isObject = (object) => object !== null && typeof object === "object";
  function deepTrim(obj) {
    const keys = Object.keys(obj);
    for (let key of keys) {
      if (isObject(obj[key])) {
        deepTrim(obj[key]);
      } else {
        obj[key] = obj[key] === "null" ? null : obj[key];
        obj[key] = obj[key] === "undefined" ? undefined : obj[key];
      }
    }
    return obj;
  }

  return { ...deepTrim(data), page, size, sort };
};
