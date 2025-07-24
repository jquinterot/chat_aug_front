import Avatar from "./Avatar";

export default function LoadingIndicator() {
  return (
    <div className="flex gap-4 justify-start animate-in slide-in-from-bottom-2 fade-in duration-1000">
      <div className="animate-in zoom-in-50 duration-700 delay-300">
        <Avatar type="assistant" />
      </div>
      <div className="max-w-3xl rounded-2xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm animate-in slide-in-from-left-4 fade-in duration-800 delay-400">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: "2s" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s", animationDuration: "2s" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.6s", animationDuration: "2s" }}></div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 animate-pulse" style={{ animationDuration: "3s" }}>AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}
