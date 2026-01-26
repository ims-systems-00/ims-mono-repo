import IVal from "@/validations/validator";

const commonSchema = {
  name: IVal.string().required().label("Name"),
  officeEmail: IVal.string().email().required().label("Office Email"),
  addressCity: IVal.string().required().label("Address City"),
  addressStreet: IVal.string().required().label("Address Street"),
  addressBuilding: IVal.string().required().label("Address Building"),
  addressPostCode: IVal.string().required().label("Address Post Code"),
  addressStateProvince: IVal.string()
    .required()
    .label("Address State Province"),
  countryName: IVal.object().label("Country Name"),
  countryAbbr: IVal.object().required().label("Country Abbreviation"),
  countryCurrency: IVal.object().required().label("Country Currency"),
  countryPhonecode: IVal.object().required().label("Country Phone Code"),
  logometadata: IVal.label("Logo"),
  vatNumber: IVal.string().label("VAT Number"),
};

const createSchema = {
  ...commonSchema,
  contactNumber: IVal.string().label("Contact Number"),
  sizeOfOrg: IVal.number().required().label("Size of Organization"),
  industry: IVal.object().keys({
    value: IVal.string().required().label("Industry"),
    label: IVal.label("Industry"),
  }),
  referralSource: IVal.string().label("Referral Source"),
};

const updateSchema = {
  ...commonSchema,
  contactName: IVal.string().optional().label("Contact Name"),
  contactPosition: IVal.string().optional().label("Contact Position"),
  contactEmail: IVal.string().email().optional().label("Contact Email"),
  companyNumber: IVal.number().label("Company Number"),
  typeOfBusiness: IVal.string().label("Type of Business"),

  bankName: IVal.string().required().label("Bank Name"),
  accountNumber: IVal.number().required().label("Account Number"),
  sortCode: IVal.number().required().label("Sort Code"),

  amount: IVal.number().required().label("Mileage Amount"),
  currency: IVal.object()
    .keys({
      value: IVal.string().required(),
      label: IVal.string(),
    })
    .required()
    .label("Mileage Currency"),
};

export { createSchema, updateSchema };
