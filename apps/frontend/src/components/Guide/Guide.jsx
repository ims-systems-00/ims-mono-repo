
const Guide = ({ children, className = "" }) => {

  return <div className={`h-100 d-flex flex-column ${className}`}>{children}</div>;
};

Guide.displayName = 'Guide';

export default Guide;

