class ValidationService {
  constructor(connection) {
    this.connection = connection
  }
  validate(schema, dataSet) {
    const options = { abortEarly: false }
    const { error } = schema.validate(dataSet, options)
    if (!error) return null
    const errors = {}
    for (let item of error.details) errors[item.path[0]] = item.message
    return errors
  }
}
module.exports = ValidationService