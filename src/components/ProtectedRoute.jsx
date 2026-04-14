import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "./context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useContext(authContext);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!user) {
    return <Navigate to="/Auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;