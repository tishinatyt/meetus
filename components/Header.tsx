
import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { translations, Language } from '../translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const t = translations[lang];

  return (
    <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 z-10">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-outfit font-bold tracking-tight text-slate-900 leading-none">Meet.ai</h1>
          <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">{t.header.subtitle}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex bg-slate-100 rounded-full p-1 text-[10px] font-bold">
          <button 
            onClick={() => setLang('ua')}
            className={`px-2 py-1 rounded-full transition-all ${lang === 'ua' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            UA
          </button>
          <button 
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-full transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            EN
          </button>
        </div>
        <div className="hidden sm:flex items-center space-x-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-semibold text-emerald-600">{t.header.online}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
