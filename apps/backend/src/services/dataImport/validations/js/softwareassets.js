/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'name':Joi.string().required().label("Name"),
	'numberOfLicenses':Joi.number().label("Number of licenses"),
	'numberOfInstalls':Joi.number().label("Number of installs"),
	'cost':Joi.number().label("Cost"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules