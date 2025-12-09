import React from "react";
import Child from "../Child";
export default {
  title: "components/Child",
  component: Child,
};
const Template = (args) => <Child {...args} />;
export const ChildDemoDefault = Template.bind({});
ChildDemoDefault.args = {
  title: "Child title",
  description: "Big descirption here ",
};
