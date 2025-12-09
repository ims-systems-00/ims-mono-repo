import { Input } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import useSearch from "./hooks/useSearch";

const data = [
  { id: 1, title: "React Hooks Tutorial" },
  { id: 2, title: "React Context API" },
  { id: 3, title: "Redux Tutorial" },
];

const Search = () => {
  const [search, results] = useSearch(data);

  return (
    <React.Fragment>
      <Input
        type="text"
        onChange={(e) => search(e.target.value)}
        // className="border bg-transparent border-light d-lg-block nav-search"
        //later the below class will be removed and above class will be uncommented
        className="border bg-transparent border-light d-lg-block d-none nav-search invisible"
        placeholder="Search..."
      />
      {/* <ul>
        {results.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul> */}
    </React.Fragment>
  );
};

export default Search;
