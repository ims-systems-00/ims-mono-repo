const { asynchronously, imsPaginationFormated } = require('./utility')
const StaffAlertsModel = require('../models/mongodb/system/wallet/staffAlerts')

class StaffAlertService {
  constructor(connection) {
    this.connection = connection
    this.Alert = StaffAlertsModel(connection)
  }
  async createAlert(data) {
    let [alertError, alert] = await asynchronously(
      this.Alert.create({
        alerted: {
          by: data.alertedBy,
          on: Date.now()
        },
        location: data.location
      })
    )
    if (alertError) return [alertError, alert]
    return asynchronously(this.Alert.populateAlert(alert))
  }
  async getAlerts(query, options) {
    let [alertsError, pagination] = await asynchronously(this.Alert.paginate(query, options))
    if (alertsError) return [alertsError, alerts]
    let alerts = pagination.docs
    let [populationError, populateAlerts] = await asynchronously(Promise.all(alerts.map(alert => this.Alert.populateAlert(alert))))
    if (populationError) return [populationError, populateAlerts]
    return [null, { alerts: populateAlerts, pagination: imsPaginationFormated(pagination) }]
  }
  async getAlert(id) {
    let [alertError, alert] = await asynchronously(this.Alert.findOne({ _id: id }))
    if (alertError) return [alertError, alert]
    return asynchronously(this.Alert.populateAlert(alert))
  }
  async updateAlert(id, data) {
    let [alertError, alert] = await asynchronously(
      this.Alert.findOneAndUpdate({ _id: id }, {
        $set: {
          resolution: data.resolution
        }
      }, { new: true })
    )
    if (alertError) return [alertError, alert]
    return asynchronously(this.Alert.populateAlert(alert))
  }
  async deleteAlert(id) {
    return asynchronously(this.Alert.findOneAndDelete({ _id: id }))
  }
}
module.exports = StaffAlertService