import React from "react";
import useStore from "./useStore";
export const TagsAndCategoriesContext = React.createContext();
const TagsAndCategoriesContextProvider = ({ children, ...rest }) => {
  let { ...store } = useStore({
    ...rest,
  });
  return (
    <TagsAndCategoriesContext.Provider
      value={{
        ...store,
      }}
    >
      {children}
    </TagsAndCategoriesContext.Provider>
  );
};
export default TagsAndCategoriesContextProvider;
