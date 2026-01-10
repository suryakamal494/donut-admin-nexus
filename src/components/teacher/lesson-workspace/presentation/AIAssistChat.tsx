/**
 * AI Assist Chat for Presentation Mode
 * Provides context-aware AI assistance during teaching
 */

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { LessonPlanBlock } from "../types";
import { themeClasses } from "./types";
import type { PresentationTheme } from "./types";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistChatProps {
  block: LessonPlanBlock;
  lessonTitle?: string;
  theme: PresentationTheme;
  onClose: () => void;
}

export const AIAssistChat = ({ block, lessonTitle, theme, onClose }: AIAssistChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const tc = themeClasses[theme];

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Build context from current block
  const buildContext = (): string => {
    let context = `Lesson: ${lessonTitle || 'Unknown'}\n`;
    context += `Current Block: ${block.title}\n`;
    context += `Block Type: ${block.type}\n`;
    
    if (block.content) {
      context += `Content: ${block.content}\n`;
    }
    
    if (block.type === 'quiz' && block.questions) {
      context += `This is a quiz block with ${block.questions.length} questions.\n`;
    }
    
    if (block.sourceType) {
      context += `Source Type: ${block.sourceType}\n`;
    }
    
    return context;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const context = buildContext();
      
      const { data, error } = await supabase.functions.invoke('presentation-ai-assist', {
        body: {
          context,
          question: userMessage.content,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assist error:', error);
      toast.error("Failed to get AI response. Please try again.");
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "absolute right-4 bottom-24 w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border overflow-hidden z-50",
      theme === 'dark' ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        theme === 'dark' ? "border-white/10" : "border-slate-200"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className={cn("font-semibold text-sm", tc.text)}>AI Teaching Assistant</h3>
            <p className={cn("text-xs", tc.textMuted)}>Ask about the current content</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={cn("h-8 w-8", tc.button)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="h-80" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className={cn("w-12 h-12 mx-auto mb-3", tc.textMuted)} />
              <p className={cn("text-sm", tc.textMuted)}>
                Ask me anything about "{block.title}"
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setInput("Explain this concept in simpler terms")}
                  className={cn(
                    "w-full text-left text-sm p-2 rounded-lg transition-colors",
                    theme === 'dark' ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"
                  )}
                >
                  💡 Explain this concept in simpler terms
                </button>
                <button
                  onClick={() => setInput("Give me a real-world example")}
                  className={cn(
                    "w-full text-left text-sm p-2 rounded-lg transition-colors",
                    theme === 'dark' ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"
                  )}
                >
                  🌍 Give me a real-world example
                </button>
                <button
                  onClick={() => setInput("What are common misconceptions about this topic?")}
                  className={cn(
                    "w-full text-left text-sm p-2 rounded-lg transition-colors",
                    theme === 'dark' ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"
                  )}
                >
                  ❓ What are common misconceptions?
                </button>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : theme === 'dark'
                    ? "bg-white/10 text-white rounded-bl-md"
                    : "bg-slate-100 text-slate-900 rounded-bl-md"
              )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                  theme === 'dark' ? "bg-white/20" : "bg-slate-200"
                )}>
                  <User className={cn("w-4 h-4", tc.text)} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-2 rounded-bl-md",
                theme === 'dark' ? "bg-white/10" : "bg-slate-100"
              )}>
                <p className={cn("text-sm", tc.textMuted)}>Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className={cn(
        "p-4 border-t",
        theme === 'dark' ? "border-white/10" : "border-slate-200"
      )}>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className={cn(
              "flex-1",
              theme === 'dark' && "bg-white/10 border-white/20 text-white placeholder:text-white/50"
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
