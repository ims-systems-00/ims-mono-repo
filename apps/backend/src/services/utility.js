const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const mongoose = require("mongoose");

function _mongoIdTypeCastIfvalid(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];

      // Check if the value is a string and looks like a MongoDB ObjectID
      if (typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
        // Convert the string to a mongoose.Types.ObjectId
        obj[key] = new mongoose.Types.ObjectId(value);
      } else if (typeof value === "object") {
        // Recursively call the function for nested objects
        obj[key] = _mongoIdTypeCastIfvalid(value);
      }
    }
  }
  return obj;
}
exports.asyncWrapper = async (asyncFunction, ...args) => {
  try {
    const data = await asyncFunction(...args);
    return [data, null];
  } catch (error) {
    logger.info(error);
    return [null, error];
  }
};
let asynchronously = async (promise) => {
  try {
    return [null, await promise];
  } catch (error) {
    logger.info(error);
    return [error, null];
  }
};
exports.asynchronously = asynchronously;
exports.imsPaginationFormated = (data) => {
  return {
    totalPages: data.totalPages,
    totalResults: data.totalDocs,
    currentPage: data.page,
    size: data.limit,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
  };
};
function isDateString(value) {
  if (typeof value !== "string") return false;
  const dateStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (!dateStringRegex.test(value)) return false;
  return true;
}

function JSONReviver(key, value) {
  if (isDateString(value)) return new Date(value);
  return value;
}

/**
 * Caution: there is huge security risk when changing the algaorithom, so
 * please don't try to bring performance inprovements or enhancements
 * unless you exactly know what you are doing.
 * All Funtionality requirements will be listed further.
 * Very Confidentioal piece of code to accesses.
 */
class Filters {
  constructor(
    data,
    options = { searchFields: [], strictObjectIdMatch: false }
  ) {
    this.qry = data.query;
    this.queryStr = JSON.stringify(data.query);
    this.searchFields = options.searchFields;
    this.strictObjectIdMatch = options.strictObjectIdMatch;
    this.connection = data.tenant;
  }
  dotNotate(obj, target, prefix) {
    target = target || {};
    prefix = prefix || "";
    Object.keys(obj).forEach((key) => {
      if (key[0] === "$" && prefix) {
        return (target[prefix.slice(0, prefix.length - 1)] = obj);
      }
      if (typeof obj[key] === "object" && obj[key] !== null) {
        this.dotNotate(obj[key], target, prefix + key + ".");
      } else {
        return (target[prefix + key] = obj[key]);
      }
    });
    this.qry = { ...target };
    this.queryStr = JSON.stringify(target);
    return this;
  }
  formatOperators() {
    // let currentString = JSON.stringify(this.qry);
    // console.log(this.qry,currentString);
    // this.queryStr = currentString.replace(
    //   /\b(or|gt|gte|lt|options|lte|elemMatch|in|nin|ne|equals|all|regex)\b/g,
    //   (key) => {
    //     console.log(key)
    //     return `$${key}`
    //   }
    // );
    // return this;
    // Mapping of custom operators to MongoDB operators
    const dateOperatorsMap = {
      gt: "$gt",
      gte: "$gte",
      lt: "$lt",
      lte: "$lte",
    };
    const operatorMap = {
      or: "$or",
      options: "$options",
      elemMatch: "$elemMatch",
      in: "$in",
      nin: "$nin",
      ne: "$ne",
      eq: "$eq",
      all: "$all",
      regex: "$regex",
      ...dateOperatorsMap,
    };
    function processObject(obj) {
      const result = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            let foundOperator = false;
            // Check for operators and convert them
            for (const op in operatorMap) {
              if (obj[key].hasOwnProperty(op)) {
                let operatorNest = obj[key][op];
                if (
                  typeof operatorNest === "object" &&
                  operatorNest !== null &&
                  !Array.isArray(operatorNest)
                )
                  result[key] = {
                    ...result[key],
                    [operatorMap[op]]: processObject(operatorNest),
                  };
                else {
                  // If the operator is a date operator try to convert the value in to date
                  result[key] = {
                    ...result[key],
                    [operatorMap[op]]: operatorNest,
                  };
                }
                foundOperator = true;
                // break;
              }
            }
            if (!foundOperator) {
              // Recursively process nested objects
              result[key] = { ...processObject(obj[key]) };
            }
          } else {
            // Directly assign other values
            result[key] = obj[key];
          }
        }
      }
      return result;
    }
    let query = processObject(this.qry);
    this.qry = query;
    this.queryStr = JSON.stringify(query);
    return this;
  }
  removeOptions() {
    let removeItems = [
      "page",
      "size",
      "sort",
      "tenant",
      "threshold",
      "createdBy",
      "userId",
      "roleName",
    ];
    removeItems.forEach((item) => delete this.qry[item]);
    return this;
  }
  trim() {
    this.removeOptions();
    return this;
  }
  async search() {
    if (!this.qry.clientSearch || !this.searchFields.length) {
      delete this.qry["clientSearch"];
      this.queryStr = JSON.stringify(this.qry);
      return this;
    }
    let searchQuery = this.qry.$or || [];
    this.qry.$or = [
      ...searchQuery,
      ...this.searchFields.map((field) => {
        return {
          [field]: {
            $regex: this.qry.clientSearch && this.qry.clientSearch,
            $options: "i",
          },
        };
      }),
    ];
    delete this.qry["clientSearch"];
    this.queryStr = JSON.stringify(this.qry);
    return this;
  }
  build() {
    /**
     * Sequence of function call matters here, if correct sequence is not maintained
     * search feature along with some other will break.
     */
    this.trim();
    this.formatOperators();
    this.dotNotate(JSON.parse(this.queryStr));
    this.search();
    return this;
  }
  queryString() {
    return this.queryStr;
  }
  query() {
    logger.info("Current filter:", {
      queryStr: _mongoIdTypeCastIfvalid(JSON.parse(this.queryStr, JSONReviver)),
    });
    return this.strictObjectIdMatch
      ? _mongoIdTypeCastIfvalid(JSON.parse(this.queryStr, JSONReviver))
      : JSON.parse(this.queryStr, JSONReviver);
  }
}
exports.Filters = Filters;
exports.formatListResponse = (data) => {
  return {
    data: data.docs,
    pagination: {
      totalPages: data.totalPages,
      totalResults: data.totalDocs,
      currentPage: data.page,
      size: data.limit,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
    },
  };
};

class DateUtils extends Date {
  constructor(date) {
    super(date);
    this.date = date;
  }
  getFirstDateOfWeek() {
    let date = new Date(
      this.date.setDate(this.date.getDate() - ((this.date.getDay() + 6) % 7))
    );
    date.setHours(0, 0, 0, 0);
    return date;
  }
  getFirstDateOfMonth() {
    let date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  getLastDateOfMonth() {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }
  getFirstDateOfYear() {
    return new Date(this.date.getFullYear(), 0, 1);
  }
  addMonths(months) {
    let date = new Date(this.date);
    date.setMonth(date.getMonth() + months);
    return date;
  }
}
exports.DateUtils = DateUtils;
