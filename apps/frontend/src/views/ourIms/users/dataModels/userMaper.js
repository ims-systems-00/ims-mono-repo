import moment from "moment";
import msToTime from "@/utils/timeConverter";

export function mapToUserModel(data) {
  return {
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
    errors: {},
  };
}
