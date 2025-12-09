import moment from "moment";
import msToTime from "@/utils/timeConverter";

export function mapToMemberModel(data) {
  return {
    data: {
      workPlace: {
        value: data.workLocationType,
        label: data.workLocationType,
      },
      salary: data.salary,
      jobTitle: data.jobTitle,
      lineManagers: data?.lineManagers
        ?.filter((lineManager) => lineManager)
        .map((lineManager) => ({
          value: lineManager._id,
          label: lineManager.name,
        })),
      leaveDaysEntitledTo: data.leaveDaysEntitledTo,
      country: data.country
        ? {
            value: data.country.code,
            label: data.country.name,
          }
        : {
            value: "",
            label: "Select your country",
          },
      sunday:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[0]?.startTime !== -1
          ? true
          : false,
      monday:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[1]?.startTime !== -1
          ? true
          : false,
      tuesday:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[2]?.startTime !== -1
          ? true
          : false,
      wednesday:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[3]?.startTime !== -1
          ? true
          : false,
      thursday:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[4]?.startTime !== -1
          ? true
          : false,
      friday:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[5]?.startTime !== -1
          ? true
          : false,
      saturday:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[6]?.startTime !== -1
          ? true
          : false,
      sundayStart:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[0]?.startTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[0]?.startTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[0]?.startTime).minutes
            }`
          : `00:00`,
      sundayEnd:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[0]?.endTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[0]?.endTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[0]?.endTime).minutes
            }`
          : `00:00`,
      mondayStart:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[1]?.startTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[1]?.startTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[1]?.startTime).minutes
            }`
          : `00:00`,
      mondayEnd:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[1]?.endTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[1]?.endTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[1]?.endTime).minutes
            }`
          : `00:00`,
      tuesdayStart:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[2]?.startTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[2]?.startTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[2]?.startTime).minutes
            }`
          : `00:00`,
      tuesdayEnd:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[2]?.endTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[2]?.endTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[2]?.endTime).minutes
            }`
          : `00:00`,
      wednesdayStart:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[3]?.startTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[3]?.startTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[3]?.startTime).minutes
            }`
          : `00:00`,
      wednesdayEnd:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[3]?.endTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[3]?.endTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[3]?.endTime).minutes
            }`
          : `00:00`,
      thursdayStart:
        data?.workShift?.weeklyHours.length &&
        data.workShift?.weeklyHours[4]?.startTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[4]?.startTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[4]?.startTime).minutes
            }`
          : `00:00`,
      thursdayEnd:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[4]?.endTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[4]?.endTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[4]?.endTime).minutes
            }`
          : `00:00`,
      fridayStart:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[5]?.startTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[5]?.startTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[5]?.startTime).minutes
            }`
          : `00:00`,
      fridayEnd:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[5]?.endTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[5]?.endTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[5]?.endTime).minutes
            }`
          : `00:00`,
      saturdayStart:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[6]?.startTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[6]?.startTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[6]?.startTime).minutes
            }`
          : `00:00`,
      saturdayEnd:
        data?.workShift?.weeklyHours.length &&
        data?.workShift?.weeklyHours[6]?.endTime !== -1
          ? `${msToTime(data?.workShift?.weeklyHours[6]?.endTime).hours}:${
              msToTime(data?.workShift?.weeklyHours[6]?.endTime).minutes
            }`
          : `00:00`,
    },
    errors: {},
  };
}
