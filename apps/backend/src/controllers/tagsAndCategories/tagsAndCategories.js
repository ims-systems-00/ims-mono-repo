const {
  TagsAndCategoriesService,
} = require("../../services/tagsAndCategories");
const { Filters } = require("../../services/utility");
exports.createTagAndCategory = async (req, res, next) => {
  let tagsAndCategoriesManager = new TagsAndCategoriesService(req.accessControl);
  try {
    let tagAndCategory = await tagsAndCategoriesManager.createTagAndCategory({
      ...req.body,
      createdBy: req.accessControl.user,
      organization: req.accessControl.user.organizationId,
    });
    res
      .status(201)
      .json({ message: "TagAndCategory has been created.", tagAndCategory });
  } catch (err) {
    next(err)
  }
};
exports.editTagAndCategory = async (req, res, next) => {
  let tagsAndCategoriesManager = new TagsAndCategoriesService(req.accessControl);
  try {
    let { id } = req.params;
    let tagAndCategory = await tagsAndCategoriesManager.updateTagAndCategory(
      id,
      {
        ...req.body,
        updatedBy: req.accessControl.user,
      }
    );
    res
      .status(200)
      .json({ message: "TagAndCategory update success", tagAndCategory });
  } catch (err) {
    next(err)
  }
};
exports.getTagAndCategory = async (req, res, next) => {
  let tagsAndCategoriesManager = new TagsAndCategoriesService(req.accessControl);
  try {
    let { id } = req.params;
    let tagAndCategory = await tagsAndCategoriesManager.getTagAndCategory({
      _id: id,
    });
    res
      .status(200)
      .json({ message: "TagAndCategory retrival successful", tagAndCategory });
  } catch (err) {
    next(err)
  }
};
exports.getTagsAndCategories = async (req, res, next) => {
  let tagsAndCategoriesManager = new TagsAndCategoriesService(req.accessControl);
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["name", "description", "applicableModules"],
    })
      .build()
      .query();
    let query = { ...filter };
    const result = await tagsAndCategoriesManager.listTagsAndCategoriesByOrg(
      query,
      options
    );
    res.status(200).json({
      message: "TagsAndCategories retrival success",
      pagination: result.pagination,
      tagsAndCategories: result.tagsAndCategories,
    });
  } catch (err) {
    next(err)
  }
};
exports.deleteTagAndCategory = async (req, res, next) => {
  let tagsAndCategoriesManager = new TagsAndCategoriesService(req.accessControl);
  try {
    let tagAndCategory = await tagsAndCategoriesManager.deleteTagsAndCategories(
      {
        _id: req.params.id,
      }
    );
    res
      .status(200)
      .json({ message: "TagAndCategory has been deleted", tagAndCategory });
  } catch (err) {
    next(err)
  }
};
