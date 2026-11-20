import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Search,
  Wifi,
  Utensils,
  Camera,
  Shirt,
  BookOpen,
  Dumbbell,
  Check,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  ChevronDown
} from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

const ROOM_DATA = [
  {
    id: 'single-deluxe',
    title: 'Single Deluxe AC',
    type: 'single',
    floor: 'Floor 1',
    vacantBeds: 1,
    capacity: 1,
    price: 8000,
    tag: 'Private & Quiet',
    description: 'Designed for focused academic study with private attached bath and high-speed fiber internet.',
    amenities: ['Private Study Desk', 'Attached Luxury Bath', 'Individual Air Conditioning', 'Personal Wardrobe'],
    highlight: false
  },
  {
    id: 'double-sharing',
    title: 'Double Sharing AC',
    type: 'double',
    floor: 'Floor 2',
    vacantBeds: 2,
    capacity: 2,
    price: 5000,
    tag: 'Most Popular',
    description: 'Dual-occupancy with personal workstations, premium ergonomic chairs, and shared balcony.',
    amenities: ['Two Single Orthopedic Beds', 'Individual Wardrobes', 'Air Conditioning & Fan', 'Attached Modern Bath'],
    highlight: true
  },
  {
    id: 'triple-sharing',
    title: 'Triple Sharing Standard',
    type: 'triple',
    floor: 'Floor 3',
    vacantBeds: 3,
    capacity: 3,
    price: 3500,
    tag: 'Budget Friendly',
    description: 'Spacious triple room with wide sunlit balcony, individual lockers, and full dining access.',
    amenities: ['Large Sunlit Balcony', 'Three Individual Lockers', 'Ceiling Fans & Windows', 'Full Mess Plan Included'],
    highlight: false
  },
  {
    id: 'dormitory-suite',
    title: 'Dormitory Quad Suite',
    type: 'dormitory',
    floor: 'Floor 4',
    vacantBeds: 4,
    capacity: 4,
    price: 2800,
    tag: 'Community Living',
    description: 'High-energy shared suite with personal bunk cubbies, charging docks, and study corners.',
    amenities: ['Bunk Beds with Privacy Curtains', 'Under-bed Storage Drawers', 'High-Speed Wi-Fi', 'Lounge Access'],
    highlight: false
  }
];

const FACILITIES = [
  {
    icon: Wifi,
    title: 'Gigabit Fiber Wi-Fi',
    desc: 'Dual-band Wi-Fi throughout all rooms and study lounges with 99.9% uptime.'
  },
  {
    icon: Utensils,
    title: '3-Meal Hygienic Mess',
    desc: 'Nutritious breakfast, lunch, and dinner prepared in ISO-certified kitchens.'
  },
  {
    icon: Camera,
    title: '24/7 CCTV & Security',
    desc: 'Biometric access control, full security coverage, and guarded main gates.'
  },
  {
    icon: Shirt,
    title: 'Automatic Laundromat',
    desc: 'Commercial washing machines and steam pressing stations on the ground floor.'
  },
  {
    icon: BookOpen,
    title: 'Silent Study Library',
    desc: 'Air-conditioned silent pods equipped with power sockets and reading lights.'
  },
  {
    icon: Dumbbell,
    title: 'Gym & Game Lounge',
    desc: 'Cardio equipment, weights, table tennis, and lounge sofas for downtime.'
  }
];

const FAQS = [
  {
    q: 'What is the night gate curfew rule?',
    a: 'For student security, the main entrance gate closes strictly at 10:00 PM every evening. Late returns require advance digital approval via the Warden Gate Pass system.'
  },
  {
    q: 'How does fee payment and invoicing work?',
    a: 'Invoices are issued monthly on the 1st with a 10-day grace period. Payments can be submitted directly through the portal via Bank Transfer, JazzCash, Easypaisa, or at the front desk.'
  },
  {
    q: 'Is the security deposit refundable?',
    a: 'Yes, the one-time $10,000 security deposit is 100% refundable upon completion of your semester clearance and room handover.'
  },
  {
    q: 'Can I choose my roommate or transfer rooms?',
    a: 'Roommate preferences can be submitted during online admission. Existing residents can submit an in-app room transfer request subject to bed availability.'
  }
];

