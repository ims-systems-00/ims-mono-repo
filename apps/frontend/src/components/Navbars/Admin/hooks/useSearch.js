import { useState, useEffect } from "react";

const useSearch = (data) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredData);
  }, [data, searchTerm]);

  const search = (term) => {
    setSearchTerm(term);
  };

  return [search, searchResults];
};

export default useSearch;
