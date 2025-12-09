import React from 'react'
import { shallow } from 'enzyme'
import ExpenseReportDetails from "@/views/staffWallet/expenseReport/ExpenseReportDetails'
const CLIENT_URL = process.env.REEACT_API_CLINET_URL
describe('report detail view :', () => {
  const props = {
    match: {
      url: CLIENT_URL,
      path: "/"
    },
  }
  it('renders properly', () => {
   let wrapper = shallow(<ExpenseReportDetails {...props} />)
  })
})