import { useContext } from 'react';
import { AuthContext } from './authContext';

// check if you are on the client (browser) or server
const isBrowser = () => typeof window !== 'undefined';

const ProtectedRoute = ({ router, children }) => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = user !== null;

  const unprotectedRoutes = [
    '/login',
    '/register',
    '/forgot',
    '/activate/[id]/[token]',
    '/confirm_password/[email]/[token]',
  ];

  const pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;

  if (isBrowser() && !isAuthenticated && pathIsProtected) {
    router.push('/login');
  }
  if (isBrowser() && isAuthenticated && !pathIsProtected) {
    router.push('/');
  }

  return children;
};

export default ProtectedRoute;
