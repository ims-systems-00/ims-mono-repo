const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
class AssetCRUDOperations extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createAsset(data) {
    const asset = new this.Assets({
      group: data.group,
      tagsAndCategories: data.tagsAndCategories,
      name: data.name,
      description: data.description,
      type: data.type,
      informationInventory: data.informationInventory,
      currentOwner: data.currentOwner || null,
      serialNumber: data.serialNumber,
      manufacturer: data.manufacturer,
      modelNumber: data.modelNumber,
      supplier: data.supplier,
      purchaseDate: data.purchaseDate || null,
      purchaseCost: data.purchaseCost || 0,
      currentCondition: data.currentCondition,
      assignedTo: null,
      warrantyProvider: data.warrantyProvider,
      warrantyExpirationDate: data.warrantyExpirationDate || null,
      assetStatus: data.assetStatus,
      acquisitionDate: data.acquisitionDate || null,
      lastAssignedDate: data.lastAssignedDate || null,
      lastReturnedDate: data.lastAssignedDate || null,
      expectedEndOfLifeDate: data.expectedEndOfLifeDate || null,
      disposalDate: data.disposalDate || null,
      disposalMethod: data.disposalMethod,
      disposalCost: data.disposalCost,
      customFields: data.customFields || null,
      attachments: data.attachments,
      currentLocation: data.currentLocation,
      /** following block is applicatble for people type of asset */
      role: data.role,
      responsibility: data.responsibility,
      skill: data.skill,
      /** following is specially apllicable for information asset */
      format: data.format,
      link: data.link,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    asset.barcodeOrQRCode = JSON.stringify({
      link: process.env.CLIENT_URL + "/admin/assets" + asset._id,
      tenant: this.connection.name,
      module: asset._id,
      moduleType: "assets",
    });
    return asset.save();
  }
  async updateAsset(id, data) {
    const asset = await this.getAsset({ _id: id });
    if (asset) {
      asset.group = data.group;
      asset.tagsAndCategories = data.tagsAndCategories;
      asset.name = data.name;
      asset.description = data.description;
      asset.type = data.type;
      asset.informationInventory = data.informationInventory;
      asset.currentOwner = data.currentOwner || null;
      asset.serialNumber = data.serialNumber;
      asset.manufacturer = data.manufacturer;
      asset.modelNumber = data.modelNumber;
      asset.supplier = data.supplier;
      asset.purchaseDate = data.purchaseDate || null;
      asset.purchaseCost = data.purchaseCost || 0;
      asset.currentCondition = data.currentCondition;
      asset.assignedTo = null;
      asset.warrantyProvider = data.warrantyProvider;
      asset.warrantyExpirationDate = data.warrantyExpirationDate || null;
      asset.assetStatus = data.assetStatus;
      asset.acquisitionDate = data.acquisitionDate || null;
      asset.expectedEndOfLifeDate = data.expectedEndOfLifeDate || null;
      asset.customFields = data.customFields || null;
      asset.attachments = [...asset.attachments, ...data.attachments];
      asset.currentLocation = data.currentLocation;
      /** following block is applicatble for people type of asset */
      asset.role = data.role;
      asset.responsibility = data.responsibility;
      asset.skill = data.skill;
      /** following is specially apllicable for information asset */
      asset.format = data.format;
      asset.link = data.link;
    }
    await asset.save();
    return asset.populateAsset();
  }
  async listAssets(query, options) {
    let pagination = await this.Assets.paginate(query, options);
    let assets = pagination.docs;
    assets = await Promise.all(
      assets.map((asset) => this.Assets.populateAsset(asset))
    );
    return { assets, pagination: this.imsPaginationFormated(pagination) };
  }
  async getAsset(query) {
    let asset = await this.Assets.findOne(query);
    if (!asset) throw new Error("No asset was found with the query.");
    return this.Assets.populateAsset(asset);
  }
  async deleteAsset(id) {
    let asset = await this.getAsset({ _id: id });
    await this.Assets.deleteOne({ _id: id });
    return asset;
  }
  async deleteAttachment(id, data) {
    let asset = await this.getAsset({ _id: id });
    asset = await this.Assets.findOneAndUpdate(
      { _id: id },
      {
        $pull: { attachments: { _id: data.attachment_id } },
      },
      { new: true }
    );
    return this.Assets.populateAsset(asset);
  }
}
exports.AssetCRUDOperations = AssetCRUDOperations;
