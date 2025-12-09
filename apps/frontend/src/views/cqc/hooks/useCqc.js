const useCQC = () => {
  function getRatingClasses(rating) {
    switch (rating) {
      case "Not rated":
        return "";
      case "Inadequate":
        return "text-danger";
      case "Requires improvement":
        return "text-warning";
      case "Good":
        return "text-success";
      case "Outstanding":
        return "text-gold";
      default:
        return "";
    }
  }
  function getComplianceColors(compliancePercentage, type) {
    switch (true) {
      case compliancePercentage < 20:
        return type === "text-component" ? "text-danger text-right" : "red";
      case compliancePercentage < 40:
        return type === "text-component"
          ? "text-primary text-right"
          : "primary";
      case compliancePercentage < 60:
        return type === "text-component"
          ? "text-warning text-right"
          : "warning";
      case compliancePercentage < 80:
        return type === "text-component" ? "text-info text-right" : "info";
      case compliancePercentage <= 100:
        return type === "text-component"
          ? "text-success text-right"
          : "success";
      default:
        return " text-right";
    }
  }
  return {
    getRatingClasses,
    getComplianceColors,
  };
};
export default useCQC;
