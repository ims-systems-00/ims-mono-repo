import React from "react";

const useSwitchableView = ({ canSwitch = true, viewTitle = "" }) => {
  let [editMode, setEditMode] = React.useState(false);

  const switchView = () => {
    setEditMode(!editMode);
  };

  return {
    editMode,
    switchView,
    canSwitch,
    viewTitle,
    setEditMode,
  };
};

export default useSwitchableView;
