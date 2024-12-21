import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isSignedIn }) => {
  
  return isSignedIn ? children : <Navigate to='/' />;
};

export default ProtectedRoute;