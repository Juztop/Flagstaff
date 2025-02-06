export function Card({ children, className }) {
    return (
      <div className={`border border-gray-300 p-4 rounded-md shadow-md ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className }) {
    return <div className={`p-2 ${className}`}>{children}</div>;
  }
  