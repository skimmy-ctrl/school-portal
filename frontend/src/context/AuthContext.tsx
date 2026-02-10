import { createContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import {
  clearAuthStorage,
  fetchMe,
  getStoredAccessToken,
  getStoredUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
  register as registerRequest,
  setStoredUser,
  updateProfile as updateProfileRequest,
} from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_TOKEN'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'RESTORE_TOKEN':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, check if user is already logged in (from localStorage)
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = getStoredAccessToken();
        const cachedUser = getStoredUser();

        if (!token) {
          dispatch({ type: 'LOGIN_ERROR' });
          return;
        }

        if (cachedUser) {
          dispatch({ type: 'RESTORE_TOKEN', payload: cachedUser });
        }

        try {
          const user = await fetchMe();
          dispatch({ type: 'RESTORE_TOKEN', payload: user });
        } catch (error) {
          try {
            const refreshedUser = await refreshAccessToken();
            dispatch({ type: 'RESTORE_TOKEN', payload: refreshedUser });
          } catch (refreshError) {
            clearAuthStorage();
            dispatch({ type: 'LOGIN_ERROR' });
          }
        }
      } catch (e) {
        dispatch({ type: 'LOGIN_ERROR' });
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await loginRequest(email, password);
      setStoredUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return user;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, role: User['role']) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await registerRequest(email, password, role);
      setStoredUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return user;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: { displayName?: string; fullName?: string; title?: string; phone?: string; address?: string; avatarFile?: File | null }) => {
    const user = await updateProfileRequest(data);
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearAuthStorage();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
