const request = {
  accessControl:{
    user: {
      _id: '626d4172c77bfc09801a6aab',
      tenant: 'sandbox',
      name: 'rafee',
      current: {
        groupPolicy: '626d4120c77bfc09801a6a32',
        rolePolicy: '626d41b9c77bfc09801a6ad3',
        group: [],
        role: []
      }
    },
    session: {
      _id: '628a40351dd3e21ad0e6b6d0',
      current: {
        group: '626d4120c77bfc09801a6a54',
        role: '626d41bac77bfc09801a6afa'
      }
    },
    managedUsers: [
      '626d4172c77bfc09801a6aab',
      '626d46111ab0016d83ec91f2',
    ],
    groupPolicy: {
      usedFor: 'Business unit',
      reference: 'PLC-0',
      _id: "626d4120c77bfc09801a6a32",
      name: 'iMS System administration',
      type: 'iMS managed',
      accessScope: 'All business unit',
      statement: [
        
      ],
      createdAt: "2022-04-30T14:01:04.421Z",
      updatedAt: "2022-05-06T14:55:21.684Z",
      ID: 0,
      __v: 0
    },
    rolePolicy: {
      usedFor: 'Roles',
      reference: 'PLC-3',
      _id: "626d41b9c77bfc09801a6ad3",
      name: 'iMS Super admin',
      type: 'iMS managed',
      accessScope: 'All business unit',
      statement: [
        
      ],
      createdAt: "2022-04-30T14:03:37.838Z",
      updatedAt: "2022-05-06T14:56:31.421Z",
      ID: 3,
      __v: 0
    }
  }
}
module.exports = {
  request
}