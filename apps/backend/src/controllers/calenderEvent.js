const CalenderEventModel = require("../models/mongodb/system/calender/calenderEvents");
const SupplierModel = require("../models/mongodb/system/supplierManagement/supplier");
const { trimQuery } = require("../validations/utils");
const { StatusCodes } = require("http-status-codes");
const { Filters } = require("../services/utility");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { CalenderEventService } = require("../services/calenderEvent");
exports.createCalenderEvent = async (req, res, next) => {
  let CalenderEventManager = new CalenderEventService(req.accessControl);
  try {
    let calendar = await CalenderEventManager.createCalenderEvent({
      ...req.body,
      createdBy: req.accessControl.user,
    });
    res.status(StatusCodes.OK).json({
      message: "Calender event has been created Successfully.",
      calenderEvent: calendar,
    });
  } catch (err) {
    next(err);
  }
};
exports.getCalenderEvents = async (req, res, next) => {
  let CalenderEventManager = new CalenderEventService(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    let { groupPolicy, session } = req.accessControl;
    const options = { page, limit: size, sort };
    let query = {};
    const result = await CalenderEventManager.listCalendersByOrg(
      query,
      options
    );
    res.status(StatusCodes.OK).json({
      message: "Calender Event retrival success",
      pagination: result.pagination,
      lists: result.lists,
      calenderEvents: result.calenders,
    });
  } catch (err) {
    next(err);
  }
  // let CalenderEvent = CalenderEventModel(req.accessControl);
  // try {
  //   let { groupPolicy, session } = req.accessControl;
  //   let calenderEvents = [];
  //   let { userId } = req.query;
  //   calenderEvents = await CalenderEvent.find({
  //     $or: [{ "created.by": userId }, { attendees: userId }],
  //   });
  //   res.status(200).json({ message: "Success", calenderEvents });
  // } catch (err) {
  //   next(err);
  // }
};
exports.getCalenderEvent = async (req, res, next) => {
  let CalenderEventManager = new CalenderEventService(req.accessControl);
  try {
    let { id } = req.params;
    let calendar = await CalenderEventManager.getCalenderEvent({ _id: id });
    res
      .status(StatusCodes.OK)
      .json({ message: "Success", calenderEvent: calendar });

    //  let { id } = req.params;
    //  let calenderEvent = await CalenderEvent.findOne({ _id: id });
    //  res.status(200).json({ message: "Sucess", calenderEvent });
  } catch (err) {
    next(err);
  }
};
exports.editCalenderEvent = async (req, res, next) => {
  let CalenderEventManager = new CalenderEventService(req.accessControl);
  let { id } = req.params;
  try {
    let calendar = await CalenderEventManager.editCalenderEvent(id, {
      ...req.body,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Success", calenderEvent: calendar });
  } catch (err) {
    next(err);
  }
};
exports.removeCalenderEvent = async (req, res, next) => {
  let CalenderEventManager = new CalenderEventService(req.accessControl);
  try {
    let { id } = req.params;
    let calendar = await CalenderEventManager.removeCalenderEvent({ _id: id });
    res
      .status(200)
      .json({ message: "Deleted successfully", calenderEvent: calendar });
  } catch (err) {
    next(err);
  }
};
