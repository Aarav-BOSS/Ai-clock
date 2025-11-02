import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">This page does not exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
