import React from "react";
import BreadCrumb from "../BreadCrumb";
export default {
  title: "components/Breadcrumb",
  component: BreadCrumb,
};
const Template = (args) => <BreadCrumb {...args} />;
export const Default = Template.bind({});
Default.args = {
  listTag: "div",
  listClassName: "breadcrumb",
  listStyle: {},
  crumbs: [
    {
      href: "#",
      tag: "a",
      children: "Home",
      active: false,
    },
    {
      href: "#",
      tag: "a",
      children: "Library",
      active: false,
    },
    {
      href: "#",
      tag: "a",
      children: "Data",
      active: false,
    },
    {
      href: "#",
      tag: "a",
      children: "Bootstrap",
      active: true,
    },
  ],
  onSelect: () => {},
};
