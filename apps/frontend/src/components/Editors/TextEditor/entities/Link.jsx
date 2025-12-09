export default function Link(props) {
  if (!!props.href) {
    return (
      <a
        href={props.href}
        title={props.linkText}
        target="_blank"
        rel="noreferrer"
      >
        {props.linkText || props.href}
      </a>
    );
  }
  return null;
}
