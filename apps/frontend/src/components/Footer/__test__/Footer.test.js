import React from "react";
import Enzyme, { shallow } from "enzyme";
import Footer from "../Footer";

test("render without error", () => {
  const wrapper = shallow(<Footer />);
  const footerComponent = wrapper.find("[data-test='component-footer']");
  expect(footerComponent.length).toBe(1);
});
