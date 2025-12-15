import { TagsAndCategoriesContextProvider } from "./store";
import TagsAndCategoriesTable from "./TagsAndCategoriesTable";
const TagsAndCategories = (props) => {
  return (
    <TagsAndCategoriesContextProvider applicableModules={null} {...props}>
      <TagsAndCategoriesTable {...props} />
    </TagsAndCategoriesContextProvider>
  );
};

export default TagsAndCategories;
