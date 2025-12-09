import React from 'react'
import { mount, shallow } from 'enzyme'
import { render } from '@testing-library/react'
import ExpenseReports from "@/views/staffWallet/expenseReport/ExpenseReports'
import * as expensesService from 'services/wallet/expenseReportServices'
import { reports } from '../__mocks__/report.data'
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL
describe('expense reports tabular view:', () => {
  const props = {
    match: {
      url: CLIENT_URL
    },
  }
  it('renders without crashing', () => {
    const wrapper = shallow(<ExpenseReports {...props} />)
    expect(wrapper.find("ExpenseReportForm").length).toEqual(1)
    expect(wrapper.find("ExpenseReportTable").length).toEqual(1)
  })
  it('fetches reports', async () => {
    jest.spyOn(expensesService, 'getExpenseReports').mockResolvedValue({
      data: reports
    });
    const wrapper = mount(<ExpenseReports {...props} />)
  })
})