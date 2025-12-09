/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'name':Joi.string().required().label("Name"),
	'location':Joi.string().required().label("Location"),
	'address':Joi.string().required().label("Address"),
	'cost':Joi.number().label("Cost"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules