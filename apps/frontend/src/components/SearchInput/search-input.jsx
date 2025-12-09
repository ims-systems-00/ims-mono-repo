import React from "react";
import { Input, InputGroup, InputGroupText } from "@ims-systems-00/ims-ui-kit";
import useDebounce from "@/hooks/useDebounce";
import { RiSearch2Line } from "react-icons/ri";
import { useCallback } from "react";
import { useEffect } from "react";

const SearchInput = ({ queryHandlers }) => {
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  const handleSearch = useCallback(
    (searchValue) => {
      if (searchValue) {
        queryHandlers?.handleFilter({
          value: {
            ...queryHandlers?.toolState?.filter?.value,
            clientSearch: searchValue,
          },
        });
      } else {
        delete queryHandlers?.toolState?.filter?.value?.clientSearch;
        queryHandlers?.handleFilter({
          value: {
            ...queryHandlers?.toolState?.filter?.value,
          },
        });
      }
    },
    [queryHandlers]
  );

  useEffect(() => {
    handleSearch(debouncedSearchString);
  }, [debouncedSearchString]);
  return (
    <React.Fragment>
      <InputGroup className="m-0">
        <InputGroupText>
          <RiSearch2Line />
        </InputGroupText>
        <Input
          onChange={(e) => setSearchString(e.currentTarget.value.toString())}
          placeholder="Search"
          type="text"
        ></Input>
      </InputGroup>
    </React.Fragment>
  );
};

export default SearchInput;
