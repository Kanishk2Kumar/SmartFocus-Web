"use client";

import { useState, useRef, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatPopover() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your SmartFocus AI Assistant. How can I help you with our study platform today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Enhanced SmartFocus topic detection
      const isAboutSmartFocus = /smartfocus|study|monitor|learning|education|quiz|student|focus|attention|tracking|detection|assistant|platform/i.test(input.toLowerCase());
      
      if (!isAboutSmartFocus) {
        throw new Error("I specialize exclusively in the SmartFocus study assistant platform.");
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are the SmartFocus AI Assistant. Your purpose is to provide information exclusively about the SmartFocus platform. 

              SmartFocus Platform Details:
              - Type: AI-powered desktop study assistant and monitoring platform
              - Purpose: Ensure focused, honest, and healthy self-study sessions
              - Features:
                • Attention Tracking 
                • Face Detection 
                • Pose Estimation 
                • Object Detection 
                • Audio Monitoring 
                • Smart Quizzes + Wellbeing Suggestions
                • Telegram Alerts for parents/teachers
              
              Response Rules:
              1. ONLY answer questions about SmartFocus features, setup, or usage
              2. For non-SmartFocus queries: "I specialize exclusively in SmartFocus study assistance."
              3. Be technical but clear about our monitoring capabilities
              4. Never discuss unrelated AI models or platforms
              5. For health/wellbeing questions, only reference our posture/break suggestions`
            },
            ...newMessages.map(m => ({
              role: m.role,
              content: m.content
            }))
          ],
          temperature: 0.3 // Lower temperature for more focused responses
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error ? 
          (error.message.includes('specialize') ? error.message : 'Sorry, I can only discuss SmartFocus-related topics.') 
          : 'Sorry, an error occurred'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="rounded-full h-16 w-44 border border-primary-100 bg-transparent hover:bg-primary/10 mx-"
          variant="default"
        >
          <span className="text-primary-100 px-2 text-lg">SmartFocus AI</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-6 h-6"
          >
            <path
              fill="#b3b3e6"
              d="M256 80C141.1 80 48 173.1 48 288l0 104c0 13.3-10.7 24-24 24s-24-10.7-24-24L0 288C0 146.6 114.6 32 256 32s256 114.6 256 256l0 104c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-104c0-114.9-93.1-208-208-208zM80 352c0-35.3 28.7-64 64-64l16 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-64zm288-64c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32l16 0z"
            />
          </svg>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-96 h-[36rem] bg-background border shadow-xl rounded-lg flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="font-semibold">SmartFocus Assistant</h4>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${message.role === 'assistant' 
                ? 'bg-muted' 
                : 'bg-primary/10 ml-auto max-w-[80%]'}`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-2 border-t flex gap-2">
          <Input 
            placeholder="Ask about SmartFocus..." 
            className="flex-1" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}