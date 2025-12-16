import { useFindCategories } from "./useFindCategories";
import { useFindReports } from "./useFindReports";

const useCourses = () => {
  return {
    findCategories: useFindCategories(),
    findReports: useFindReports(),
  };
};

export default useCourses;
