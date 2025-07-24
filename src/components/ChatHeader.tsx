import { useAuth } from '../context/AuthContext';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

export default function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  const { user, logout } = useAuth();
  return (
    <header className="bg-gradient-to-r from-blue-950 via-purple-950 to-indigo-950 backdrop-blur-md border-b border-blue-500/20 px-4 py-4 sticky top-0 z-10 shadow-lg shadow-blue-500/10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-sm">
                {title}
              </h1>
              <p className="text-sm text-blue-100/90">
                {subtitle}
              </p>
            </div>
          </div>
          {user && (
            <button
              onClick={logout}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-700 hover:bg-purple-700 text-white font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
        
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      </div>
    </header>
  );
}
