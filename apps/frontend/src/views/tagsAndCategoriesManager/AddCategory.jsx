import {
  Button,
  PopoverBody,
  UncontrolledPopover,
} from "@ims-systems-00/ims-ui-kit";
import React, { useState, useRef, useEffect } from "react";
import { useTagsAndCategories } from "./store";
import TagsAndCategoryForm from "./TagsAndCategoryForm";
const AddCategory = () => {
  const { createTagsAndCategories } = useTagsAndCategories();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popupid, setpopupid] = useState(null);
  const popoverRef = useRef();

  const openPopover = () => {
    setPopoverOpen(true);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const handleFormSubmit = async (data) => {
    await createTagsAndCategories(data);
    closePopover();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        closePopover();
      }
    }

    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  useEffect(() => {
    setpopupid("add-category" + Date.now());
  }, []);

  return (
    <React.Fragment>
      {popupid && (
        <span id={popupid}>
          <Button color="link" className="btn-link-dark" onClick={openPopover}>
            <i className="ims-icons icon-icon-plus-24 font-weight-bold" />
          </Button>
          <UncontrolledPopover
            innerRef={popoverRef}
            placement="right"
            trigger="manual"
            isOpen={popoverOpen}
            target={popupid}
          >
            <PopoverBody className="shadow rounded p-3">
              <p className="text-secondary">
                Missing out category? Create a new one
              </p>
              <TagsAndCategoryForm onSubmit={handleFormSubmit} />
            </PopoverBody>
          </UncontrolledPopover>
        </span>
      )}
    </React.Fragment>
  );
};

export default AddCategory;
