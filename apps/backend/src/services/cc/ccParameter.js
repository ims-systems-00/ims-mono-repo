const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const mongoose = require("mongoose");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
];
class CcParameter extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createCcParameter(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let {
      reportingStartDate,
      baseReportingYear,
      currentReportingYear,
      primaryReportingMethod,
      organisationalBoundary,
      netZeroTargtYear,
      netZeroReductionPercentageAmbition,
    } = data;
    let exists = await this.CcParameter.findOne({
      organization: this.connection.user.organizationId,
    });
    if (exists)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Organisation already has a parameter initiated."
      );
    let newCcParameter = new this.CcParameter({
      reportingStartDate,
      baseReportingYear,
      currentReportingYear,
      primaryReportingMethod,
      organisationalBoundary,
      netZeroTargtYear,
      netZeroReductionPercentageAmbition,
      organization: this.connection.user.organizationId,
    });
    newCcParameter = await newCcParameter.save();
    return newCcParameter.populate(population);
  }
  async getCcParameter(query) {
    let exist = await this.CcParameter.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "cc parameter not found with given query."
      );
    return exist.populate(population);
  }
  async updateCcParameter(id, data) {
    let ccParameter = await this.getCcParameter({ _id: id });
    let updatedCcParameter = await this.CcParameter.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );
    updatedCcParameter = await updatedCcParameter.populate(population);
    return updatedCcParameter;
  }
  async listCcParameters(query, options) {
    const aggregate = this.CcParameter.aggregate();
    aggregate.match({
      ...query,
      organization: new mongoose.Types.ObjectId(
        this.connection.user.organizationId
      ),
    });
    const pagination = await this.CcParameter.aggregatePaginate(
      aggregate,
      options
    );
    return pagination;
  }
  async softRemoveCcParameter(id) {
    const ccParameter = this.getCcParameter({ _id: id });
    if (ccParameter) {
      await this.CcParameter.softDelete({ _id: id });
      return ccParameter;
    }
  }
  async restoreCcParameter(id) {
    const ccParameter = await this.getCcParameter({ _id: id });
    if (ccParameter) {
      await this.CcParameter.restore({ _id: id });
      return ccParameter;
    }
  }
  async hardRemoveCcParameter(id) {
    const ccParameter = await this.getCcParameter({ _id: id });
    if (ccParameter) {
      await this.CcParameter.deleteOne({ _id: id });
      return ccParameter;
    }
  }

  // cc parameter reporting boundaries

  async updateCcParameterReportingBoundary(id, data) {
    const ccParameter = await this.getCcParameter({ _id: data.parameterId });

    const updatedCcParameter = await this.CcParameter.findOneAndUpdate(
      { _id: data.parameterId, "reportingBoundaries._id": id },
      {
        $set: {
          "reportingBoundaries.$.relevance": data.relevance,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedCcParameter) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "reporting boundary not found with given id."
      );
    }

    const updatedReportingBoundary =
      await updatedCcParameter.reportingBoundaries.find(
        (boundary) => boundary._id.toString() === id.toString()
      );

    return updatedReportingBoundary;
  }

  async getCcParameterReportingBoundaries(id) {
    const ccParameter = await this.getCcParameter({ _id: id });
    return ccParameter.reportingBoundaries;
  }

  // cc parameter reporting years
  async updateCcParameterReportingYear(id, data) {
    const ccParameter = await this.getCcParameter({ _id: data.parameterId });

    if (!ccParameter) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "cc parameter not found with given parameterId."
      );
    }

    const updateFields = {};

    if (data.turnOver !== undefined) {
      updateFields["reportingYears.$.turnOver"] = data.turnOver;
    }

    if (data.employeeCount !== undefined) {
      updateFields["reportingYears.$.employeeCount"] = data.employeeCount;
    }

    const updatedCcParameter = await this.CcParameter.findOneAndUpdate(
      { _id: data.parameterId, "reportingYears._id": id },
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    );

    if (!updatedCcParameter) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "reporting year not found with given id."
      );
    }

    const updatedReportingYear = updatedCcParameter.reportingYears.find(
      (year) => year._id.toString() === id.toString()
    );

    if (!updatedReportingYear) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "reporting year not found with given id in updated ccParameter."
      );
    }

    return updatedReportingYear;
  }

  async getCcParameterReportingYears(id) {
    const ccParameter = await this.getCcParameter({ _id: id });
    return ccParameter.reportingYears;
  }
}

module.exports = { CcParameter };
