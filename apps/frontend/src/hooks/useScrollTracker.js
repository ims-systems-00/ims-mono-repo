import { useEffect, useRef, useState } from "react";
import { imsLogger } from "@/services/loggerService";
const useScrollTracker = (ref = null, { onBottomReached = () => {} }) => {
  let element = useRef(ref);
  function handleScroll() {
    if (element.current) {
      const { scrollTop, scrollHeight, clientHeight } = element.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        imsLogger("Bottom reached");
        onBottomReached(element);
      }
    }
  }
  return [element, handleScroll];
};
export default useScrollTracker;
