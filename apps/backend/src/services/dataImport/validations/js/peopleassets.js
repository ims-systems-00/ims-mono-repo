/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'name':Joi.string().required().label("Name"),
	'role':Joi.string().required().label("Role"),
	'responsibility':Joi.string().label("Responsibility"),
	'skill':Joi.string().required().label("Skill"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules