// This component is used when another component needs protection from routing, getting the token received then handle redirects

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ childComponent, isSignedIn }) => {
  const token = localStorage.getItem("token");

  // Redirect back to the login page if token is not found
  if (!token) {
    return <Navigate to='/' />;
  };

  return childComponent;
}

export default ProtectedRoute;