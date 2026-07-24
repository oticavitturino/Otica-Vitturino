import { Navigate } from 'react-router-dom'
import { hasToken } from '../../services/api'

function ProtectedRoute({ children }) {
  if (!hasToken()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute
