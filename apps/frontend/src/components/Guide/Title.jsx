const Title = ({ children, className = "" }) => {
  return (
    <div 
      className={`text-primary fw-semibold text-center mb-2 ${className}`}
    >
      {children}
    </div>
  );
};

Title.displayName = 'Title';

export default Title;

