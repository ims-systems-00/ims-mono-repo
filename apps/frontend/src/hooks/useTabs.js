import { useState } from "react";
const useTabs = (initialValue) => {
  const [horizontalTabs, sethorizontalTabs] = useState(initialValue);
  // with this function we change the active tab for all the tabs in a page
  const changeActiveTab = (e, tabName) => {
    e.preventDefault();
    sethorizontalTabs(tabName);
  };
  return [horizontalTabs, changeActiveTab];
};
export default useTabs;
