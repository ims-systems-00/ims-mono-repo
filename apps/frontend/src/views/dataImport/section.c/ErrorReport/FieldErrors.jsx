import React, { useState } from "react";
import Pagination from "@/components/ReactTable/Pagination";
import { Button } from "@ims-systems-00/ims-ui-kit";
export default function FieldErrors({ errors = [], pageSize = 3 }) {
  let [currentPage, setCurrentPage] = useState(1);
  const onNext = () => {
    let last = errors?.length % pageSize ? 1 : 0;
    let maxPage = errors?.length ? errors?.length / pageSize + last : 1;
    if (currentPage + 1 > maxPage) return;
    setCurrentPage(currentPage + 1);
  };
  const onPrevious = () => {
    if (currentPage - 1 === 0) return;
    setCurrentPage(currentPage - 1);
  };
  return (
    <React.Fragment>
      {errors?.length ? (
        <React.Fragment>
          {" "}
          {errors
            ?.slice(
              (currentPage - 1) * pageSize,
              (currentPage - 1) * pageSize + pageSize
            )
            .map((error, index) => (
              <p
                className="text-danger font-size-subtitle-2"
                key={error.message + index}
              >
                <small>{error.message}</small>
              </p>
            ))}
          <div className="mt-2">
            <span>
              {currentPage * pageSize - pageSize + 1} -{" "}
              {!(currentPage === Math.ceil(errors?.length / pageSize))
                ? currentPage * pageSize
                : errors?.length}{" "}
              of {errors?.length}
            </span>
            <Button size="sm" className="ms-2" onClick={onPrevious}>
              <i className="ims-icons-20 icon-icon-arrowleft-24" />
            </Button>
            <Button size="sm" onClick={onNext}>
              <i className="ims-icons-20 icon-icon-arrowright-24" />
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <span className="text-success font-size-subtitle-2">
          <i className="ims-icons-20 icon-icon-checkcircle-24"></i> No
          validation error
        </span>
      )}
    </React.Fragment>
  );
}
