import React from "react";
import Index from "../Index";
export default {
  title: "components/Repository/Button",
  component: Index,
};
const Template = (args) => <Index {...args} />;
export const Default = Template.bind({});
Default.args = {
  children: <span>Click Here</span>,
};
