"use client";
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalysisData {
  summary: { columns: string[]; rows_count: number };
  chart_data: {
    type: string;
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor?: string; borderColor?: string; borderWidth?: number }[];
  } | null;
  insights: string;
}

export default function AnalyticsDashboard() {
  const { t, theme, language } = useAppContext();

  const [analysis] = useState<AnalysisData | null>(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('excel_analysis');
      return data ? JSON.parse(data) : null;
    }
    return null;
  });

  const handleDownload = () => {
    window.print();
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center gap-4 transition-colors duration-300">
        <p className="text-xl">{t('noData')}</p>
        <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          {t('returnDashboard')}
        </Link>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print-bg { background: white !important; }
          .print-text { color: black !important; }
          .print-border { border-color: #e5e7eb !important; }
          .print-card { background: #f9fafb !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 print-bg transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors print:hidden"
              >
                {language === 'ar' ? <ArrowRight /> : <ArrowLeft />}
              </Link>
              <h1 className="text-3xl font-bold print-text">{t('analyticsDashboard')}</h1>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-colors font-bold print:hidden"
            >
              <Download className="w-5 h-5" />
              {t('downloadReport')}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-xl print-card print-border">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2 print-text">{t('totalRows')}</h3>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.summary.rows_count}</p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-xl print-card print-border">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2 print-text">{t('totalColumns')}</h3>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{analysis.summary.columns.length}</p>
            </div>
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-xl print-card print-border">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2 print-text">{t('aiInsights')}</h3>
              <p className="text-base font-medium text-pink-600 dark:text-pink-400">{analysis.insights}</p>
            </div>
          </div>

          {/* Column List */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-sm dark:shadow-none print-card print-border">
            <h2 className="text-xl font-bold mb-4 print-text text-slate-900 dark:text-white">{t('detectedColumns')}</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.summary.columns.map((col, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-200 dark:border-transparent">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Chart */}
          {analysis.chart_data && (
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-6 h-[480px] shadow-sm dark:shadow-2xl print-card print-border">
              <h2 className="text-xl font-bold mb-4 print-text text-slate-900 dark:text-white">{t('autoGeneratedChart')}</h2>
              <div className="h-full w-full pb-16">
                <Bar
                  data={analysis.chart_data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: isDark ? '#e2e8f0' : '#475569' } },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
                        grid: { color: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' },
                      },
                      x: {
                        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
                        grid: { color: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
