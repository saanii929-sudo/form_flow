'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your FormFlow assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Pricing questions
    if (msg.includes('price') || msg.includes('cost') || msg.includes('plan') || msg.includes('subscription')) {
      return "We offer 3 pricing plans in Ghana Cedis:\n\n• Basic Plan: GH₵50/month - Perfect for individuals\n• Professional Plan: GH₵120/month - Great for small businesses\n• Enterprise Plan: GH₵300/month - Best for large organizations\n\nAll new users get a 10-day free trial! Visit the Pricing page to learn more.";
    }

    // Free trial questions
    if (msg.includes('trial') || msg.includes('free')) {
      return "Yes! We offer a 10-day free trial for all new users. After signing up and verifying your email, you'll have full access to all features for 10 days. No credit card required to start!";
    }

    // Features questions
    if (msg.includes('feature') || msg.includes('what can') || msg.includes('do')) {
      return "FormFlow includes:\n\n✓ Add text fields anywhere on PDFs\n✓ Insert checkmarks and signatures\n✓ Draw and save signatures\n✓ Undo/Redo functionality\n✓ Zoom controls (25%-200%)\n✓ Multi-page PDF support\n✓ Save and load drafts\n✓ Form templates library\n✓ Keyboard shortcuts\n✓ Download filled PDFs\n\nIt's perfect for filling out job applications, tax forms, contracts, and more!";
    }

    // How to use questions
    if (msg.includes('how') || msg.includes('use') || msg.includes('start') || msg.includes('begin')) {
      return "Getting started is easy:\n\n1. Sign up and verify your email\n2. Choose a subscription plan (or use your free trial)\n3. Upload a PDF or load from URL\n4. Use the toolbar to add text, checkmarks, or signatures\n5. Click anywhere on the PDF to place items\n6. Preview and download your filled PDF\n\nNeed help with a specific feature? Just ask!";
    }

    // Signature questions
    if (msg.includes('signature') || msg.includes('sign')) {
      return "To add signatures:\n\n1. Use the Signature Pad at the bottom to draw your signature\n2. Click 'Save Signature' when done\n3. Click the 'Sign' button in the toolbar\n4. Click anywhere on the PDF to place your signature\n\nYou can resize and move signatures after placing them!";
    }

    // Payment questions
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('paystack')) {
      return "We use Paystack for secure payments. Paystack supports:\n\n• Mobile Money (MTN, Vodafone, AirtelTigo)\n• Credit/Debit Cards (Visa, Mastercard)\n• Bank Transfers\n\nAll payments are processed securely through Paystack's encrypted platform.";
    }

    // Email verification questions
    if (msg.includes('email') || msg.includes('verify') || msg.includes('verification')) {
      return "After signing up, you'll receive a verification email. Click the link in the email to verify your account. If you don't see it:\n\n• Check your spam folder\n• Make sure you entered the correct email\n• Contact support if you still need help\n\nYou must verify your email before accessing the PDF form editor.";
    }

    // Account questions
    if (msg.includes('account') || msg.includes('profile') || msg.includes('logout')) {
      return "Account management:\n\n• Sign out: Click the 'Sign Out' button in the top right\n• Change plan: Visit the Pricing page\n• View subscription: Go to the Subscription page\n\nYour account includes your subscription status, trial information, and saved drafts.";
    }

    // Template questions
    if (msg.includes('template')) {
      return "We provide pre-loaded form templates including:\n\n• Job Application Forms\n• Tax Forms (W-4, W-9)\n• Rental Agreements\n• Medical Consent Forms\n\nClick the 'Templates' button in the toolbar to browse and load templates instantly!";
    }

    // Keyboard shortcuts
    if (msg.includes('shortcut') || msg.includes('keyboard')) {
      return "Keyboard shortcuts:\n\n• Ctrl+Z: Undo\n• Ctrl+Y: Redo\n• Ctrl+C: Copy selected field\n• Ctrl+V: Paste field\n• Delete: Remove selected field\n• Esc: Cancel current action\n• Ctrl + Plus: Zoom in\n• Ctrl + Minus: Zoom out\n\nClick the keyboard icon in the toolbar to see all shortcuts!";
    }

    // Support questions
    if (msg.includes('support') || msg.includes('help') || msg.includes('contact')) {
      return "Need more help? Contact us at:\n\n📧 Email: admin@attunehearttherapy.com\n\nWe typically respond within 24 hours. You can also check our FAQ section on the pricing page for common questions.";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n\n• Pricing and plans\n• How to use features\n• Signatures and forms\n• Payment methods\n• Account management\n• Keyboard shortcuts\n• Technical support\n\nWhat would you like to know?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How do I get started?",
    "What are the pricing plans?",
    "How do I add a signature?",
    "What features are available?",
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Open chat"
        >
          <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">PDF Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-400' : 'text-white/70'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center mb-2">Quick questions:</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="w-full text-left p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
