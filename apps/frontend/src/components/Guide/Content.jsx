const Content = ({ children, className = "" }) => {
  return (
    <div 
      className={`fs-6 lh-base w-100 px-4 py-2 ${className}`}
    >
      {children}
    </div>
  );
};

Content.displayName = 'Content';

export default Content;

