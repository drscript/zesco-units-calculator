'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ZapOff, Home, RotateCcw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navigation Bar - matches main app */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">Z</div>
          <span className="text-xl font-bold text-slate-800">Zesco Unit <span className="text-green-600">Calculator</span></span>
        </Link>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Page Supply Interrupted</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 p-8 sm:p-12 text-center"
        >
          {/* Flickering icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center shadow-inner"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ZapOff className="w-9 h-9 text-amber-400" />
            </motion.div>
          </motion.div>

          {/* Big 404 */}
          <h1 className="mt-8 text-7xl sm:text-8xl font-bold tracking-tight text-slate-900">
            4<span className="text-green-600">0</span>4
          </h1>

          <h2 className="mt-2 text-xl font-bold text-slate-800">
            This page is load shedding.
          </h2>

          <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            We searched every tariff band and couldn&apos;t find a single unit of this URL.
            Either it doesn&apos;t exist, or it&apos;s off-grid until further notice. No amount of
            kwacha will bring it back.
          </p>

          {/* Faux receipt line - matches the cost breakdown aesthetic */}
          <div className="mt-8 bg-slate-50 rounded-xl border border-slate-100 p-4 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Pages Requested</span>
              <span className="font-medium text-slate-600 font-mono">1</span>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-slate-400">Pages Delivered</span>
              <span className="font-medium text-slate-600 font-mono">0.0 kWh</span>
            </div>
            <div className="flex justify-between text-xs mt-3 pt-3 border-t border-slate-200">
              <span className="font-bold text-slate-700">Estimated Restoration</span>
              <span className="font-bold text-amber-500 font-mono">Unknown</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-green-600 rounded-xl text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-200/50"
            >
              <Home className="w-4 h-4" />
              Back to the Calculator
            </Link>
            <button
              onClick={() => typeof window !== 'undefined' && window.location.reload()}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Reconnecting
            </button>
          </div>

          <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            Tip: unlike ZESCO, this page comes back the moment you go home.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
