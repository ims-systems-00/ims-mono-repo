const reset = "\x1b[0m"
const bright = "\x1b[1m"
const dim = "\x1b[2m"
const underscore = "\x1b[4m"
const blink = "\x1b[5m"
const reverse = "\x1b[7m"
const hidden = "\x1b[8m"

const black = "\x1b[30m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const magenta = "\x1b[35m"
const cyan = "\x1b[36m"
const white = "\x1b[37m"

const BGblack = "\x1b[40m"
const BGred = "\x1b[41m"
const BGgreen = "\x1b[42m"
const BGyellow = "\x1b[43m"
const BGblue = "\x1b[44m"
const BGmagenta = "\x1b[45m"
const BGcyan = "\x1b[46m"
const BGwhite = "\x1b[47m"
/**
 * Color codding is only avaiable in the main application thread, no other worker will receive this 
 * functions as it is only initialized in the main file. To utilize the functions in seprate worker threads 
 * please initialize it with globals.
 */
const logStream = require('../socket/listeners/log.listener')
module.exports = (function (defaultConsole) {
    return {
        ...defaultConsole,
        log: function (...args) {
            defaultConsole.info(bright, ...args, reset)
            logStream(bright, ...args, reset)
        },
        info: function (...args) {
            defaultConsole.info(cyan, ...args, reset)
            logStream(cyan, ...args, reset)
        },
        warn: function (...args) {
            defaultConsole.warn(yellow, ...args, reset)
            logStream(yellow, ...args, reset)
        },
        error: function (...args) {
            defaultConsole.error(red, ...args, reset)
            logStream(red, ...args, reset)
        },
        success: function (...args) {
            defaultConsole.log(green, ...args, reset)
            logStream(green, ...args, reset)
        },
        underscore: function (...args) {
            defaultConsole.log(underscore, ...args, reset)
            logStream(underscore, ...args, reset)
        },
        quoteInfo: function (...args) {
            defaultConsole.log(BGcyan, ...args, reset)
            logStream(BGcyan, ...args, reset)
        },
        quoteSuccess: function (...args) {
            defaultConsole.log(BGgreen, ...args, reset)
            logStream(BGgreen, ...args, reset)
        },
        quoteWarn: function (...args) {
            defaultConsole.log(BGyellow, ...args, reset)
            logStream(BGyellow, ...args, reset)
        },
        quoteDanger: function (...args) {
            defaultConsole.log(BGred, ...args, reset)
            logStream(BGred, ...args, reset)
        }
    };
}(global.console))