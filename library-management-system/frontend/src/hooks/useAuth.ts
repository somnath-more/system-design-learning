import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectUserRole } from '../redux/slices/authSlice';
import { Role } from '../types';

export const useAuth = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const hasRole = (requiredRole: Role): boolean => {
    return role === requiredRole;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return role ? roles.includes(role) : false;
  };

  const isAdmin = () => role === Role.ADMIN;
  const isLibrarian = () => role === Role.LIBRARIAN;
  const isMember = () => role === Role.MEMBER;

  return {
    user,
    isAuthenticated,
    role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isLibrarian,
    isMember,
  };
};
