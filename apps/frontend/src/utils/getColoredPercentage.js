export function getColoredPercentage(compliancePercentage) {
  switch (true) {
    case compliancePercentage < 20:
      return "text-danger";
    case compliancePercentage < 40:
      return "text-primary";
    case compliancePercentage < 60:
      return "text-warning";
    case compliancePercentage < 80:
      return "text-info";
    case compliancePercentage <= 100:
      return "text-success";
    default:
      return " text-default";
  }
}
