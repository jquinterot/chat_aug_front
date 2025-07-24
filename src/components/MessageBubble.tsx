import { Message } from "@/types";
import Avatar from "./Avatar";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div 
      className={`flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-1000 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="animate-in zoom-in-50 duration-700 delay-300">
          <Avatar type="assistant" />
        </div>
      )}
      
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-500 animate-in slide-in-from-${isUser ? 'right' : 'left'}-4 fade-in duration-800 delay-400 ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-12 hover:from-blue-600 hover:to-blue-700"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-2 opacity-75 ${
            isUser
              ? "text-blue-100"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
      
      {isUser && (
        <div className="animate-in zoom-in-50 duration-700 delay-300">
          <Avatar type="user" />
        </div>
      )}
    </div>
  );
}
