const TaskModel = require('../models/mongodb/system/taskManagement/task')
const CalendarModel = require('../models/mongodb/system/calender/calenderEvents')
const IamGroup = require('./iamGroup')
const { IamPolicy } = require('./iamPolicy')
const IamRole = require('./iamRole')
const { asyncWrapper } = require('./utility')

class CalendarService {
    constructor(connection) {
        this.connection = connection
        this.Task = TaskModel(connection)
        this.Calendar = CalendarModel(connection)
    }
    async createEvent(data) {
        let { group, title, description, start, end, createdBy } = data
        let calenderEvent = await asyncWrapper(
            () => CalenderEvent({
                title,
                group,
                description,
                start,
                end,
                color: 'default',
                created: {
                    by: createdBy,
                    on: Date.now()
                }
            }).create()
        )
    }
    async deleteAttachments(id, attachment_id) {
        let [task, taskError] = await asyncWrapper(
            () => this.Task.findOneAndUpdate({ _id: id }, {
                $pull: { attachments: { _id: attachment_id } }
            }, { new: true })
        )
        if (taskError) return [task, taskError]
        return asyncWrapper(
            () => this.Task.populateTask(task)
        )
    }
}

module.exports = CalendarService