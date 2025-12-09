const { Manager } = require("./manager");
const { sendMail } = require("../../email/sendMail");
const { SERVER_EVENTS } = require("../../events/constants");
const eventEmitter = require("../../events/event-manager").getInstance();
const moment = require("moment");
const { APIError } = require("../../helpers/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class TagsAndCategoriesService extends Manager {
  constructor(connection) {
    super(connection);
  }
  async createTagAndCategory(data) {
    const tagAndCategory = new this.TagsAndCategories({
      applicableModules: data.applicableModules,
      name: data.name,
      description: data.description,
      organization: this.connection.user.organizationId,
      created: {
        by: data.createdBy,
        on: Date.now(),
      },
    });
    return tagAndCategory.save();
  }
  async updateTagAndCategory(id, data) {
    let tagAndCategory = await this.getTagAndCategory({ _id: id });
    tagAndCategory.name = data.name;
    tagAndCategory.description = data.description;
    return tagAndCategory.save();
  }
  async listTagsAndCategories(query, options) {
    let pagination = await this.TagsAndCategories.paginate(query, options);
    let tagsAndCategories = pagination.docs;
    return {
      tagsAndCategories,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async listTagsAndCategoriesByOrg(query, options) {
    let pagination = await this.TagsAndCategories.paginateByOrg(
      this.connection?.user?.organizationId,
      query,
      options
    );
    let tagsAndCategories = pagination.docs;
    /** when populateTagsAndCategories implemented in model , then this block will be work**/
   
    // tagsAndCategories = await Promise.all(
    //   tagsAndCategories.map((tagsAndCategorie) =>
    //     this.TagsAndCategories.populateTagsAndCategories(tagsAndCategorie)
    //   )
    // );
    
    return {
      tagsAndCategories,
      pagination: this.imsPaginationFormated(pagination),
    };
  }
  async getTagAndCategory(query) {
    let tagAndCategory = await this.TagsAndCategories.findOne(query);
    if (!tagAndCategory)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No tag and category was found with the query."
      );
    return tagAndCategory;
  }
  async deleteTagsAndCategories(query) {
    let tagAndCategory = await this.getTagAndCategory(query);
    await this.TagsAndCategories.deleteOne(query);
    return tagAndCategory;
  }
}
exports.TagsAndCategoriesService = TagsAndCategoriesService;
