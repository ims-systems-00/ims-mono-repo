import React from "react";
import { ChildDemoDefault } from "@/components/Demo/Child/docs/Child.stories";
import Index from "../Index";
export default {
  title: "components/Repository/Tabs",
  component: Index,
};
const Template = (args) => <Index {...args} />;
export const Default = Template.bind({});
Default.args = {
  primaryTab: (
    <>
      <h1>Primary Tab</h1>
      <ChildDemoDefault {...ChildDemoDefault.args} />
    </>
  ),
  secondaryTab: <h1>Secondary Tab</h1>,
};
