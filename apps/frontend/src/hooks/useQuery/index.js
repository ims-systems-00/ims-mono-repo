import { useState } from "react";

function useQuery(initial) {
  let [query, setQuery] = useState({
    required: _buildDefault(initial).required,
    filter: _buildDefault(initial).filter,
    search: _buildDefault(initial).search,
    pagination: _buildDefault(initial).pagination,
  });
  let [toolState, setToolState] = useState({
    filter: (initial && initial.filter) || {},
    required: (initial && initial.required) || {},
    search: "",
    pagination: {
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
      size: 10,
      totalPages: 0,
      totalResults: 0,
    },
  });

  function _buildDefault(initial) {
    return {
      required:
        initial && initial.required
          ? objectToQuery(initial.required.value)
          : "",
      filter:
        initial && initial.filter ? objectToQuery(initial.filter.value) : "",
      search:
        initial && initial.search ? objectToQuery(initial.search.value) : "",
      pagination:
        initial && initial.pagination
          ? objectToQuery(initial.pagination.value)
          : "page=1",
    };
  }

  function isObject(object) {
    return object !== null && typeof object === "object";
  }
  function objectToQuery(object) {
    if (!object) return "";
    const queryBucket = [];
    function dig(obj, build = "") {
      if (!isObject(obj))
        return queryBucket.push(build + `=${encodeURIComponent(obj)}`);
      const keys = Object.keys(obj);
      for (let key of keys) {
        if (isObject(obj)) {
          let attach = !build
            ? `${key}`
            : !Array.isArray(obj)
            ? `[${key}]`
            : `[]`;
          dig(obj[key], build + attach);
        }
      }
      return obj;
    }
    dig(object);
    return queryBucket.join("&");
  }
  let formatString = (str) => (str ? "&" + str : str);
  function getQuery() {
    let processedString = "";
    let keys = Object.keys(query);
    for (let key of keys) {
      processedString = processedString
        ? processedString + formatString(query[key])
        : query[key];
    }
    return processedString;
  }
  function handleRequired(requiredQuery) {
    setQuery((prevState) => {
      /**
       * I'm using JSON to avoid object mutation, this is used only for performence.
       * Date, function, Infinity , Maps , Blobs are not cloned. So be mindfull of using,
       * basic and simple objects in state.
       */
      return {
        ...JSON.parse(JSON.stringify(prevState)),
        required: objectToQuery(requiredQuery.value),
        pagination: "page=1",
      };
    });
    updateRequired(requiredQuery);
  }
  function handleFilter(filterQuery) {
    setQuery((prevState) => {
      /**
       * I'm using JSON to avoid object mutation, this is used only for performence.
       * Date, function, Infinity , Maps , Blobs are not cloned. So be mindfull of using,
       * basic and simple objects in state.
       */
      return {
        ...JSON.parse(JSON.stringify(prevState)),
        filter: objectToQuery(filterQuery.value),
        pagination: "page=1",
      };
    });
    updateFilter(filterQuery);
  }
  function handlePagination(paginationQuery) {
    setQuery((prevState) => {
      /**
       * I'm using JSON to avoid object mutation, this is used only for performence.
       * Date, function, Infinity , Maps , Blobs are not cloned. So be mindfull of using,
       * basic and simple objects in state.
       */
      return {
        ...JSON.parse(JSON.stringify(prevState)),
        pagination: objectToQuery(paginationQuery),
      };
    });
  }
  function handleSearch(searchQuery) {
    setQuery((prevState) => {
      /**
       * I'm using JSON to avoid object mutation, this is used only for performence.
       * Date, function, Infinity , Maps , Blobs are not cloned. So be mindfull of using,
       * basic and simple objects in state.
       */
      return {
        ...JSON.parse(JSON.stringify(prevState)),
        search: objectToQuery(searchQuery.value),
        pagination: "page=1",
      };
    });
  }
  function updatePagination(pagination) {
    setToolState((prevState) => {
      /**
       * I'm using JSON to avoid object mutation, this is used only for performence.
       * Date, function, Infinity , Maps , Blobs are not cloned. So be mindfull of using,
       * basic and simple objects in state.
       */
      return {
        ...JSON.parse(JSON.stringify(prevState)),
        pagination,
      };
    });
  }
  function updateFilter(filter) {
    setToolState((prevState) => {
      /**
       * I'm using JSON to avoid object mutation, this is used only for performence.
       * Date, function, Infinity , Maps , Blobs are not cloned. So be mindfull of using,
       * basic and simple objects in state.
       */
      return {
        ...JSON.parse(JSON.stringify(prevState)),
        filter,
      };
    });
  }
  function updateRequired(required) {
    setToolState((prevState) => {
      /**
       * I'm using JSON to avoid object mutation, this is used only for performence.
       * Date, function, Infinity , Maps , Blobs are not cloned. So be mindfull of using,
       * basic and simple objects in state.
       */
      return {
        ...JSON.parse(JSON.stringify(prevState)),
        required,
      };
    });
  }
  function updateSearch() {}
  return {
    query,
    toolState,
    getQuery,
    handleFilter,
    handlePagination,
    handleSearch,
    handleRequired,
    updatePagination,
    updateFilter,
    updateSearch,
  };
}

export default useQuery;
