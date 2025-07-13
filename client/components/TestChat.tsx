import { MessageCircle } from "lucide-react";

export function TestChat() {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg"
      onClick={() => alert("Chat clicked!")}
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </div>
  );
}
