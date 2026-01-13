
import React, { useState, useEffect, useRef } from 'react';
import { GroupMeeting, UserProfile, ChatMessage } from '../types';
import { simulateAiModeration } from '../geminiService';
import { ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon, TruckIcon, MapIcon, WalletIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import { translations, Language } from '../translations';

interface GroupChatProps {
  meeting: GroupMeeting;
  currentUser: UserProfile;
  onBack: () => void;
  lang: Language;
}

const GroupChat: React.FC<GroupChatProps> = ({ meeting, currentUser, onBack, lang }) => {
  const t = translations[lang];
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Greeting & Roll Call
  useEffect(() => {
    const names = meeting.members.map(m => m.id === currentUser.id ? (lang === 'ua' ? 'Ти' : 'You') : m.name).join(', ');
    const statusText = meeting.members.length < 4 ? t.chat.searchingMore : t.chat.allSet;
    const greeting = t.chat.rollCall
      .replace('{u}', currentUser.name)
      .replace('{m}', names)
      .replace('{s}', statusText);

    const initialMsg: ChatMessage = { 
      id: 'm1', 
      senderId: 'ai', 
      senderName: 'Meet.ai', 
      text: greeting, 
      timestamp: Date.now(), 
      isAi: true 
    };
    
    setMessages([initialMsg]);

    // Second AI message: Suggest location
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: 'm2',
            senderId: 'ai',
            senderName: 'Meet.ai',
            text: lang === 'ua' ? `Я підібрав ${meeting.location.name}. Бюджет приблизно ${meeting.totalBudget}₴. Що думаєте?` : `I picked ${meeting.location.name}. Budget is around ${meeting.totalBudget}$. Thoughts?`,
            timestamp: Date.now(),
            isAi: true
        }]);
    }, 1500);
  }, [lang, meeting.members, currentUser.name, meeting.location.name, meeting.totalBudget]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiThinking]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    // Logic triggers
    const lowerInput = currentInput.toLowerCase();
    const isTimeAgreed = lowerInput.includes('час') || lowerInput.includes('time') || lowerInput.includes('о ') || lowerInput.includes('at ');
    const isPlaceAgreed = lowerInput.includes('ок') || lowerInput.includes('окей') || lowerInput.includes('agree') || lowerInput.includes('згоден') || lowerInput.includes('місце');

    setIsAiThinking(true);
    
    if (isPlaceAgreed && !showQr) {
        // Special logic for Venue Selection
        setTimeout(() => {
            const checkingMsg = t.chat.checkingAvailability.replace('{v}', meeting.location.name);
            setMessages(prev => [...prev, { id: 'check_'+Date.now(), senderId: 'ai', senderName: 'Meet.ai', text: checkingMsg, timestamp: Date.now(), isAi: true }]);
            
            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    id: 'qr_'+Date.now(), 
                    senderId: 'ai', 
                    senderName: 'Meet.ai', 
                    text: t.chat.tableReady, 
                    timestamp: Date.now(), 
                    isAi: true 
                }]);
                setShowQr(true);
                setIsAiThinking(false);
            }, 2000);
        }, 800);
        return;
    }

    if (isTimeAgreed) {
        setTimeout(() => {
            const taxiMsg = t.chat.taxiPrompt.replace('{t}', meeting.time);
            setMessages(prev => [...prev, { id: 'taxi_'+Date.now(), senderId: 'ai', senderName: 'Meet.ai', text: taxiMsg, timestamp: Date.now(), isAi: true }]);
            setIsAiThinking(false);
        }, 1000);
        return;
    }

    // Default AI moderation
    const aiResponse = await simulateAiModeration(
      `Група: ${meeting.title}. Локація: ${meeting.location.name}. Бюджет: ${meeting.totalBudget}.`,
      currentInput,
      lang
    );
    setIsAiThinking(false);

    if (aiResponse) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        senderId: 'ai', 
        senderName: 'Meet.ai', 
        text: aiResponse, 
        timestamp: Date.now(), 
        isAi: true 
      }]);
    }
  };

  const handleOpenGPay = () => {
    setShowPayModal(true);
    setTimeout(() => {
        setShowPayModal(false);
        const paymentMsg: ChatMessage = {
            id: 'pay_' + Date.now(),
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: lang === 'ua' ? "Підтвердив свою участь оплатою 💳" : "Confirmed my attendance with payment 💳",
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, paymentMsg]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col max-w-md mx-auto shadow-2xl">
      <header className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 leading-tight truncate max-w-[150px] text-base">{meeting.title}</h2>
            <div className="flex items-center text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span>
               {t.chat.poolStatus.replace('{c}', meeting.currentPool?.toString() || '0').replace('{t}', meeting.totalBudget?.toString() || '0')}
            </div>
          </div>
        </div>
        <div className="flex -space-x-2">
          {meeting.members.map(m => (
            <img key={m.id} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" alt={m.name} />
          ))}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50 pb-8">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className="flex items-center space-x-1.5 mb-1 px-1">
              {msg.isAi && <SparklesIcon className="w-3 h-3 text-indigo-500" />}
              <span className="text-[10px] font-bold text-slate-400 uppercase">{msg.senderName}</span>
            </div>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.senderId === currentUser.id 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
            {msg.id.startsWith('qr_') && (
              <div className="mt-3 p-4 bg-white border border-indigo-100 rounded-3xl shadow-xl flex flex-col items-center space-y-2 animate-in zoom-in duration-500">
                 <QrCodeIcon className="w-32 h-32 text-slate-900" />
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">MEET-OFF-15</span>
              </div>
            )}
          </div>
        ))}

        {isAiThinking && (
          <div className="flex items-start space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">AI</div>
            <div className="bg-white border border-indigo-50 p-3 rounded-2xl rounded-tl-none flex space-x-1">
               <div className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce"></div>
               <div className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
               <div className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 space-y-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold shadow-md whitespace-nowrap active:scale-95 transition-transform">
            <MapIcon className="w-4 h-4" />
            <span>{t.chat.getRoute}</span>
          </button>
          <button 
            onClick={handleOpenGPay}
            className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold shadow-md whitespace-nowrap active:scale-95 transition-transform"
          >
            <WalletIcon className="w-4 h-4" />
            <span>Google Pay</span>
          </button>
          <button className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 whitespace-nowrap active:scale-95 transition-transform">
            <TruckIcon className="w-4 h-4" />
            <span>{t.chat.callTaxi}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.chat.placeholder}
            className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
          />
          <button onClick={handleSendMessage} className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 active:scale-90 transition-transform">
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
           <div className="bg-white w-full rounded-3xl p-8 flex flex-col items-center space-y-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center space-x-3">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-6" alt="GPay" />
              </div>
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-slate-900 text-center">{lang === 'ua' ? 'Обробка підтвердження...' : 'Processing confirmation...'}</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