export default function Home() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchBranch, setSearchBranch] = useState('all');
  const [searchType, setSearchType] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

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
            ? 'The night gate curfew is strictly 10:00 PM every evening for all residents. Visiting hours are 4:00 PM – 9:00 PM in common areas.'
            : question.includes('mess') || question.includes('fee')
            ? 'The monthly fee includes $5,000 room rent and $3,500 mess fee (breakfast, lunch, dinner). A refundable security deposit of $10,000 is collected upon check-in.'
            : 'You can submit an admission application online or visit the warden desk on the Ground Floor for room inspection.'
      }
    ]);
  };

  const filteredRooms = ROOM_DATA.filter((r) => {
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    if (searchType !== 'all' && r.type !== searchType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e5192d] selection:text-white relative overflow-hidden">
      {/* ---------------- Background Red Ribbon Ambient Accents ---------------- */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-rose-500/15 via-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-rose-500/10 via-red-500/5 to-transparent rounded-full blur-3xl pointer-events-none -ml-32" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-t from-red-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ---------------- Navigation Bar ---------------- */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
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
                Hostel Management System
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#rooms" className="hover:text-[#e5192d] transition-colors">
              Rooms & Rates
            </a>
            <a href="#facilities" className="hover:text-[#e5192d] transition-colors">
              Facilities
            </a>
            <a href="#how-it-works" className="hover:text-[#e5192d] transition-colors">
              How It Works
            </a>
            <a href="#ai-demo" className="hover:text-[#e5192d] transition-colors flex items-center gap-1">
              AI Concierge
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5192d] animate-ping" />
            </a>
            <a href="#faq" className="hover:text-[#e5192d] transition-colors">
              Hostel FAQ
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
              className="px-5 py-2.5 rounded-full bg-[#e5192d] hover:bg-[#cf1325] text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(229,25,45,0.35)] hover:shadow-[0_6px_20px_rgba(229,25,45,0.5)] transition-all active:scale-95"
            >
              <Sparkles size={14} className="text-white" />
              <span>Ask AI Bot</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION (Quentis & Behance Inspired) ---------------- */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-7 z-10">
              
              {/* Category Pill with Red Bar (exact like flyer: | AI CHATBOTS) */}
              <div className="inline-flex items-center gap-2.5">
                <span className="h-6 w-1.5 bg-[#e5192d] rounded-full inline-block" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-slate-900">
                  AI CHATBOTS
                </span>
              </div>

              {/* Main Typography Statement */}
              <div className="space-y-1">
                <h1 className="text-5xl sm:text-6xl xl:text-[76px] font-black uppercase tracking-tight leading-[0.93] text-slate-950 font-sans">
                  LET YOUR <br />
                  WEBSITE <br />
                  <span className="text-[#e5192d] italic">DO THE</span> <br />
                  <span className="text-[#e5192d]">TALKING.</span>
                </h1>
              </div>

              {/* Tagline / Subtitle */}
              <p className="text-xl sm:text-2xl font-medium text-slate-800 tracking-tight">
                Turn questions into conversations.
              </p>

              <p className="text-slate-500 text-sm sm:text-base max-w-lg leading-relaxed">
                Connect guests and students with real-time room vacancies, verified fee structures, and instant policy answers — powered by live MongoDB intelligence.
              </p>

              {/* Primary Call to Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openFloatingChat('What rooms are available right now?')}
                  className="group px-9 py-4 rounded-full bg-gradient-to-r from-[#e5192d] via-[#f01c30] to-[#ff2b3e] text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-3 shadow-[0_12px_32px_rgba(229,25,45,0.42)] hover:shadow-[0_16px_40px_rgba(229,25,45,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
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
                <span className="text-slate-900 tracking-widest uppercase font-black">afaque.co</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Verified Fact-Only Model
                </span>
              </div>
            </div>

            {/* Right Visual Column (Pristine 3D Glass Artwork from the Image) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[520px] aspect-square rounded-[36px] overflow-hidden shadow-[0_25px_80px_rgba(229,25,45,0.18)] border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/50 group">
                <img
                  src="/hero-3d-bot.jpg"
                  alt="3D Glassmorphic AI Chatbot Sculpture"
                  className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out cursor-pointer"
                  onClick={() => openFloatingChat('What rooms are available right now?')}
                />
              </div>
            </div>

          </div>

          {/* ---------------- Booking Quick Search Filter Bar (Behance Style) ---------------- */}
          <div className="mt-16 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              
              {/* Branch */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                  <Building2 size={13} className="text-[#e5192d]" />
                  Hostel Building
                </label>
                <select
                  value={searchBranch}
                  onChange={(e) => setSearchBranch(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Campuses & Branches</option>
                  <option value="sunrise">Sunrise Boys Hostel (Block A/B)</option>
                  <option value="pearl">Pearl Girls Hostel (Block C)</option>
                  <option value="central">Central Co-ed Executive</option>
                </select>
              </div>

              {/* Room Type */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                  <BedDouble size={13} className="text-[#e5192d]" />
                  Room Category
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Room Types</option>
                  <option value="single">Single Deluxe AC</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                  <option value="dormitory">Dormitory Suite</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                  <CreditCard size={13} className="text-[#e5192d]" />
                  Monthly Budget
                </label>
                <select className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer">
                  <option value="all">Any Monthly Budget</option>
                  <option value="budget">Under $4,000 / month</option>
                  <option value="mid">$4,000 – $6,000 / month</option>
                  <option value="luxury">$6,000+ / month (Deluxe)</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={() => {
                  document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-full min-h-[52px] px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Search size={15} />
                <span>Search Available Beds</span>
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------- Live Metrics & Proof Bar ---------------- */}
      <section className="py-10 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#ff4155]">99.8%</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">AI Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">2,400+</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Residents Managed</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">&lt; 1s</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Live DB Response</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">4.9 ★</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Campus Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Available Rooms Showcase (Behance Interactive Grid) ---------------- */}
      <section id="rooms" className="py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
                LIVE INVENTORY & SLOTS
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mt-1">
                Explore Student Rooms
              </h3>
            </div>

            {/* Room Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {['all', 'single', 'double', 'triple', 'dormitory'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                    selectedType === type
                      ? 'bg-[#e5192d] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {type === 'all' ? 'All Rooms' : `${type} Rooms`}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                  room.highlight
                    ? 'border-2 border-[#e5192d] bg-white shadow-[0_20px_45px_rgba(229,25,45,0.14)] relative'
                    : 'border border-slate-200 bg-[#fafafa] hover:border-[#e5192d]/50 hover:shadow-lg'
                }`}
              >
                {room.highlight && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#e5192d] text-white tracking-wider">
                    {room.tag}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {room.vacantBeds} Vacant Beds
                    </span>
                    <span className="text-xs font-bold text-slate-400">{room.floor}</span>
                  </div>

                  <h4 className="text-xl font-black text-slate-900 mb-1">{room.title}</h4>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">{room.description}</p>

                  <div className="space-y-2 text-xs text-slate-700 font-medium mb-6">
                    {room.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">${room.price}</span>
                    <span className="text-[11px] text-slate-400 font-semibold"> / mo</span>
                  </div>
                  <button
                    onClick={() => openFloatingChat(`Tell me about the ${room.title} vacancy and fee.`)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      room.highlight
                        ? 'bg-[#e5192d] hover:bg-[#d01325] text-white shadow-md'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------- Hostel Facilities & Amenities ---------------- */}
      <section id="facilities" className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
              CAMPUS LIVING STANDARDS
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              World-Class Amenities
            </h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Equipped with everything students need to excel academically and live comfortably with peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITIES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-rose-50 text-[#e5192d] flex items-center justify-center font-black mb-6 group-hover:scale-110 group-hover:bg-[#e5192d] group-hover:text-white transition-all">
                    <Icon size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{f.title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ---------------- How It Works (3 Step Journey) ---------------- */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
              SIMPLE ENROLLMENT
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              How Admission Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#fafafa] border border-slate-200/80 relative">
              <span className="text-5xl font-black text-slate-200/90 mb-4 block">01</span>
              <h4 className="text-lg font-black text-slate-900 mb-2">Explore & Check Vacancies</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Browse real-time bed vacancies across branches or ask our 24/7 AI Concierge to find matching rooms.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#fafafa] border border-slate-200/80 relative">
              <span className="text-5xl font-black text-rose-200 mb-4 block">02</span>
              <h4 className="text-lg font-black text-slate-900 mb-2">Digital Application & KYC</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Submit academic and guardian records, upload CNIC/Student ID, and verify bed assignment in minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#fafafa] border border-slate-200/80 relative">
              <span className="text-5xl font-black text-slate-200/90 mb-4 block">03</span>
              <h4 className="text-lg font-black text-slate-900 mb-2">Move In & Access Dashboard</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Collect your biometric keycard, view monthly meal menus, pay dues, and submit gate passes online.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------- Interactive Live Chat Showcase Section ---------------- */}
      <section id="ai-demo" className="py-20 bg-[#fafafa] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#e5192d] text-xs font-black uppercase tracking-wider">
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
                  className="w-full text-left p-4 rounded-2xl bg-white hover:bg-rose-50/70 border border-slate-200/80 hover:border-rose-200 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#e5192d] transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
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
            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xl flex flex-col h-[460px]">
              
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
                          : 'bg-slate-50 text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
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
                  className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#e5192d]"
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

      {/* ---------------- Hostel FAQ Accordion ---------------- */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
              COMMONLY ASKED QUESTIONS
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Hostel Policies & Answers
            </h3>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-[#fafafa] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#e5192d]' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
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

          <div className="flex items-center gap-6">
            <a href="#rooms" className="hover:text-[#e5192d]">Rooms</a>
            <a href="#facilities" className="hover:text-[#e5192d]">Facilities</a>
            <a href="#faq" className="hover:text-[#e5192d]">Policies</a>
            <Link to="/login" className="hover:text-[#e5192d]">Login</Link>
          </div>

          <p className="text-center md:text-right">
            © {new Date().getFullYear()} Smart HMS. Designed by Afaque Ahmed Mangi. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ---------------- Floating AI Chatbot Widget (Always Available) ---------------- */}
      <ChatWidget />
    </div>
  );
}
