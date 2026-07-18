"use client";
import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, MessageSquare, FileText, BarChart3, Send, Settings, Check, Sun, Moon, Languages, Home } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function Dashboard() {
  const { t, theme, toggleTheme, language, toggleLanguage } = useAppContext();
  
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! Upload your files and I will be ready to answer your questions or analyze your data.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExcelData, setHasExcelData] = useState(false);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('custom_api_url') || '';
    }
    return '';
  });

  const saveApiUrl = () => {
    localStorage.setItem('custom_api_url', customApiUrl.trim());
    setShowSettings(false);
  };

  const getApiUrl = () => {
    return customApiUrl.trim() || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';
  };

  const getAxiosConfig = () => {
    return {
      headers: {
        "Bypass-Tunnel-Reminder": "true"
      }
    };
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${getApiUrl()}/upload`, formData, getAxiosConfig());

      setMessages(prev => [...prev, { role: 'system', content: res.data.message || 'File uploaded successfully.' }]);

      if (res.data.type === 'excel') {
        setHasExcelData(true);
        localStorage.setItem('excel_analysis', JSON.stringify(res.data.analysis));
      }
    } catch {
      setMessages(prev => [...prev, { role: 'system', content: 'Error uploading file. Make sure the backend server is running and the URL is correct.' }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userMsg);

      const res = await axios.post(`${getApiUrl()}/chat`, formData, getAxiosConfig());

      setMessages(prev => [...prev, { role: 'system', content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'system', content: 'Sorry, could not connect to the server. Please check your backend URL settings.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-600 hover:opacity-80 transition-opacity">
          <Home className="w-6 h-6 text-indigo-500" />
          {t('appName')}
        </Link>
        <div className="flex gap-2">
          <button 
            onClick={toggleLanguage}
            className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white flex items-center gap-2"
            title="Toggle Language"
          >
            <Languages className="w-5 h-5" />
            <span className="text-sm font-medium">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[85vh]">
        {/* Sidebar - File Upload */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col h-full relative shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <UploadCloud className="text-indigo-500 dark:text-indigo-400" /> {t('uploadFiles')}
            </h2>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors flex-1 flex flex-col justify-center mt-2">
            <input
              type="file"
              className="hidden"
              id="fileInput"
              accept=".pdf,.xlsx,.xls"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 font-medium">{file ? file.name : t('clickToSelect')}</p>
              <p className="text-gray-500 text-sm mt-2">{t('supportsFormats')}</p>
            </label>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full"
            >
              {loading ? t('processing') : t('processFile')}
            </button>
          </div>

          {hasExcelData && (
            <Link
              href="/dashboard/analytics"
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 /> {t('viewAnalytics')}
            </Link>
          )}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col h-full relative overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-indigo-900/20">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('aiAssistant')}</h2>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white"
              title="API Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute top-16 left-4 right-4 z-10 bg-white dark:bg-slate-900 border border-indigo-500/50 rounded-xl p-4 shadow-2xl">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                {t('localtunnelUrl')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customApiUrl}
                  onChange={e => setCustomApiUrl(e.target.value)}
                  placeholder="https://xxxx.loca.lt"
                  className="flex-1 bg-gray-50 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                />
                <button
                  onClick={saveApiUrl}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t('leaveEmpty')}
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-white/10 text-slate-800 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                 <div className="bg-gray-100 dark:bg-white/10 rounded-2xl rounded-bl-none p-4">
                   <div className="flex gap-1.5 items-center">
                     <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <span className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 </div>
               </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={t('askAnything')}
                className="flex-1 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
