
exports.devUtils = async (req, res, next) => {
    if (process.env.NODE_ENV === 'administration') {
        req.accessControl = {
            user: { name: "iMS Operator", email: "hello@imssystems.tech" }
        }
    }
    next()
}