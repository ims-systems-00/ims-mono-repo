export function DetailsSectionHeader({ title, className, ...props }) {
  let defaultClasses = ``;
  let deriveClasses = ` ${className || "font-weight-bold"}`;
  return (
    <>
      <p ref={props.ref} className={defaultClasses + deriveClasses}>
        {title}
      </p>
    </>
  );
}
