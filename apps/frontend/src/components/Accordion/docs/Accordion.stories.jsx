import React from "react";
import Accordion from "../Accordion";
import { ChildDemoDefault } from "@/components/Demo/Child/docs/Child.stories";
export default {
  title: "components/Accordion",
  component: Accordion,
};
const Template = (args) => <Accordion {...args} />;
export const Default = Template.bind({});
Default.args = {
  title: "Accordion title",
  children: <ChildDemoDefault {...ChildDemoDefault.args} />,
};
