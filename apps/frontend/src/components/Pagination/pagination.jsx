import React, { useMemo } from "react";
import {
  Pagination as UIPagination,
  PaginationItem,
  PaginationLink,
} from "@ims-systems-00/ims-ui-kit";

const DOTS = "...";

// Utility function to generate a range of numbers
const range = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

// Custom hook to calculate pagination range
const usePageRange = ({
  totalResults,
  size,
  siblingCount = 1,
  currentPage,
}) => {
  return useMemo(() => {
    const totalPageCount = Math.ceil(totalResults / size);
    const totalPageNumbers = siblingCount + 5;

    // If the total number of pages is less than the page numbers we want to show, return all pages
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalResults, size, siblingCount, currentPage]);
};

// Pagination component definition
export const Pagination = ({
  totalResults = 0,
  siblingCount = 1,
  currentPage = 1,
  size = 5,
  containerClassName = "",
  onPageChange,
}) => {
  const pageRange = usePageRange({
    currentPage,
    totalResults,
    siblingCount,
    size,
  });

  if (!pageRange || pageRange.length < 2) {
    return null;
  }

  const lastPage = pageRange[pageRange.length - 1];

  const handleNext = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <UIPagination className={containerClassName}>
      <PaginationItem
        onClick={handlePrevious}
        className="mx-1"
        disabled={currentPage === 1}
      >
        <PaginationLink>«</PaginationLink>
      </PaginationItem>
      {pageRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <PaginationItem key={`${DOTS}-${index}`} className="mx-1">
              <PaginationLink>&#8230;</PaginationLink>
            </PaginationItem>
          );
        }
        return (
          <PaginationItem
            key={pageNumber}
            active={currentPage === pageNumber}
            className="mx-1"
            onClick={() => onPageChange(pageNumber)}
          >
            <PaginationLink>{pageNumber}</PaginationLink>
          </PaginationItem>
        );
      })}
      <PaginationItem
        onClick={handleNext}
        className="mx-1"
        disabled={currentPage === lastPage}
      >
        <PaginationLink>»</PaginationLink>
      </PaginationItem>
    </UIPagination>
  );
};
