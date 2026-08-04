import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Bot, Send, User as UserIcon, X, ShoppingCart, RefreshCw, 
  ChevronRight, ArrowRight, MessageSquare, ShieldCheck, Zap
} from 'lucide-react';
import { Product } from '../../types';
import { askAIConsultant } from '../../services/api';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
}

interface Props {
  onAddToCart?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
}

export const AIChatAssistant: React.FC<Props> = ({ onAddToCart, onOpenProductDetail }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [budgetInput, setBudgetInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ Lý AI Tư Vấn Bán Hàng & PC Builder TechGear Studio. Tôi có thể giúp bạn tìm sản phẩm phù hợp ngân sách hoặc tư vấn cấu hình PC tối ưu nhất!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.sender === 'ai' ? 'assistant' : 'user', content: m.text }));
      const res = await askAIConsultant({
        message: text,
        history,
        budget: budgetInput.trim() || undefined
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        recommendedProducts: res.recommendedProducts,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Rất tiếc, đã có sự cố kết nối với AI. Bạn hãy thử lại hoặc xem trực tiếp các danh mục sản phẩm nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    '🖥️ Tư vấn PC 20 triệu chơi game',
    '⌨️ Bàn phím cơ gõ êm văn phòng',
    '🖱️ Chuột nhẹ không dây FPS',
    '🎧 Tai nghe Bluetooth chống ồn'
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="ai-chat-trigger"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
          </div>
          <span className="font-black text-xs tracking-wide">Trợ Lý AI Tư Vấn 24/7</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase">Live</span>
        </button>
      )}

      {/* Chat Window Drawer/Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] h-[580px] animate-fade-in text-xs">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm">AI Shopping & PC Advisor</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[10px] text-slate-300">Powered by Gemini 3.6 Flash Engine</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Bar */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-slate-500 shrink-0">Ngân sách:</span>
            {['< 10Tr', '10Tr - 20Tr', '20Tr - 35Tr', '> 35Tr'].map((b, idx) => (
              <button
                key={idx}
                onClick={() => setBudgetInput(budgetInput === b ? '' : b)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                  budgetInput === b
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                        : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Products Embed */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        📦 Sản phẩm gợi ý từ kho TechGear:
                      </p>
                      <div className="space-y-2">
                        {msg.recommendedProducts.map(prod => (
                          <div
                            key={prod.id}
                            className="p-2.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm hover:border-blue-500 transition-colors"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 dark:text-white truncate text-[11px]">
                                {prod.name}
                              </h4>
                              <p className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                                {prod.price.toLocaleString('vi-VN')} ₫
                              </p>
                            </div>

                            {onAddToCart && (
                              <button
                                onClick={() => onAddToCart(prod)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow shrink-0"
                                title="Thêm vào giỏ"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 dark:text-slate-400 text-[11px] italic p-2 bg-white dark:bg-slate-800 rounded-2xl max-w-[70%] border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span>AI đang phân tích sản phẩm trong kho...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-semibold whitespace-nowrap transition-colors border border-slate-200 dark:border-slate-700"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập câu hỏi hoặc yêu cầu tư vấn PC..."
              className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium focus:ring-2 focus:ring-blue-500 text-xs"
            />
            <button
              disabled={loading || !inputMessage.trim()}
              onClick={() => handleSendMessage()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
