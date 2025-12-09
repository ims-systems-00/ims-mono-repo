import React from "react";
import { useTagsAndCategories } from "./store";
import { useDrawer } from "@ims-systems-00/ims-ui-kit";
import TagsAndCategoryForm from "./TagsAndCategoryForm";

const TagsDrawerForm = () => {
  const { visitingTagAndCategory, updateTagsAndCategories } =
    useTagsAndCategories();
  const { closeDrawer, openDrawer } = useDrawer();
  return (
    <div>
      <TagsAndCategoryForm
        visitingTagAndCategory={visitingTagAndCategory}
        onSubmit={async (data) => {
          await updateTagsAndCategories(data);
          closeDrawer("edit-tag-form");
        }}
      />
    </div>
  );
};

export default TagsDrawerForm;
