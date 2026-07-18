"use client";
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, Languages, ArrowRight, Upload, MessageSquare, BarChart3, Zap, Shield, Globe, CheckCircle } from 'lucide-react';

export default function Home() {
  const { t, theme, toggleTheme, language, toggleLanguage } = useAppContext();

  const features = [
    {
      icon: <Upload className="w-7 h-7" />,
      color: "from-indigo-500 to-blue-500",
      bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
      title: t('feature1Title'),
      desc: t('feature1Desc'),
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10 dark:bg-purple-500/15",
      title: t('feature2Title'),
      desc: t('feature2Desc'),
    },
    {
      icon: <Zap className="w-7 h-7" />,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      title: t('feature3Title'),
      desc: t('feature3Desc'),
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      title: t('feature4Title'),
      desc: t('feature4Desc'),
    },
    {
      icon: <Shield className="w-7 h-7" />,
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      title: t('feature5Title'),
      desc: t('feature5Desc'),
    },
    {
      icon: <Globe className="w-7 h-7" />,
      color: "from-sky-500 to-cyan-500",
      bg: "bg-sky-500/10 dark:bg-sky-500/15",
      title: t('feature6Title'),
      desc: t('feature6Desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-slate-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden">

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              RAGify
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('navFeatures')}</a>
            <a href="#how" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('navHow')}</a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 flex items-center gap-1.5 text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/dashboard"
              className="ms-2 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-1.5"
            >
              {t('getStarted')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          {t('heroTag')}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
          {t('titleLine1')}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {t('titleLine2')}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            {t('tryForFree')} <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="px-8 py-4 rounded-full border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-lg">
            {t('learnMore')}
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-20">
          {[
            { value: "100%", label: t('statLocal') },
            { value: "2+", label: t('statModels') },
            { value: "∞", label: t('statFiles') },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">{t('howTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('howSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: t('step1Title'), desc: t('step1Desc'), icon: <Upload className="w-6 h-6" /> },
            { step: "02", title: t('step2Title'), desc: t('step2Desc'), icon: <Zap className="w-6 h-6" /> },
            { step: "03", title: t('step3Title'), desc: t('step3Desc'), icon: <MessageSquare className="w-6 h-6" /> },
          ].map((item, i) => (
            <div key={i} className="relative p-8 rounded-2xl bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/8 overflow-hidden group hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300">
              <div className="absolute top-4 end-4 text-6xl font-black text-gray-100 dark:text-white/5 group-hover:text-indigo-500/10 transition-colors">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">{t('featuresTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('featuresSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className={`p-7 rounded-2xl ${f.bg} border border-gray-200 dark:border-white/8 hover:scale-[1.02] transition-transform duration-200`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t('ctaTitle')}</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{t('ctaSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[t('ctaBenefit1'), t('ctaBenefit2'), t('ctaBenefit3')].map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-white text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> {b}
                </div>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-700 font-bold text-lg rounded-full hover:bg-gray-50 transition-colors shadow-xl"
            >
              {t('tryForFree')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">RAGify</span>
          </div>
          <p className="text-gray-400 text-sm">{t('footerText')}</p>
        </div>
      </footer>

    </div>
  );
}
