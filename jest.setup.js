// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
