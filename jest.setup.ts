// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock localStorage
class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};
  public length = 0;
  
  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
  
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  
  setItem(key: string, value: string): void {
    if (!this.store[key]) {
      this.length++;
    }
    this.store[key] = value.toString();
  }
  
  removeItem(key: string): void {
    if (this.store[key]) {
      this.length--;
    }
    delete this.store[key];
  }
  
  clear(): void {
    this.store = {};
    this.length = 0;
  }
}

// Set up localStorage mock
global.localStorage = new LocalStorageMock();

// Set a default auth token for tests
localStorage.setItem('authToken', 'test-token');

// Mock Next.js router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',};

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
