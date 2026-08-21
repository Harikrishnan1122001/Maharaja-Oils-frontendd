import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="empty-state">
    <h3>Page not found</h3>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary">Back Home</Link>
  </div>
);

export default NotFound;
