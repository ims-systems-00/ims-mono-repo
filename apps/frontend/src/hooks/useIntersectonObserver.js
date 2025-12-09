import { useEffect } from "react";
const useIntersectionObserver = (element, options) => {
  useEffect(() => {
    let config = options?.observerConfig || { threshold: 0 };
    let callback = options?.observerCallback || function () {};
    if (!element || "IntersectionObserer" in window) return;
    const observer = new IntersectionObserver(callback, config);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, options?.observerConfig, options?.observerCallback]);
};
export default useIntersectionObserver;
