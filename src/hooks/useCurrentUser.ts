import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  modifiedAt: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching current user...');
      const storedUserData = localStorage.getItem('user');
      console.log('Stored user data:', storedUserData);
      
      if (!storedUserData) {
        console.error('No user data in localStorage');
        throw new Error('No user data found');
      }

      const { token } = JSON.parse(storedUserData);
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        const response = await fetch('https://chataugbackcontinerized-b0bbemakhucrhzdh.canadacentral-01.azurewebsites.net/api/v1/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setUser(responseData);
          return;
        } else if (response.status === 401) {
          // Handle expired/invalid token
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        // If we get here, the /me endpoint might not exist (404) or there was another error
        console.warn('Failed to fetch user profile, falling back to token data');
      } catch (err) {
        console.warn('Error fetching user profile:', err);
      }

      // Fallback: Extract user info from the JWT token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.sub,
          username: payload.username || payload.email?.split('@')[0] || 'user',
          email: payload.email || '',
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to parse token:', err);
        // If we can't parse the token, use a default user
        setUser({
          id: 'unknown',
          username: 'user',
          email: '',
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const refetch = () => {
    fetchCurrentUser();
  };

  return { user, loading, error, refetch };
}
