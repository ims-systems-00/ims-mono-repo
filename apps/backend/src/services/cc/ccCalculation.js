const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
  {
    path: "location",
  },
  {
    path: "customFactorId",
  },
];
class CcCalculation extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createCcCalculation(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let {
      scope,
      scopeName,
      category,
      reportingYear,
      reportingMonth,
      calculationMethod,
      activity,
      unit,
      amount,
      activityDataGrade,
      meterNumber,
      supplierName,
      invoiceNumber,
      customFactorId,
      customReference,
      location,
    } = data;
    let newCcCalculation = new this.CcCalculation({
      scope,
      scopeName,
      category,
      reportingYear,
      reportingMonth,
      calculationMethod,
      activity,
      unit,
      amount,
      activityDataGrade,
      meterNumber,
      supplierName,
      invoiceNumber,
      customFactorId,
      customReference,
      location,
      organization: this.connection.user.organizationId,
    });
    newCcCalculation = await newCcCalculation.save();
    return newCcCalculation.populate(population);
  }
  async getCcCalculation(query) {
    let exist = await this.CcCalculation.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "cc calculation not found with given query."
      );
    return exist.populate(population);
  }
  async updateCcCalculation(id, data) {
    let ccCalculation = await this.getCcCalculation({ _id: id });
    Object.keys(data).map((key) => {
      ccCalculation[key] = data[key];
    });
    ccCalculation = await ccCalculation.save();
    return ccCalculation.populate(population);
  }
  async listCcCalculation(query, options) {
    const pagination = await this.CcCalculation.paginateByOrg(
      this.connection.user.organizationId,
      query,
      { ...options, populate: population }
    );
    return pagination;
  }
  async softRemoveCcCalculation(id) {
    const ccCalculation = this.getCcCalculation({ _id: id });
    if (ccCalculation) {
      await this.CcCalculation.softDelete({ _id: id });
      return ccCalculation;
    }
  }
  async restoreCcCalculation(id) {
    const ccCalculation = await this.getCcCalculation({ _id: id });
    if (ccCalculation) {
      await this.CcCalculation.restore({ _id: id });
      return ccCalculation;
    }
  }
  async hardRemoveCcCalculation(id) {
    const ccCalculation = await this.getCcCalculation({ _id: id });
    if (ccCalculation) {
      await this.CcCalculation.deleteOne({ _id: id });
      return ccCalculation;
    }
  }
}

module.exports = { CcCalculation };
