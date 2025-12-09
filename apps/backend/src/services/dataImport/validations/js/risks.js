/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'title':Joi.string().required().label("Risk title"),
	'type':Joi.string().required().valid('Hardware', 'Software', 'People', 'Premise', 'Organisational', 'Clinical').label("Risk category"),
	'description':Joi.string().label("Description"),
	'controlsAndMitigation':Joi.string().label("Controls and mitigation"),
	'acceptanceRational':Joi.string().label("Acceptance rational"),
	'decisionMaker':Joi.string().label("Decision maker"),
	'owner':Joi.string().label("Risk owner"),
	'score.likelihood.initial':Joi.number().required().valid(1,2,3,4,5).label("Likelihood"),
	'score.consequence.initial':Joi.number().required().valid(1,2,3,4,5).label("Consequence"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules