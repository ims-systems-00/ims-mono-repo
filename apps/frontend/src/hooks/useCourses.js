import { useBusinessPremisesCourse } from "./tours/useBusinessPremisesCourse";
import { useBusinessUnitCourse } from "./tours/useBusinessUnitCourse";
import { useCreateRepositoriesCourse } from "./tours/useCreateRepositoriesCourse";
import { useUserManagementCourse } from "./tours/useUserManagementCourse";
const useCourses = () => {
  return {
    businessUnitCourse: useBusinessUnitCourse(),
    businessPremisesCourse: useBusinessPremisesCourse(),
    userManagementCourse: useUserManagementCourse(),
    createRepositoriesCourse: useCreateRepositoriesCourse(),
  };
};

export default useCourses;
