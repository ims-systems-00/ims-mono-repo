const { Manager } = require("./manager");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const population = [
  {
    path: "organization",
    select: "name logo",
  },
];
class CcCustomFactor extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createCcCustomFactor(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let {
      category,
      factorType,
      id,
      year,
      scope,
      level1,
      combinedActivityReference,
      uom,
      ghgPerUnit,
      ghgConversionFactor,
      sicCategory,
      sic,
      sicGhgCo2ePerCurrency,
      sicGhgCo2PerCurrency,
      purchasedElectricityCoal,
      purchasedElectricityNaturalGas,
      purchasedElectricityNuclear,
      purchasedElectricityRenewables,
      purchasedElectricityOther,
      source,
      sourceLink,
      sourceNotes,
      neroNotes,
      grade,
    } = data;
    let newCcCustomFactor = new this.CcCustomFactor({
      category,
      factorType,
      id,
      year,
      scope,
      level1,
      combinedActivityReference,
      uom,
      ghgPerUnit,
      ghgConversionFactor,
      sicCategory,
      sic,
      sicGhgCo2ePerCurrency,
      sicGhgCo2PerCurrency,
      purchasedElectricityCoal,
      purchasedElectricityNaturalGas,
      purchasedElectricityNuclear,
      purchasedElectricityRenewables,
      purchasedElectricityOther,
      source,
      sourceLink,
      sourceNotes,
      neroNotes,
      grade,
      organization: this.connection.user.organizationId,
    });
    newCcCustomFactor = await newCcCustomFactor.save();
    return newCcCustomFactor.populate(population);
  }
  async getCcCustomFactor(query) {
    let exist = await this.CcCustomFactor.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "cc custom factor not found with given query."
      );
    return exist.populate(population);
  }
  async updateCcCustomFactor(id, data) {
    let ccCustomFactor = await this.getCcCustomFactor({ _id: id });
    let updatedCcCustomFactor = await this.CcCustomFactor.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
        },
      },
      { new: true }
    );
    updatedCcCustomFactor = await updatedCcCustomFactor.populate(population);
    return updatedCcCustomFactor;
  }
  async listCcCustomFactor(query, options) {
    const pagination = await this.CcCustomFactor.paginateByOrg(
      this.connection.user.organizationId,
      query,
      { ...options, populate: population }
    );
    return pagination;
  }
  async softRemoveCcCustomFactor(id) {
    const ccCustomFactor = this.getCcCustomFactor({ _id: id });
    if (ccCustomFactor) {
      await this.CcCustomFactor.softDelete({ _id: id });
      return ccCustomFactor;
    }
  }
  async restoreCcCustomFactor(id) {
    const ccCustomFactor = await this.getCcCustomFactor({ _id: id });
    if (ccCustomFactor) {
      await this.CcCustomFactor.restore({ _id: id });
      return ccCustomFactor;
    }
  }
  async hardRemoveCcCustomFactor(id) {
    const calculationExists = await this.CcCalculation.findOne({
      customFactorId: id,
    });
    if (calculationExists)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "One or more data-points uses this conversion factor. Delete them first."
      );
    const ccCustomFactor = await this.getCcCustomFactor({ _id: id });
    if (ccCustomFactor) {
      await this.CcCustomFactor.deleteOne({ _id: id });
      return ccCustomFactor;
    }
  }
}

module.exports = { CcCustomFactor };
