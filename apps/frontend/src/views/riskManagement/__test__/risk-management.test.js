import React from "react";
import { mount, shallow } from "enzyme";
import ExpenseReports from "@/views/staffWallet/expenseReport/ExpenseReports";
import * as riskManagementServices from "@/services/riskManagementServices";
import { risks } from "../__mocks___/response.data";
import RiskManagement from "../RiskManagement";
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
describe("expense reports tabular view:", () => {
  const props = {
    match: {
      url: CLIENT_URL,
    },
  };
  it("renders without crashing", () => {});
});
