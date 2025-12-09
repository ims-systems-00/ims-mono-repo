import React from "react";
import { ChildDemoDefault } from "@/components/Demo/Child/docs/Child.stories";
import IMSSelectDropdown from "../IMSSelectDropdown";
export default {
  title: "components/SelectDropdown",
  component: IMSSelectDropdown,
};
const Template = (args) => <IMSSelectDropdown {...args} />;
export const Default = Template.bind({});
Default.args = {
  children: <ChildDemoDefault {...ChildDemoDefault.args} />,
  buttonText: "Add New",
  listItems: ["Option 1", "Option 2", "Option 3"],
};
