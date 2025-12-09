const DetailsSectionContent = ({
  label,
  value,
  labelClass,
  valueClass,
  iconClass,
}) => {
  let labelFont = `font-weight-bold font-size-14`;
  return (
    <>
      <div className="">
        <i className={iconClass || ""} />
        <span className={`${labelClass} + ${labelFont}` || labelFont}>
          {" "}
          {label}{" "}
        </span>
        <span className={valueClass || "text-secondary"}>{value}</span>
      </div>
    </>
  );
};

export default DetailsSectionContent;
