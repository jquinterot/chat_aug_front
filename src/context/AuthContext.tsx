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
    const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const responseData = await response.json();
    
    // Ensure the token is included in the user object
    const loggedInUser: User = {
      id: responseData.user?.id || responseData.id,
      username: responseData.user?.username || responseData.username,
      email: responseData.user?.email || responseData.email,
      token: responseData.token || responseData.access_token
    };
    
    if (!loggedInUser.token) {
      throw new Error('No token received from server');
    }
    
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Optionally, redirect to login page
    window.location.href = '/login';
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
