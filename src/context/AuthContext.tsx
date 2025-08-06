'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginData, RegisterData, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use environment variable with fallback to production URL
const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL || 'https://chataugbackcontinerized-b0bbemakhucrhzdh.canadacentral-01.azurewebsites.net';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user?.token;

  useEffect(() => {
    // Check for a logged-in user in local storage on initial load
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Don't include credentials for CORS
        credentials: 'omit',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      
      if (!responseData) {
        throw new Error('No data received from server');
      }
      
      // Ensure the token is included in the user object
      const loggedInUser: User = {
        id: responseData.user?.id || responseData.id,
        username: responseData.user?.username || responseData.username,
        email: responseData.user?.email || responseData.email,
        token: responseData.token || responseData.access_token,
        // Add any additional user fields from the response
        ...(responseData.user || {})
      };
      
      if (!loggedInUser.token) {
        console.error('Login response missing token:', responseData);
        throw new Error('No authentication token received from server');
      }
      
      // Store the user data in state and localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      console.log('User logged in successfully:', {
        id: loggedInUser.id,
        username: loggedInUser.username,
        hasToken: !!loggedInUser.token
      });
      
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial/invalid data on error
      if (error instanceof Error && error.message.includes('token')) {
        localStorage.removeItem('user');
        setUser(null);
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const newUser: User = await response.json();
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      // Get the token before clearing the user
      const token = user?.token;
      
      // Clear user data immediately
      setUser(null);
      localStorage.removeItem('user');
      
      // Call the logout endpoint if we have a token
      if (token) {
        await fetch(`${API_BASE_URL}/api/v1/user/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'omit' // Don't include credentials for CORS
        }).catch(err => {
          console.error('Error during logout API call:', err);
          // Continue with redirect even if API call fails
        });
      }
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect to login even if there was an error
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
