const { AssetCRUDOperations } = require("./assets");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const { IMS_POLICIES } = require("@ims-systems-00/ims-core/lib/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
class Lifecycle extends AssetCRUDOperations {
  constructor(connection) {
    super(connection);
  }
  async disposeAsset(id, data) {
    let asset = await this.getAsset({ _id: id });
    if (this._isDisposedAsset(asset))
      throw new Error("This asset is already disposed.");
    if (asset) {
      asset.assetStatus = "Retired";
      asset.disposalMethod = data.disposalMethod;
      asset.disposalCost = data.disposalCost;
      asset.disposalDate = Date.now();
    }
    await asset.save();
    return asset.populateAsset();
  }
  async returnAsset(id) {
    let asset = await this.getAsset({ _id: id });
    if (this._isDisposedAsset(asset))
      throw new Error("This asset is disposed.");
    if (asset) {
      asset.assetStatus = "Returned";
      asset.currentOwner = null;
      asset.lastReturnedDate = Date.now();
    }
    await asset.save();
    return asset.populateAsset();
  }
  async assignAsset(id, data) {
    let asset = await this.getAsset({ _id: id });
    if (this._isDisposedAsset(asset))
      throw new Error("This asset is disposed.");
    if (asset) {
      asset.assetStatus = "In use";
      asset.currentOwner = data.currentOwner;
      asset.lastAssignedDate = Date.now();
    }
    await asset.save();
    return asset.populateAsset();
  }
}
exports.Lifecycle = Lifecycle;
