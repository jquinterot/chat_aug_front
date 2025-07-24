import { useRef } from "react";

interface ChatInputProps {
  value: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export default function ChatInput({
  value,
  onInputChange,
  onSubmit,
  onKeyDown,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-4 animate-in slide-in-from-bottom-4 duration-300">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 group">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder={value ? "" : "Type your message here..."}
            className="flex-1 resize-none rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
            rows={1}
            style={{
              minHeight: "52px",
              maxHeight: "200px",
              height: "auto",
            }}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className={`w-[52px] h-[52px] rounded-2xl text-white transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 flex items-center justify-center flex-shrink-0 ${
              !value.trim() || isLoading
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 hover:scale-105"
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="w-4 h-4 animate-spin">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : (
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
