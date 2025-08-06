'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!loginValue.trim() || !password) {
      setError('Please enter both username/email and password');
      return;
    }
    
    try {
      const user = await login({ 
        login: loginValue.trim(), 
        password: password.trim() 
      });
      
      console.log('Login successful, user:', {
        id: user.id,
        username: user.username,
        hasToken: !!user.token
      });
      
      // Clear sensitive data
      setPassword('');
      
      // Redirect to home page or return URL
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      router.push(returnUrl || '/');
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Clear password field on error
      setPassword('');
      
      // Set user-friendly error message
      if (err instanceof Error) {
        // Handle specific error messages
        const message = err.message.toLowerCase();
        if (message.includes('network') || message.includes('fetch')) {
          setError('Unable to connect to the server. Please check your connection.');
        } else if (message.includes('credentials')) {
          setError('Invalid username/email or password. Please try again.');
        } else {
          setError(err.message || 'Login failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden flex items-center justify-center text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue to your chat.</p>
        </div>
        {error && <p className="text-center text-red-500 bg-red-900/20 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="login"
            label="Username or Email"
            type="text"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            placeholder="yourname or you@example.com"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{
            ' '
          }
          <Link href="/register" className="font-medium text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
