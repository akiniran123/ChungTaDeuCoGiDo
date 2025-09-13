// src/app/messages/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

type ChatMsg = { id: number; from: 'you' | 'them'; text: string; time: string };

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const chatId = params.id;

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, from: 'them', text: 'Xin chào! Mình là Shop ABC 😊', time: '10:00' },
    { id: 2, from: 'you',  text: 'Chào shop, sản phẩm còn không ạ?', time: '10:01' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: 'you', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 pt-[64px]">
      {/* Header */}
      <div className="p-4 bg-white border-b fixed top-[64px] left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="font-semibold">Đoạn chat #{chatId}</div>
          <div className="text-xs text-gray-500">Bạn đang trò chuyện với người bán</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mt-[96px] mb-[64px]">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-2">
          {messages.map(m => (
            <div
              key={m.id}
              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                m.from === 'you'
                  ? 'bg-[#9b4de0] text-white ml-auto'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div>{m.text}</div>
              <div
                className={`mt-1 text-[10px] ${
                  m.from === 'you' ? 'text-white/80' : 'text-gray-500'
                }`}
              >
                {m.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9b4de0] border-gray-300"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-full bg-[#9b4de0] text-white text-sm font-medium hover:bg-[#873ac7] active:scale-[0.98] transition"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
