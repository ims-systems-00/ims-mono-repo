import IVal from "joi-browser";
import moment from "moment";
export function momentExtensions(joi) {
  return {
    base: joi.string(),
    name: "moment",
    language: {
      min: "needs to be a valid date",
      max: "needs to be a valid date",
      greater: "needs to be a valid date",
      less: "needs to be a valid date",
    },
    rules: [
      {
        name: "min",
        params: {
          options: joi.object({
            date: joi.date(),
            format: joi.string(),
          }),
        },
        validate: function (params, value, state, options) {
          if (
            new Date(moment(value, params.options.format)) <
            new Date(params.options.date)
          ) {
            return this.createError("moment.min", { v: value }, state, options);
          }
          return value;
        },
      },
      {
        name: "max",
        params: {
          options: joi.object({
            date: joi.date(),
            format: joi.string(),
          }),
        },
        validate: function (params, value, state, options) {
          if (
            new Date(moment(value, params.options.format)) >
            new Date(params.options.date)
          ) {
            return this.createError("moment.max", { v: value }, state, options);
          }
          return value;
        },
      },
      {
        name: "greater",
        params: {
          options: joi.object({
            ref: joi.string(),
            format: joi.string(),
          }),
        },
        validate: function (params, value, state, options) {
          if (
            new Date(moment(value, params.options.format)) <
            new Date(
              moment(
                state.parent && state.parent[params.options.ref],
                params.options.format
              )
            )
          ) {
            return this.createError(
              "moment.greater",
              { v: value },
              state,
              options
            );
          }
          return value;
        },
      },
      {
        name: "less",
        params: {
          options: joi.object({
            ref: joi.string(),
            format: joi.string(),
          }),
        },
        validate: function (params, value, state, options) {
          if (
            new Date(moment(value, params.options.format)) >
            new Date(
              moment(
                state.parent && state.parent[params.options.ref],
                params.options.format
              )
            )
          ) {
            return this.createError(
              "moment.less",
              { v: value },
              state,
              options
            );
          }
          return value;
        },
      },
    ],
  };
}
const Validation = IVal;
export default Validation;
