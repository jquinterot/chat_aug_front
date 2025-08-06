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
      
      if (!storedUserData) {
        console.log('No user data found in localStorage');
        setUser(null);
        return;
      }

      let userData;
      try {
        userData = JSON.parse(storedUserData);
      } catch (e) {
        console.error('Failed to parse user data from localStorage:', e);
        localStorage.removeItem('user');
        setUser(null);
        return;
      }

      const { token } = userData;
      if (!token) {
        console.error('No token found in user data');
        localStorage.removeItem('user');
        setUser(null);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL || 'https://chataugbackcontinerized-b0bbemakhucrhzdh.canadacentral-01.azurewebsites.net'}/api/v1/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'omit' // Don't include credentials for CORS
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Token expired or invalid, redirecting to login');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('User data from /me endpoint:', responseData);
        setUser(responseData);
        return;
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Don't throw here, we'll try to use the token data as fallback
      }

      // Fallback: Extract user info from the stored user data or JWT token
      try {
        // First try to use the user data from localStorage
        if (userData?.id && userData?.username) {
          console.log('Using stored user data as fallback');
          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email || '',
            createdAt: userData.createdAt || new Date().toISOString(),
            modifiedAt: userData.modifiedAt || new Date().toISOString()
          });
        } else {
          // If no user data, try to parse from JWT token
          console.log('Parsing user data from JWT token');
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.sub || 'unknown',
            username: payload.username || payload.email?.split('@')[0] || 'user',
            email: payload.email || '',
            createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
            modifiedAt: new Date().toISOString()
          });
        }
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
