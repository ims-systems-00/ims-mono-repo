export function TitleHeader({ title, className, ...props }) {
  let defaultClasses = `text-info font-weight-bold`;
  let deriveClasses = ` ${className || ""}`;
  return (
    <>
      <h4 ref={props.ref} className={defaultClasses + deriveClasses}>
        {title}
      </h4>
    </>
  );
}
