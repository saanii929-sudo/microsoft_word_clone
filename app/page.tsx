'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Clock, FileText, Search, MoreHorizontal } from 'lucide-react';

const recentDocs = [
  { id: 1, title: 'Project Proposal', date: '2 hours ago', type: 'marketing' },
  { id: 2, title: 'Q4 Financial Report', date: 'Yesterday', type: 'finance' },
  { id: 3, title: 'Brainstorming Notes', date: '3 days ago', type: 'personal' },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 animate-enter">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              WordClone
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur border border-white/60 flex items-center justify-center hover:bg-white/80 transition shadow-sm">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 p-[2px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 mb-6 font-display">
            What will you create today?
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
            Experience the next generation of document editing.
            Beautiful, fast, and distraction-free.
          </p>

          <Link href="/editor/new">
            <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <span className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left"></span>
              <Plus className="w-5 h-5 mr-2" />
              Create New Document
            </button>
          </Link>
        </motion.section>

        {/* Recent Documents */}
        <section className="animate-enter-delay">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent Documents
            </h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group glass-panel rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-indigo-200/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${doc.type === 'marketing' ? 'bg-orange-100 text-orange-600' :
                      doc.type === 'finance' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                    }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {doc.title}
                </h4>
                <p className="text-sm text-slate-500">Edited {doc.date}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
