/**
 * Represents the public data of a user.
 */
export interface User {
  id: number | string;
  username: string;
  email: string;
}

/**
 * Represents the data required for user registration.
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

/**
 * Represents the data required for user login.
 */
export interface LoginData {
  login: string;
  password: string;
}

/**
 * Represents the structure of the authentication context.
 */
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
