import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BedDouble,
  Clock,
  CreditCard,
  CheckCircle2,
  MessageSquare,
  Zap,
  Building2,
  Users,
  Send,
  Layers,
  ChevronRight,
  Star,
  Compass
} from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

export default function Home() {
  const navigate = useNavigate();
  const [interactiveMsg, setInteractiveMsg] = useState('');
  const [interactiveChat, setInteractiveChat] = useState([
    {
      role: 'user',
      text: 'Are there any double-sharing rooms available right now?'
    },
    {
      role: 'assistant',
      text: 'Yes! We currently have 2 Double Rooms with vacant beds in Block A. Amenities include high-speed Wi-Fi, air conditioning, and attached bathrooms. Monthly rent is $5,000.'
    }
  ]);

  const openFloatingChat = (initialPrompt = '') => {
    window.dispatchEvent(new CustomEvent('open-hms-chat'));
    if (initialPrompt) {
      setTimeout(() => {
        const input = document.querySelector('input[placeholder*="Ask about rooms"]');
        if (input) {
          input.value = initialPrompt;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 250);
    }
  };

  const handleInteractiveAsk = (question) => {
    setInteractiveChat((prev) => [
      ...prev,
      { role: 'user', text: question },
      {
        role: 'assistant',
        text:
          question.includes('curfew')
            ? 'The night gate curfew is strictly 10:00 PM every evening for all residents. Visiting hours are 4:00 PM – 9:00 PM.'
            : question.includes('mess') || question.includes('fee')
            ? 'The monthly fee includes $5,000 room rent and $3,500 mess fee (breakfast, lunch, dinner). A refundable security deposit of $10,000 is required at admission.'
            : 'You can submit an admission application online or visit the warden desk on the Ground Floor for room inspection.'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e5192d] selection:text-white relative overflow-hidden">
      {/* ---------------- Background Red Ribbon Ambient Accents ---------------- */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-rose-500/15 via-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-rose-500/10 via-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none -ml-32" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-t from-red-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ---------------- Navigation Bar ---------------- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo matching the reference image */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#e5192d] to-[#ff4155] text-white flex items-center justify-center font-black text-xl shadow-[0_8px_20px_rgba(229,25,45,0.35)] group-hover:scale-105 transition-transform duration-300">
              <Bot size={24} className="group-hover:rotate-6 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  SMART<span className="text-[#e5192d]">HMS</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-rose-50 text-[#e5192d] border border-rose-200/60 rounded-md tracking-wider">
                  AI 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Hotel & Hostel System
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#e5192d] transition-colors">
              Platform
            </a>
            <a href="#ai-demo" className="hover:text-[#e5192d] transition-colors flex items-center gap-1">
              AI Assistant
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5192d] animate-ping" />
            </a>
            <a href="#rooms" className="hover:text-[#e5192d] transition-colors">
              Rooms & Rates
            </a>
            <a href="#policies" className="hover:text-[#e5192d] transition-colors">
              Hostel Rules
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Portal Login
            </Link>
            <button
              onClick={() => openFloatingChat()}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Sparkles size={14} className="text-[#ff4155]" />
              <span>Ask AI Bot</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION (Identical Style to Reference Image) ---------------- */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-7 z-10">
              
              {/* Category Pill with Red Bar (exact like image: | AI CHATBOTS) */}
              <div className="inline-flex items-center gap-2.5">
                <span className="h-5 w-1.5 bg-[#e5192d] rounded-full inline-block" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-slate-900">
                  AI CHATBOTS & SMART HOSTEL
                </span>
              </div>

              {/* Main Typography Statement */}
              <div className="space-y-1">
                <h1 className="text-5xl sm:text-6xl xl:text-[76px] font-black uppercase tracking-tight leading-[0.95] text-slate-950 font-sans">
                  LET YOUR <br />
                  WEBSITE <br />
                  <span className="text-[#e5192d] italic">DO THE</span> <br />
                  TALKING.
                </h1>
              </div>

              {/* Tagline / Subtitle */}
              <p className="text-xl sm:text-2xl font-medium text-slate-800 tracking-tight">
                Turn questions into conversations.
              </p>

              <p className="text-slate-500 text-sm sm:text-base max-w-lg leading-relaxed">
                Connect guests and students with real-time room vacancies, verified fee structures, and instant policy answers — powered by live MongoDB intelligence.
              </p>

              {/* Primary Call to Action Button (Signature Red Pill from Reference Image) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openFloatingChat('What rooms are available right now?')}
                  className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#e5192d] via-[#f01c30] to-[#ff2b3e] text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-3 shadow-[0_12px_32px_rgba(229,25,45,0.42)] hover:shadow-[0_16px_40px_rgba(229,25,45,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Build with Afaque</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>

                <Link
                  to="/login"
                  className="px-6 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <span>Admin & Resident Portal</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
              </div>

              {/* Sub-Brand Signature Line (exact like image: — afaque.co) */}
              <div className="pt-4 flex items-center gap-3 text-xs font-bold text-slate-600 tracking-wider">
                <span className="h-0.5 w-7 bg-[#e5192d] inline-block" />
                <span className="text-slate-900 tracking-widest uppercase">afaque.co</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Verified Fact-Only Model
                </span>
              </div>
            </div>

            {/* Right Visual Column (Matches the 3D Glass Artwork from the Image) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              
              {/* Outer decorative glow container */}
              <div className="relative w-full max-w-[500px] aspect-square rounded-[36px] p-2 bg-gradient-to-b from-white/90 to-slate-100/60 backdrop-blur-2xl border border-white/80 shadow-[0_30px_90px_rgba(229,25,45,0.22)] overflow-hidden group">
                
                {/* Visual Glassmorphic Art - High-Res Artwork from the User */}
                <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-gradient-to-b from-white to-slate-100 flex items-center justify-center">
                  <img
                    src="/hero-3d-bot.jpg"
                    alt="3D Glassmorphic AI Chatbot Sculpture"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay for seamless integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  {/* Floating 3D Metric Badges */}
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center gap-2 animate-bounce [animation-duration:4s]">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black text-slate-800">Live DB Connected</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.12)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#e5192d] to-[#ff3b4f] text-white flex items-center justify-center font-black shadow-md">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">AI Assistant Ready</p>
                        <p className="text-[11px] text-slate-500 font-medium">Click to chat in real-time</p>
                      </div>
                    </div>

                    <button
                      onClick={() => openFloatingChat('Hello, how can I book a room?')}
                      className="px-4 py-2 rounded-xl bg-[#e5192d] hover:bg-[#d01325] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all"
                    >
                      Chat Now
                    </button>
                  </div>
                </div>

                {/* Ambient Red Glow Halo */}
                <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#e5192d]/30 rounded-full blur-2xl pointer-events-none" />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ---------------- Interactive Live Chat Showcase Section ---------------- */}
      <section id="ai-demo" className="py-20 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#e5192d] text-xs font-bold uppercase tracking-wider">
              <Zap size={14} />
              Real-Time Verification Engine
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Test the AI with Real Hotel Data
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Unlike generic bots, our assistant answers strictly from live MongoDB records. It checks real bed counts, current fee rates, and hostel rules without inventing facts.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Quick Prompt Selectors */}
            <div className="md:col-span-5 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Click a question to test live:
              </p>

              {[
                'What rooms are available right now?',
                'What is the night gate curfew rule?',
                'How much is the monthly fee and mess?',
                'Can I change my assigned room?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInteractiveAsk(q)}
                  className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200/80 hover:border-rose-200 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#e5192d] transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare size={16} className="text-slate-400 group-hover:text-[#e5192d] transition-colors" />
                    {q}
                  </span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-6 space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold">
                  <ShieldCheck size={16} />
                  Safe By Design
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automatic PII scrubber masks credit cards, phone numbers, and emails before saving conversations to your training logs.
                </p>
              </div>
            </div>

            {/* Mock Live Chat Display */}
            <div className="md:col-span-7 bg-[#fafafa] rounded-3xl border border-slate-200 p-6 shadow-xl flex flex-col h-[460px]">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#e5192d] to-[#ff3b4f] text-white flex items-center justify-center font-black">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Smart HMS Live Agent</h4>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Gemini 3.5 Flash Active
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openFloatingChat()}
                  className="text-xs font-bold text-[#e5192d] hover:underline"
                >
                  Full Screen
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 py-4 overflow-y-auto space-y-3 pr-2">
                {interactiveChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#e5192d] text-white font-medium rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input trigger */}
              <div className="pt-3 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a question or click a prompt on the left…"
                  value={interactiveMsg}
                  onChange={(e) => setInteractiveMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && interactiveMsg.trim()) {
                      handleInteractiveAsk(interactiveMsg);
                      setInteractiveMsg('');
                    }
                  }}
                  className="flex-1 px-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#e5192d]"
                />
                <button
                  onClick={() => {
                    if (interactiveMsg.trim()) {
                      handleInteractiveAsk(interactiveMsg);
                      setInteractiveMsg('');
                    }
                  }}
                  className="h-9 w-9 rounded-xl bg-[#e5192d] text-white flex items-center justify-center shadow hover:bg-[#d01325]"
                >
                  <Send size={14} />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ---------------- Core Features Grid ---------------- */}
      <section id="features" className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
              FULL SUITE CAPABILITIES
            </h2>
            <h3 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Engineered for Modern Living
            </h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              From instant room allocation to automated fee collection and night roll-calls, Smart HMS elevates everyday campus management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e5192d] flex items-center justify-center font-black mb-6 group-hover:scale-110 group-hover:bg-[#e5192d] group-hover:text-white transition-all">
                <BedDouble size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">3D Isometric Bed Allocator</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Visual slot allocation across Single, Double, Triple, and Dormitory rooms with real-time occupancy counts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e5192d] flex items-center justify-center font-black mb-6 group-hover:scale-110 group-hover:bg-[#e5192d] group-hover:text-white transition-all">
                <Bot size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Extensible AI Provider</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Pre-configured with Gemini & Claude, designed with a clean abstraction so you can plug in your own trained local model anytime.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e5192d] flex items-center justify-center font-black mb-6 group-hover:scale-110 group-hover:bg-[#e5192d] group-hover:text-white transition-all">
                <CreditCard size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Automated Billing & Dues</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate monthly invoices, manage fee heads, track late fines, and record multiple payment channels in one place.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e5192d] flex items-center justify-center font-black mb-6 group-hover:scale-110 group-hover:bg-[#e5192d] group-hover:text-white transition-all">
                <Clock size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Gate Pass & Roll-Call</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Digital night attendance marking, student departure permits, and visitor log registers with CNIC checks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e5192d] flex items-center justify-center font-black mb-6 group-hover:scale-110 group-hover:bg-[#e5192d] group-hover:text-white transition-all">
                <Layers size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Fine-Tuning Data Export</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Exports sanitized guest conversations directly to JSONL and CSV so you can continuously train your custom AI models.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e5192d] flex items-center justify-center font-black mb-6 group-hover:scale-110 group-hover:bg-[#e5192d] group-hover:text-white transition-all">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Enterprise Security</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                JWT role-based protection (Admin, Warden, Accountant, Resident), input sanitization, and IP rate limiting.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------- Available Rooms & Pricing Section ---------------- */}
      <section id="rooms" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
                LIVE INVENTORY
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
                Room Types & Availability
              </h3>
            </div>
            <Link
              to="/login"
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 self-start shadow-sm"
            >
              <span>View Full Floor Plan</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Single Room */}
            <div className="rounded-3xl border border-slate-200 p-6 bg-[#fafafa] flex flex-col justify-between hover:border-[#e5192d]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    1 Bed Vacant
                  </span>
                  <span className="text-xs font-bold text-slate-400">Floor 1</span>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">Single Deluxe</h4>
                <p className="text-xs text-slate-500 mb-6">Private occupancy for focused academics</p>

                <div className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Private Study Desk & High-Speed Wi-Fi
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Attached Luxury Bathroom
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Individual Air Conditioning
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">$8,000</span>
                  <span className="text-xs text-slate-400 font-semibold"> / month</span>
                </div>
                <button
                  onClick={() => openFloatingChat('Tell me about the Single Deluxe room availability.')}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition"
                >
                  Inquire
                </button>
              </div>
            </div>

            {/* Double Sharing (Highlighted) */}
            <div className="rounded-3xl border-2 border-[#e5192d] p-6 bg-white flex flex-col justify-between shadow-[0_15px_40px_rgba(229,25,45,0.12)] relative">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#e5192d] text-white tracking-wider">
                Most Popular
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    2 Beds Vacant
                  </span>
                  <span className="text-xs font-bold text-slate-400">Floor 2</span>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">Double Sharing</h4>
                <p className="text-xs text-slate-500 mb-6">Dual occupancy with personal wardrobes</p>

                <div className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Two Single Beds & Ergonomic Chairs
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Air Conditioning & Attached Bath
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    High-Speed Campus Wi-Fi
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">$5,000</span>
                  <span className="text-xs text-slate-400 font-semibold"> / month</span>
                </div>
                <button
                  onClick={() => openFloatingChat('How can I reserve a Double Sharing room?')}
                  className="px-4 py-2 rounded-xl bg-[#e5192d] hover:bg-[#d01325] text-white text-xs font-bold shadow-md transition"
                >
                  Book Seat
                </button>
              </div>
            </div>

            {/* Triple Room */}
            <div className="rounded-3xl border border-slate-200 p-6 bg-[#fafafa] flex flex-col justify-between hover:border-[#e5192d]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    3 Beds Vacant
                  </span>
                  <span className="text-xs font-bold text-slate-400">Floor 3</span>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">Triple Sharing</h4>
                <p className="text-xs text-slate-500 mb-6">Spacious room with balcony view</p>

                <div className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Large Balcony & Natural Sunlight
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Three Lockers & Study Tables
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    Full Mess Dining Included
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">$3,500</span>
                  <span className="text-xs text-slate-400 font-semibold"> / month</span>
                </div>
                <button
                  onClick={() => openFloatingChat('What are the triple room details?')}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition"
                >
                  Inquire
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------- Call to Action Banner ---------------- */}
      <section className="py-20 bg-gradient-to-tr from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#e5192d]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} className="text-[#ff3b4f]" />
            Immediate Deployment Ready
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Elevate Your Hostel with <br />
            <span className="text-[#ff3b4f]">Conversational AI</span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Eliminate repetitive front desk inquiries. Deploy intelligent, fact-grounded conversations while retaining full control to train your own local model.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <button
              onClick={() => openFloatingChat()}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#e5192d] to-[#ff2b3e] text-white font-extrabold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(229,25,45,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              Start Live Chat Now →
            </button>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-all"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-[#e5192d] text-white flex items-center justify-center font-black">
              <Bot size={16} />
            </div>
            <span className="font-black text-slate-900 tracking-tight text-sm">
              SMART<span className="text-[#e5192d]">HMS</span>
            </span>
            <span className="text-slate-300">|</span>
            <span>AI Hotel & Hostel Platform</span>
          </div>

          <p className="text-center md:text-right">
            © {new Date().getFullYear()} Smart HMS. Designed with modern 3D glassmorphic aesthetics. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ---------------- Floating AI Chatbot Widget (Always Available) ---------------- */}
      <ChatWidget />
    </div>
  );
}
