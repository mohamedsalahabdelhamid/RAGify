import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
            Nexus AI
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
          The Smartest Document & Data Analysis System
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
          Understand Your Data <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Like Never Before
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Upload your PDFs or Excel files, and let AI read, analyze, and extract precise details and interactive dashboards in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all hover:scale-105">
            Try For Free
          </Link>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400 text-2xl">
              📄
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Limitless Reading</h3>
            <p className="text-gray-400">Upload any file size. The system has a permanent memory to analyze and retrieve every character.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 text-2xl">
              📊
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Data Analysis</h3>
            <p className="text-gray-400">Upload Excel files and we will generate professional, interactive, and downloadable dashboards instantly.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-400 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Zero Downtime</h3>
            <p className="text-gray-400">Auto-fallback system between top models (Gemini, Groq, Cohere) ensures 24/7 free uptime.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
