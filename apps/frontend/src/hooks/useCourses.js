import { useBusinessPremisesCourse } from "./tours/useBusinessPremisesCourse";
import { useBusinessUnitCourse } from "./tours/useBusinessUnitCourse";
import { useCreateRepositoriesCourse } from "./tours/useCreateRepositoriesCourse";
import { useUserManagementCourse } from "./tours/useUserManagementCourse";
import { useExternalCourse } from "./tours/useExernalCourse";
import { useInternalCourse } from "./tours/useInternalCourse";
import { useIncidentsCourse } from "./tours/useIncidentsCourse";
import { useHardwareCourse } from "./tours/useHardwareCourse";
import { useSoftwareCourse } from "./tours/useSoftwareCourse";
import { usePeopleCourse } from "./tours/usePeopleCourse";
import { useRisksCourse } from "./tours/useRisksCourse";
import { usePremisesCourse } from "./tours/usePremisesCourse";
import { useInformationCourse } from "./tours/useInformationCourse";

const useCourses = () => {
  return {
    businessUnitCourse: useBusinessUnitCourse(),
    businessPremisesCourse: useBusinessPremisesCourse(),
    userManagementCourse: useUserManagementCourse(),
    createRepositoriesCourse: useCreateRepositoriesCourse(),
    externalCourse: useExternalCourse(),
    internalCourse: useInternalCourse(),
    incidentsCourse: useIncidentsCourse(),
    hardwareCourse: useHardwareCourse(),
    softwareCourse: useSoftwareCourse(),
    peopleCourse: usePeopleCourse(),
    risksCourse: useRisksCourse(),
    premisesCourse: usePremisesCourse(),
    informationCourse: useInformationCourse(),
  };
};

export default useCourses;
