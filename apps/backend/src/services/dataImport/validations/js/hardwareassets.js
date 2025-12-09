/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'name':Joi.string().required().label("Name"),
	'tag':Joi.string().label("Tag"),
	'owner':Joi.string().label("Owner"),
	'assignedDate':Joi.date().label("Assigned date"),
	'returnDate':Joi.date().label("Returned date"),
	'destructionDate':Joi.date().label("Destruction date"),
	'cost':Joi.number().label("Cost"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules