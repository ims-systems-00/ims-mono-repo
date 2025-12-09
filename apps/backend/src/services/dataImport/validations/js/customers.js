/**
* CAUTION: This is a generated file, please do not touch or amend any validation rules.
* NOTE: If you want to update any validation rule, update coresponding json and run yarn syn-import-validations.
*/
let Joi = require('joi');
let rules = {
	'group':Joi.string().required().label("Business function"),
	'companyNumber':Joi.number().label("Company number"),
	'probability':Joi.number().label("Probability"),
	'source':Joi.string().label("Source"),
	'stage':Joi.string().valid('Live', 'Prospect', 'Warm lead', 'Qualified', 'Proposal').label("Organisational profile"),
	'phoneNumber':Joi.number().label("Phone number"),
	'name':Joi.string().required().label("Customer name"),
	'buildingName':Joi.string().required().label("Building name"),
	'streetName':Joi.string().required().label("Street name"),
	'postCode':Joi.string().required().label("Post code"),
	'town':Joi.string().required().label("Town"),
	'accountManager':Joi.string().label("Account manager"),
	'accountNumber':Joi.string().label("Account number"),
	'primaryContact':Joi.string().label("Primary contact"),
	'primaryEmail':Joi.string().email().label("Primary email"),
	'secondaryContact':Joi.string().label("Secondary contact"),
	'secondaryEmail':Joi.string().email().label("Secondary email"),
	'serviceProvision':Joi.string().label("Service provision"),
	'contractValue':Joi.number().label("Contract value"),
	'contractStartDate':Joi.date().label("Contract start date"),
	'contractEndDate':Joi.date().label("Contract end date"),
	'reviewDate':Joi.date().label("Review date"),
	'notes':Joi.string().label("Notes"),
	'reasonForLoss':Joi.string().label("Reason for loss"),
	'organization':Joi.any().label("Organization")
}
exports.rules = rules