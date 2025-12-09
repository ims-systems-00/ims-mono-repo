/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'informationInventory':Joi.string().label("Information inventory"),
	'title':Joi.string().required().label("Title"),
	'owner':Joi.string().label("Owner"),
	'storageLocation':Joi.string().label("Storage location"),
	'format':Joi.string().label("Format"),
	'link':Joi.string().label("Link"),
	'cost':Joi.number().label("Cost"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules