
import React, { useState, useEffect, useRef } from 'react';
import { UserArchetype } from '../types';
import { analyzeUser, getNextOnboardingQuestion, AnalysisResult, QuestionData } from '../geminiService';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { translations, Language } from '../translations';

interface OnboardingProps {
  onComplete: (result: AnalysisResult) => void;
  lang: Language;
}

interface Message {
  text: string;
  isAi: boolean;
  options?: string[];
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, lang }) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([
    { text: t.onboarding.intro, isAi: true }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const MAX_QUESTIONS = 7;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiThinking]);

  // Initial question after intro
  useEffect(() => {
    const fetchFirst = async () => {
      setIsAiThinking(true);
      const data = await getNextOnboardingQuestion([], lang);
      setMessages(prev => [...prev, { text: data.question, isAi: true, options: data.options }]);
      setIsAiThinking(false);
      setQuestionsAsked(1);
    };
    fetchFirst();
  }, [lang]);

  const performAnalysis = async (updatedMessages: Message[]) => {
    setIsAnalyzing(true);
    const userAnswers = updatedMessages.filter(m => !m.isAi).map(m => m.text);
    const result = await analyzeUser(userAnswers);
    setIsAnalyzing(false);
    onComplete(result);
  };

  const handleOptionSelect = async (option: string) => {
    if (isAiThinking || isAnalyzing) return;

    // 1. Add user message
    const userMsg: Message = { text: option, isAi: false };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // 2. Decide whether to ask more or finish
    if (questionsAsked < MAX_QUESTIONS) {
      setIsAiThinking(true);
      const nextData = await getNextOnboardingQuestion(updatedMessages.map(m => m.text), lang);
      setIsAiThinking(false);

      if (nextData.isAnalysisReady) {
        // AI says it has enough info
        await performAnalysis(updatedMessages);
      } else {
        setMessages(prev => [...prev, { text: nextData.question, isAi: true, options: nextData.options }]);
        setQuestionsAsked(prev => prev + 1);
      }
    } else {
      await performAnalysis(updatedMessages);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-20 px-4">
        <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-outfit font-bold">{t.onboarding.findingTribe}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{t.onboarding.aiAnalyzing}</p>
        </div>
      </div>
    );
  }

  const currentOptions = messages[messages.length - 1]?.isAi ? messages[messages.length - 1].options : [];

  return (
    <div className="flex flex-col h-[78vh] space-y-4">
      <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t.onboarding.stepInfo.replace('{step}', questionsAsked.toString())} / {MAX_QUESTIONS}
            </span>
          </div>
          <span className="text-[10px] font-bold text-indigo-600">{t.onboarding.beYourself}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-1 pb-10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
              m.isAi 
                ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-none' 
                : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isAiThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex space-x-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/50 backdrop-blur-sm border-t border-slate-100 -mx-4 px-4 pt-4 pb-2">
        <div className="flex flex-col space-y-2">
          {currentOptions?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(opt)}
              disabled={isAiThinking}
              className="w-full text-left px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
