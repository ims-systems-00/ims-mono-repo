let HardwareAssetModel = require("../models/mongodb/system/inventory/hardwareAsset");
let SoftwareAssetModel = require("../models/mongodb/system/inventory/softwareAsset");
let InformationAssetModel = require("../models/mongodb/system/inventory/informationAsset");
let PeopleAssetModel = require("../models/mongodb/system/inventory/peopleAsset");
let PremiseAssetModel = require("../models/mongodb/system/inventory/premiseAsset");
const { IamPolicy } = require("../services/iamPolicy");
const { trimQuery } = require("../validations/utils");
const { imsPaginationFormated, Filters } = require("../services/utility");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const { APIError } = require("../helpers/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { basicRoleScopedFilter } = require("../queries");

class AssetsService {
  constructor(connection) {
    this.connection = connection;
    this.HardwareAsset = HardwareAssetModel(connection);
    this.SoftwareAsset = SoftwareAssetModel(connection);
    this.InformationAsset = InformationAssetModel(connection);
    this.imsPaginationFormated = imsPaginationFormated;
    this.PeopleAsset = PeopleAssetModel(connection);
    this.PremiseAsset = PremiseAssetModel(connection);
  }
  async createHardwareAsset(data) {
    let hardwareAsset = await this.HardwareAsset.create({
      organization: this.connection.user.organizationId,
      tagsAndCategories: data.tagsAndCategories,
      name: data.name,
      owner: data.owner,
      assignedDate: data.assignedDate,
      returnDate: data.returnDate || null,
      destructionDate: data.destructionDate || null,
      cost: data.cost,
      tag: data.tag,
      group: data.group,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    return this.HardwareAsset.populateAsset(hardwareAsset);
  }
  async editHardwareAsset(id, data) {
    let hardwareAsset = await this.getHardwareAsset(id);
    hardwareAsset.name = data.name;
    (hardwareAsset.tagsAndCategories = data.tagsAndCategories),
      (hardwareAsset.tag = data.tag);
    hardwareAsset.owner = data.owner;
    hardwareAsset.assignedDate = data.assignedDate;
    hardwareAsset.returnDate = data.returnDate || null;
    hardwareAsset.destructionDate = data.destructionDate || null;
    hardwareAsset.cost = data.cost;
    await hardwareAsset.save();
    return this.HardwareAsset.populateAsset(hardwareAsset);
  }

  async getHardwareAssetsByOrg(query, options) {
    let pagination = await this.HardwareAsset.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let hardwareAssets = pagination.docs;
    hardwareAssets = await Promise.all(
      hardwareAssets.map((hardwareAsset) =>
        this.HardwareAsset.populateAsset(hardwareAsset)
      )
    );
    return {
      hardwareAssets,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getHardwareAsset(id) {
    let hardwareAsset = await this.HardwareAsset.findOne({ _id: id });
    if (!hardwareAsset)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No hardware asset found with the id"
      );
    return this.HardwareAsset.populateAsset(hardwareAsset);
  }
  async removeHardwareAsset(id) {
    let hardwareAsset = await this.getHardwareAsset(id);
    await this.HardwareAsset.findOneAndDelete({ _id: id });
    return hardwareAsset;
  }
  async createSoftwareAsset(data) {
    let softwareAsset = await this.SoftwareAsset.create({
      organization: this.connection.user.organizationId,
      tagsAndCategories: data.tagsAndCategories,
      name: data.name,
      numberOfLicenses: data.numberOfLicenses,
      numberOfInstalls: data.numberOfInstalls,
      keys: data.keys,
      cost: data.cost,
      docs: data.docs ? data.docs : [],
      group: data.group,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    return this.SoftwareAsset.populateAsset(softwareAsset);
  }
  async getSoftwareAssetsByOrg(query, options) {
    let pagination = await this.SoftwareAsset.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let softwareAssets = pagination.docs;
    softwareAssets = await Promise.all(
      softwareAssets.map((softwareAsset) =>
        this.SoftwareAsset.populateAsset(softwareAsset)
      )
    );
    return {
      softwareAssets,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getSoftwareAsset(id) {
    let softwareAsset = await this.SoftwareAsset.findOne({ _id: id });
    if (!softwareAsset)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Software Asset not found with given id."
      );
    return this.SoftwareAsset.populateAsset(softwareAsset);
  }
  async editSoftwareAsset(id, data) {
    let softwareAsset = await this.getSoftwareAsset(id);
    softwareAsset.name = data.name;
    (softwareAsset.tagsAndCategories = data.tagsAndCategories),
      (softwareAsset.numberOfLicenses = data.numberOfLicenses);
    softwareAsset.numberOfInstalls = data.numberOfInstalls;
    softwareAsset.cost = data.cost;
    softwareAsset.docs = [...softwareAsset.docs, ...data.docs];
    await softwareAsset.save();
    return this.SoftwareAsset.populateAsset(softwareAsset);
  }
  async addSoftwareKey(id, { key }) {
    let softwareAsset = await this.getSoftwareAsset(id);
    if (softwareAsset) {
      softwareAsset = await this.SoftwareAsset.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $push: { keys: key },
        },
        {
          new: true,
        }
      );
      return this.SoftwareAsset.populateAsset(softwareAsset);
    }
  }
  async removeSoftwareKey(id, keyId) {
    let softwareAsset = await this.getSoftwareAsset(id);
    if (softwareAsset) {
      softwareAsset = await this.SoftwareAsset.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $pull: { keys: { _id: keyId } },
        },
        {
          new: true,
        }
      );

      return this.SoftwareAsset.populateAsset(softwareAsset);
    }
  }
  async addSoftwareDocument(id, data) {
    let softwareAsset = await this.getSoftwareAsset(id);

    if (softwareAsset) {
      softwareAsset = await this.SoftwareAsset.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            docs: data.docs,
          },
        },
        { new: true }
      );
      return this.SoftwareAsset.populateAsset(softwareAsset);
    }
  }
  async removeSoftwareDocument(id, docsId) {
    let softwareAsset = await this.getSoftwareAsset(id);
    if (softwareAsset) {
      softwareAsset = await this.SoftwareAsset.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            docs: { _id: docsId },
          },
        },
        { new: true }
      );
      return this.SoftwareAsset.populateAsset(softwareAsset);
    }
  }
  async removeSoftwareAsset(id) {
    let softwareAsset = await this.getSoftwareAsset(id);
    if (softwareAsset) {
      await this.SoftwareAsset.deleteOne({ _id: id });
    }
    return softwareAsset;
  }

  async createInformationAsset(data) {
    let informationAsset = await this.InformationAsset.create({
      organization: this.connection.user.organizationId,
      tagsAndCategories: data.tagsAndCategories,
      informationInventory: data.informationInventory,
      title: data.title,
      owner: data.owner,
      storageLocation: data.storageLocation,
      format: data.format,
      link: data.link,
      cost: data.cost,
      group: data.group,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    await informationAsset.save();
    return this.InformationAsset.populateAsset(informationAsset);
  }
  async editInformationAsset(id, data) {
    let informationAsset = await this.getInformationAsset(id);
    informationAsset.informationInventory = data.informationInventory;
    (informationAsset.tagsAndCategorie = data.tagsAndCategories),
      (informationAsset.title = data.title);
    informationAsset.owner = data.owner;
    informationAsset.storageLocation = data.storageLocation;
    informationAsset.format = data.format;
    informationAsset.link = data.link;
    informationAsset.cost = data.cost;
    await informationAsset.save();
    // let informationAsset = await InformationAsset.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     $set: {
    //       informationInventory,
    //       title,
    //       owner,
    //       storageLocation,
    //       format,
    //       link,
    //       cost,
    //     },
    //   },
    //   { new: true }
    // );
    return this.InformationAsset.populateAsset(informationAsset);
  }
  async getInformationAssetsByOrg(query, options) {
    let pagination = await this.InformationAsset.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let informationAssets = pagination.docs;
    informationAssets = await Promise.all(
      informationAssets.map((informationAsset) =>
        this.InformationAsset.populateAsset(informationAsset)
      )
    );
    return {
      informationAssets,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getInformationAsset(id) {
    let informationAsset = await this.InformationAsset.findOne({ _id: id });
    if (!informationAsset)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Information asset not found with given id"
      );
    return this.InformationAsset.populateAsset(informationAsset);
  }
  async removeInformationAsset(id) {
    let informationAsset = await this.getInformationAsset(id);
    if (informationAsset) {
      await this.InformationAsset.deleteOne({ _id: id });
    }
    return informationAsset;
  }

  async createPeopleAsset(data) {
    let peopleAsset = await this.PeopleAsset.create({
      organization: this.connection.user.organizationId,
      tagsAndCategories: data.tagsAndCategories,
      name: data.name,
      role: data.role,
      responsibility: data.responsibility,
      skill: data.skill,
      group: data.group,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    await peopleAsset.save();
    return this.PeopleAsset.populateAsset(peopleAsset);
  }
  async getPeopleAssetsByOrg(query, options) {
    let pagination = await this.PeopleAsset.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let peopleAssets = pagination.docs;
    peopleAssets = await Promise.all(
      peopleAssets.map((peopleAsset) =>
        this.PeopleAsset.populateAsset(peopleAsset)
      )
    );
    return { peopleAssets, pagination: this.imsPaginationFormated(pagination) };
  }
  async getPeopleAsset(id) {
    let peopleAsset = await this.PeopleAsset.findOne({ _id: id });
    if (!peopleAsset)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "People asset not found with given id"
      );
    return this.PeopleAsset.populateAsset(peopleAsset);
  }
  async removePeopleAsset(id) {
    let peopleAsset = await this.getPeopleAsset(id);
    if (peopleAsset) {
      await this.PeopleAsset.deleteOne({ _id: id });
    }
    return peopleAsset;
  }
  async editPeopleAsset(id, data) {
    let peopleAsset = await this.getPeopleAsset(id);
    peopleAsset.role = data.role;
    (peopleAsset.tagsAndCategories = data.tagsAndCategories),
      (peopleAsset.responsibility = data.responsibility);
    peopleAsset.skill = data.skill;
    peopleAsset.name = data.name;
    await peopleAsset.save();
    return this.PeopleAsset.populateAsset(peopleAsset);
    // let peopleAsset = await PeopleAsset.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     $set: { role, responsibility, skill, name },
    //   },
    //   { new: true }
    // );
  }

  async createPremiseAsset(data) {
    let premiseAsset = await this.PremiseAsset.create({
      organization: this.connection.user.organizationId,
      group: data.group,
      tagsAndCategories: data.tagsAndCategories,
      name: data.name,
      location: data.location,
      address: data.address,
      cost: data.cost,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });

    await premiseAsset.save();
    return this.PremiseAsset.populateAsset(premiseAsset);
  }
  async getPremiseAssetsByOrg(query, options) {
    let pagination = await this.PremiseAsset.paginateByOrg(
      this.connection?.user?.organizationId,
      { ...query, ...basicRoleScopedFilter(this.connection) },
      options
    );
    let premiseAssets = pagination.docs;
    premiseAssets = await Promise.all(
      premiseAssets.map((premiseAsset) =>
        this.PremiseAsset.populateAsset(premiseAsset)
      )
    );
    return {
      premiseAssets,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getPremiseAsset(id) {
    let premiseAsset = await this.PremiseAsset.findOne({ _id: id });
    if (!premiseAsset)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Premise Asset not found with given id."
      );
    return this.PremiseAsset.populateAsset(premiseAsset);
  }
  async editPremiseAsset(id, data) {
    let premiseAsset = await this.getPremiseAsset(id);
    premiseAsset.name = data.name;
    (premiseAsset.tagsAndCategories = data.tagsAndCategories),
      (premiseAsset.location = data.location);
    premiseAsset.address = data.address;
    premiseAsset.cost = data.cost;
    await premiseAsset.save();
    return this.PremiseAsset.populateAsset(premiseAsset);
    // let premiseAsset = await PremiseAsset.findOneAndUpdate(
    //   { _id: id },
    //   {
    //     $set: { name, location, address, cost },
    //   },
    //   { new: true }
    // );
  }
  async removePremiseAsset(id) {
    let premiseAsset = await this.getPremiseAsset(id);
    if (premiseAsset) {
      await this.PremiseAsset.deleteOne({ _id: id });
    }
    return premiseAsset;
  }
}
module.exports = AssetsService;
