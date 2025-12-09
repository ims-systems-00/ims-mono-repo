const templates = {
  construction_details: [
    {
      type: "text-input",
      label: "Main Contractor",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Enter contractor name",
      isRequired: false,
      maxLength: 100,
    },
    {
      type: "text-input",
      label: "Site Address",
      validations: {
        plainTextRules: "",
      },
      value: "",
      placeholder: "Enter site address",
      isRequired: false,
      maxLength: 200,
    },
    {
      type: "text-input",
      label: "Delivery Address",
      validations: {
        plainTextRules: "",
      },
      value: "",
      placeholder: "Enter delivery address",
      isRequired: false,
      maxLength: 200,
    },
    {
      type: "number-input",
      label: "Internal Handover Pack",
      validations: {},
      value: false,
      isRequired: false,
    },
    {
      type: "date-input",
      label: "Internal Handover Date",
      validations: {
        dateRule: {},
      },
      value: "",
      isRequired: false,
    },

    {
      type: "text-input",
      label: "Scope of Works",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Enter scope of works",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Contracts Manager",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Enter the name of contracts manager",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Contracts Manager Tel",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Contracts Manager Tel",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Project Manager",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Enter the name of project manager",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Project Manager Tel",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Project Manager Tel",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Quantity Surveyor",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Enter the name of Quantity Surveyor",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Quantity Surveyor Tel",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Quantity Surveyor Tel",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Health and Safety Manager",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Enter the name of Health and Safety Manager",
      isRequired: false,
      maxLength: 500,
    },

    {
      type: "text-input",
      label: "Health and Safety Manager Tel",
      validations: {
        plainTextRules: "required",
      },
      value: "",
      placeholder: "Health and Safety Manager Tel",
      isRequired: false,
      maxLength: 500,
    },
  ],
  template1: [
    { name: "Custom Field A", type: "text", required: false },
    { name: "Custom Field B", type: "date", required: false },
  ],
};

module.exports = templates;
