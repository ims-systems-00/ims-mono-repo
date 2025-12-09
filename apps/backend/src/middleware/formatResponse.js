const { logger } = require("@ims-systems-00/ims-core/lib/logger")

function responseLog(code) {
    code = parseInt(code)
    if (code >= 200 || code <= 299)
        return logger.info("success", {code: code})
    if (code >= 400 || code <= 599)
        return console.error("error", code)
    return logger.info("info", {code: code})
}
exports.formatResponse = async (req, res, next) => {
    const originJson = res.json
    res.json = (jsonData) => {
        const fixedResponse = {
            statusCode: res.statusCode
        }
        originJson.call(res, { ...jsonData, ...fixedResponse })
    }
    next()
}