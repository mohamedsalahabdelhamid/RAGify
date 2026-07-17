"use client";
import { useEffect, useState } from 'react';
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
import { ArrowLeft, Download } from 'lucide-react';

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
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('excel_analysis');
    if (data) {
      setAnalysis(JSON.parse(data));
    }
  }, []);

  const handleDownload = () => {
    window.print();
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-xl">No analysis data found. Please upload an Excel file first.</p>
        <Link href="/dashboard" className="text-indigo-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* FIX #8: Use a regular <style> tag instead of <style jsx global> which
          is not supported in the Next.js App Router without styled-jsx. */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print-bg { background: white !important; }
          .print-text { color: black !important; }
          .print-border { border-color: #e5e7eb !important; }
          .print-card { background: #f9fafb !important; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-white p-6 print-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-white/10 rounded-full transition-colors print:hidden"
              >
                <ArrowLeft />
              </Link>
              <h1 className="text-3xl font-bold print-text">Analytics Dashboard</h1>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl transition-colors font-bold print:hidden"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl print-card print-border">
              <h3 className="text-gray-400 text-sm mb-2 print-text">Total Rows</h3>
              <p className="text-4xl font-bold text-indigo-400">{analysis.summary.rows_count}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl print-card print-border">
              <h3 className="text-gray-400 text-sm mb-2 print-text">Total Columns</h3>
              <p className="text-4xl font-bold text-purple-400">{analysis.summary.columns.length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl print-card print-border">
              <h3 className="text-gray-400 text-sm mb-2 print-text">AI Insights</h3>
              <p className="text-base font-medium text-pink-400">{analysis.insights}</p>
            </div>
          </div>

          {/* Column List */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 print-card print-border">
            <h2 className="text-xl font-bold mb-4 print-text">Detected Columns</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.summary.columns.map((col, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Chart */}
          {analysis.chart_data && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 h-[480px] shadow-2xl print-card print-border">
              <h2 className="text-xl font-bold mb-4 print-text">Auto-Generated Chart</h2>
              <div className="h-full w-full pb-16">
                <Bar
                  data={analysis.chart_data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: '#e2e8f0' } },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.07)' },
                      },
                      x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.07)' },
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
