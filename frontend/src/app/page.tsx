"use client";
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, Languages } from 'lucide-react';

export default function Home() {
  const { t, theme, toggleTheme, language, toggleLanguage } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <nav className="border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-600">
            {t('appName')}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white flex items-center gap-2"
              title="Toggle Language"
            >
              <Languages className="w-5 h-5" />
              <span className="text-sm font-medium">{language === 'en' ? 'عربي' : 'EN'}</span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/dashboard" className="px-6 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-medium hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors">
              {t('getStarted')}
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
          {t('subtitle')}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
          {t('titleLine1')} <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            {t('titleLine2')}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all hover:scale-105">
            {t('tryForFree')}
          </Link>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-start">
          <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 text-2xl">
              📄
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t('feature1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('feature1Desc')}</p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 text-2xl">
              📊
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t('feature2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('feature2Desc')}</p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t('feature3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('feature3Desc')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
