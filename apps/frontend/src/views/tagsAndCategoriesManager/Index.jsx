import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import { TagsAndCategoriesContextProvider } from "./store";
import TagsAndCategoriesTable from "./TagsAndCategoriesTable";
const TagsAndCategories = (props) => {
  return (
    <DrawerContextProvider>
      <TagsAndCategoriesContextProvider applicableModules={null} {...props}>
        <TagsAndCategoriesTable {...props} />
      </TagsAndCategoriesContextProvider>
    </DrawerContextProvider>
  );
};

export default TagsAndCategories;
