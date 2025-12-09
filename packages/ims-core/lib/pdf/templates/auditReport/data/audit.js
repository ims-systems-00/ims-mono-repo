const audit = {
  group: {
    name: "Development team",
    _id: "61523751",
  },
  complianceBody: {
    name: "BM Trada",
    _id: "61523751",
  },
  title: "Title of the audit",
  focusArea: "Focus area",
  auditor: {
    name: "Riad",
    _id: "61523751",
  },
  comment: "Big comment here ",
  startDate: new Date(),
  type: "Internal",
  completed: {
    status: true,
    by: {
      name: "Riad",
      _id: "61523751",
    },
    on: new Date(),
  },
  interval: "Half yearly",
  created: {
    on: new Date(),
    by: {
      name: "Riad",
      _id: "61523751",
    },
  },
  reference: "AUD-12",
  risks: [
    {
      title: "Title  of the risk",
      description: "Descritpion here ",
      score: {
        likelihood: 2,
        consequence: 3,
        total: 6,
      },
    },
    {
      title: "Title  of the risk",
      description: "Descritpion here ",
      score: {
        likelihood: 2,
        consequence: 3,
        total: 6,
      },
    },
    {
      title: "Title  of the risk",
      description: "Descritpion here ",
      score: {
        likelihood: 2,
        consequence: 3,
        total: 6,
      },
    },
    {
      title: "Title  of the risk",
      description: "Descritpion here ",
      score: {
        likelihood: 2,
        consequence: 3,
        total: 6,
      },
    },
    {
      title: "Title  of the risk",
      description: "Descritpion here ",
      score: {
        likelihood: 2,
        consequence: 3,
        total: 6,
      },
    },
    {
      title: "Title  of the risk",
      description: "Descritpion here ",
      score: {
        likelihood: 2,
        consequence: 3,
        total: 6,
      },
    },
  ],
  cips: [
    {
      title: "Title goes here ",
      opportunityForImprovement: "Opportunities for improvements ",
    },
    {
      title: "Title goes here ",
      opportunityForImprovement: "Opportunities for improvements ",
    },
    {
      title: "Title goes here ",
      opportunityForImprovement: "Opportunities for improvements ",
    },
    {
      title: "Title goes here ",
      opportunityForImprovement: "Opportunities for improvements ",
    },
  ],
  identifications: [
    {
      nonConformity: "Some very less non conformity",
      rootCause: "This is the root cause",
    },
    {
      nonConformity: "Some very less non conformity",
      rootCause: "This is the root cause",
    },
    {
      nonConformity: "Some very less non conformity",
      rootCause: "This is the root cause",
    },
    {
      nonConformity: "Some very less non conformity",
      rootCause: "This is the root cause",
    },
    {
      nonConformity: "Some very less non conformity",
      rootCause: "This is the root cause",
    },
  ],
};
exports.audit = audit;
