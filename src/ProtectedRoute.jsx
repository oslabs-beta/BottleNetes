import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isSignedIn }) => {
  return isSignedIn ? children : <Navigate to='/' />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.element,
  isSignedIn: PropTypes.bool,
};

export default ProtectedRoute;