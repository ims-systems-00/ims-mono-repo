/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'title':Joi.string().required().label("Incident title"),
	'description':Joi.string().label("Description"),
	'owner':Joi.string().label("Incident owner"),
	'methodOfNotification':Joi.string().label("Method of notification"),
	'affectedService':Joi.string().label("Affected service"),
	'privacy':Joi.string().label("Type"),
	'resolution':Joi.string().label("Resolution"),
	'priority':Joi.string().valid('P1', 'P2', 'P3', 'P4').label("Priority"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules