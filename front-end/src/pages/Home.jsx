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

const CITIES = {
  jamshoro: {
    id: 'jamshoro',
    name: 'Jamshoro',
    tagline: 'MUET, University of Sindh & LUMHS Campus Hub',
    featuredBadge: 'Featured Campus • Rs. 12,000 Base',
    rates: {
      single: 16000,
      double: 12000, // Explicitly requested Rs. 12,000
      triple: 9500,
      dormitory: 7500
    },
    deposit: 10000,
    mess: 4500,
    campuses: ['MUET Main Campus', 'Sindh University Colony', 'LUMHS Medical Enclave']
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad',
    tagline: 'Qasimabad, Auto-Bhan Road & Latifabad Units',
    featuredBadge: 'Central Sindh Hub',
    rates: {
      single: 18000,
      double: 14000,
      triple: 11000,
      dormitory: 8500
    },
    deposit: 12000,
    mess: 4800,
    campuses: ['Qasimabad Phase 1', 'Auto-Bhan Commercial', 'Wadhu Wah Road']
  },
  karachi: {
    id: 'karachi',
    name: 'Karachi',
    tagline: 'NED, Karachi University, IBA & FAST Corridors',
    featuredBadge: 'Metropolitan Campus',
    rates: {
      single: 24000,
      double: 18000,
      triple: 14000,
      dormitory: 10000
    },
    deposit: 15000,
    mess: 5500,
    campuses: ['University Road / NED Gate', 'Gulshan Block 7', 'Malir Cantt Station']
  },
  islamabad: {
    id: 'islamabad',
    name: 'Islamabad',
    tagline: 'NUST Sector H-12, COMSATS & FAST Corridors',
    featuredBadge: 'Capital Executive Hub',
    rates: {
      single: 26000,
      double: 20000,
      triple: 15000,
      dormitory: 11000
    },
    deposit: 18000,
    mess: 6000,
    campuses: ['Sector H-12 Gate 4', 'Sector I-8 / FAST', 'Park Road / COMSATS']
  },
  lahore: {
    id: 'lahore',
    name: 'Lahore',
    tagline: 'Johar Town, UET, Punjab University & FAST Belt',
    featuredBadge: 'Cultural Academic Hub',
    rates: {
      single: 22000,
      double: 16000,
      triple: 12500,
      dormitory: 9000
    },
    deposit: 14000,
    mess: 5000,
    campuses: ['Johar Town / UMT', 'Canal Road / PU', 'GT Road / UET']
  }
};

const BASE_ROOMS = [
  {
    id: 'single-deluxe',
    title: 'Single Deluxe AC',
    type: 'single',
    floor: 'Floor 1',
    vacantBeds: 1,
    capacity: 1,
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
    tag: 'Budget Friendly',
    description: 'Spacious triple room with wide sunlit balcony, individual lockers, and full dining access.',
    amenities: ['Large Sunlit Balcony', 'Three Individual Lockers', 'Ceiling Fans & Windows', 'Full Mess Plan Available'],
    highlight: false
  },
  {
    id: 'dormitory-suite',
    title: 'Dormitory Quad Suite',
    type: 'dormitory',
    floor: 'Floor 4',
    vacantBeds: 4,
    capacity: 4,
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
    desc: 'Dual-band high-speed internet throughout all rooms and study lounges with 99.9% uptime.'
  },
  {
    icon: Utensils,
    title: '3-Meal Hygienic Mess',
    desc: 'Nutritious breakfast, lunch, and dinner prepared in verified campus kitchens.'
  },
  {
    icon: Camera,
    title: '24/7 CCTV & Security',
    desc: 'Biometric turnstiles, full perimeter monitoring, and round-the-clock guarded gates.'
  },
  {
    icon: Shirt,
    title: 'Automatic Laundromat',
    desc: 'Commercial washing machines and dedicated steam ironing stations on ground floor.'
  },
  {
    icon: BookOpen,
    title: 'Silent Study Library',
    desc: 'Air-conditioned silent pods equipped with power sockets and reading lights.'
  },
  {
    icon: Dumbbell,
    title: 'Gym & Game Lounge',
    desc: 'Cardio equipment, weights, table tennis, and lounge sofas for student downtime.'
  }
];

const FAQS = [
  {
    q: 'What is the rate for Jamshoro campus?',
    a: 'In Jamshoro (near MUET, Sindh University & LUMHS), Double Sharing rooms are priced at Rs. 12,000 / month. Single Deluxe AC rooms are Rs. 16,000 / month, and Triple Sharing is Rs. 9,500 / month. Mess dining is Rs. 4,500 / month.'
  },
  {
    q: 'Do other cities have different rates?',
    a: 'Yes, rates are customized per city based on local real-estate and utility costs: Jamshoro (Rs. 12,000/mo), Hyderabad (Rs. 14,000/mo), Karachi (Rs. 18,000/mo), Islamabad (Rs. 20,000/mo), and Lahore (Rs. 16,000/mo) for Double Sharing.'
  },
  {
    q: 'What is the night gate curfew rule?',
    a: 'For student security, the main entrance gate closes strictly at 10:00 PM every evening. Late returns require advance digital approval via the Warden Gate Pass system.'
  },
  {
    q: 'Is the security deposit refundable in Rs.?',
    a: 'Yes, the one-time security deposit (Rs. 10,000 in Jamshoro) is 100% refundable upon semester completion, room clearance, and handover.'
  }
];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('jamshoro'); // Default Jamshoro
  const [selectedType, setSelectedType] = useState('all');
  const [searchBranch, setSearchBranch] = useState('jamshoro');
  const [searchType, setSearchType] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const currentCity = CITIES[selectedCity] || CITIES.jamshoro;

  const [interactiveMsg, setInteractiveMsg] = useState('');
  const [interactiveChat, setInteractiveChat] = useState([
    {
      role: 'user',
      text: 'What are the hostel rates in Jamshoro?'
    },
    {
      role: 'assistant',
      text: 'In Jamshoro, our popular Double Sharing room is Rs. 12,000 / month! Single Deluxe AC is Rs. 16,000, and Triple Sharing is Rs. 9,500. Mess is Rs. 4,500/month with breakfast, lunch, and dinner.'
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
    let reply = '';
    if (question.includes('Jamshoro') || question.includes('rate') || question.includes('12000') || question.includes('fee')) {
      reply = `In Jamshoro, Double Sharing is Rs. 12,000/month, Single Deluxe is Rs. 16,000/month, and Triple Sharing is Rs. 9,500/month. Other cities have tailored rates (Hyderabad: Rs. 14,000, Karachi: Rs. 18,000, Islamabad: Rs. 20,000, Lahore: Rs. 16,000). Mess fee is Rs. 4,500/month and refundable security deposit is Rs. 10,000.`;
    } else if (question.includes('curfew')) {
      reply = 'The night gate curfew is strictly 10:00 PM every evening across all hostel campuses for student safety. Visiting hours are 4:00 PM – 9:00 PM.';
    } else {
      reply = 'You can submit an admission application online or visit the warden office at your campus for physical room inspection.';
    }

    setInteractiveChat((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text: reply }
    ]);
  };

  const filteredRooms = BASE_ROOMS.filter((r) => {
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
                  Pakistan
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Hostel Management System
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#city-pricing" className="hover:text-[#e5192d] transition-colors flex items-center gap-1.5">
              <MapPin size={14} className="text-[#e5192d]" />
              City Rates
            </a>
            <a href="#rooms" className="hover:text-[#e5192d] transition-colors">
              Rooms & Beds
            </a>
            <a href="#facilities" className="hover:text-[#e5192d] transition-colors">
              Facilities
            </a>
            <a href="#ai-demo" className="hover:text-[#e5192d] transition-colors flex items-center gap-1">
              AI Concierge
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5192d] animate-ping" />
            </a>
            <a href="#faq" className="hover:text-[#e5192d] transition-colors">
              FAQ & Rules
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
              onClick={() => openFloatingChat('What are the room rates in Jamshoro?')}
              className="px-5 py-2.5 rounded-full bg-[#e5192d] hover:bg-[#cf1325] text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(229,25,45,0.35)] hover:shadow-[0_6px_20px_rgba(229,25,45,0.5)] transition-all active:scale-95"
            >
              <Sparkles size={14} className="text-white" />
              <span>Ask AI (Rs.)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO SECTION (Quentis & Behance Style) ---------------- */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
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
                Connect guests and university students with real-time bed vacancies, transparent monthly rates in <strong>Rs.</strong> across Jamshoro, Hyderabad, Karachi, Islamabad & Lahore.
              </p>

              {/* Primary Call to Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openFloatingChat('What rooms are available in Jamshoro for Rs. 12,000?')}
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
                  Jamshoro from Rs. 12,000/mo
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
                  onClick={() => openFloatingChat('Show me Jamshoro rooms and rates in Rs.')}
                />
              </div>
            </div>

          </div>

          {/* ---------------- Booking Quick Search Filter Bar (with City Selection) ---------------- */}
          <div className="mt-16 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              
              {/* Select City / Hub */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#e5192d]" />
                  Select City & Campus
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSearchBranch(e.target.value);
                  }}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="jamshoro">Jamshoro (Rs. 12,000 Base - MUET / Sindh Univ)</option>
                  <option value="hyderabad">Hyderabad (Rs. 14,000 Base - Qasimabad)</option>
                  <option value="karachi">Karachi (Rs. 18,000 Base - NED / KU / IBA)</option>
                  <option value="islamabad">Islamabad (Rs. 20,000 Base - NUST / COMSATS)</option>
                  <option value="lahore">Lahore (Rs. 16,000 Base - UET / Johar Town)</option>
                </select>
              </div>

              {/* Room Category */}
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
                  <option value="all">All Room Categories</option>
                  <option value="single">Single Deluxe AC</option>
                  <option value="double">Double Sharing (Rs. {currentCity.rates.double.toLocaleString()})</option>
                  <option value="triple">Triple Sharing</option>
                  <option value="dormitory">Dormitory Suite</option>
                </select>
              </div>

              {/* Price Range Filter in Rs. */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5">
                  <CreditCard size={13} className="text-[#e5192d]" />
                  Monthly Budget (in Rs.)
                </label>
                <select className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer">
                  <option value="all">Any Budget in Rs.</option>
                  <option value="budget">Under Rs. 10,000 / month</option>
                  <option value="mid">Rs. 10,000 – Rs. 15,000 / month</option>
                  <option value="deluxe">Rs. 15,000+ / month (AC Deluxe)</option>
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
                <span>Filter Rooms ({currentCity.name})</span>
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------- Live Metrics & Proof Bar (in Rs.) ---------------- */}
      <section className="py-10 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#ff4155]">Rs. 12,000</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Jamshoro Base Sharing Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">5 Cities</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Customized City Rates</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">&lt; 1s</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Live DB Sync</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">4.9 ★</p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Resident Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- City Rates Selector & Interactive Showcase ---------------- */}
      <section id="city-pricing" className="py-16 bg-gradient-to-b from-white to-[#fafafa] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
              MULTI-CITY CAMPUS PRICING
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Select Your City for Transparent Rates
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every city features tailored rates based on university location and facilities. Jamshoro is benchmarked at <strong>Rs. 12,000 / month</strong>.
            </p>
          </div>

          {/* City Selection Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {Object.values(CITIES).map((c) => {
              const isSelected = selectedCity === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c.id)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#e5192d] text-white border-[#e5192d] shadow-[0_8px_20px_rgba(229,25,45,0.35)] scale-105'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <MapPin size={15} className={isSelected ? 'text-white' : 'text-[#e5192d]'} />
                  <span>{c.name}</span>
                  {c.id === 'jamshoro' && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${isSelected ? 'bg-white text-[#e5192d]' : 'bg-rose-50 text-[#e5192d]'}`}>
                      Rs. 12,000
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current City Highlight Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">{currentCity.name} Campus Hub</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {currentCity.featuredBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentCity.tagline}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Utensils size={14} className="text-[#e5192d]" />
                Mess: Rs. {currentCity.mess.toLocaleString()}/mo
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Deposit: Rs. {currentCity.deposit.toLocaleString()} (Refundable)
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- Available Rooms Showcase (Updated with Dynamic City Rates in Rs.) ---------------- */}
      <section id="rooms" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
                ROOMS IN {currentCity.name.toUpperCase()}
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mt-1">
                Live Bed Vacancies & Rates (in Rs.)
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
            {filteredRooms.map((room) => {
              const priceInRs = currentCity.rates[room.type] || 12000;
              return (
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
                      <span className="text-2xl font-black text-slate-900">
                        Rs. {priceInRs.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold"> / mo</span>
                    </div>
                    <button
                      onClick={() => openFloatingChat(`Tell me about the ${room.title} in ${currentCity.name} for Rs. ${priceInRs.toLocaleString()}.`)}
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
              );
            })}
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

      {/* ---------------- Interactive Live Chat Showcase Section (in Rs.) ---------------- */}
      <section id="ai-demo" className="py-20 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#e5192d] text-xs font-black uppercase tracking-wider">
              <Zap size={14} />
              Real-Time Verification Engine
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Test AI with Jamshoro & City Rates
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Unlike generic bots, our assistant answers strictly from live MongoDB records in <strong>Rs.</strong> with full awareness of Jamshoro, Hyderabad, Karachi, Islamabad & Lahore pricing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Quick Prompt Selectors */}
            <div className="md:col-span-5 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Click a question to test live:
              </p>

              {[
                'What are the hostel rates in Jamshoro?',
                'Why is Jamshoro Double Sharing Rs. 12,000?',
                'What is the night gate curfew rule?',
                'What are the mess charges and deposit in Rs.?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInteractiveAsk(q)}
                  className="w-full text-left p-4 rounded-2xl bg-[#fafafa] hover:bg-rose-50/70 border border-slate-200/80 hover:border-rose-200 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#e5192d] transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
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
                  Safe By Design (PKR Currency)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automatic PII scrubber masks credit cards, phone numbers, and emails before saving conversations to training logs.
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
                      Gemini 3.5 Flash Active (PKR / Rs.)
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
                  placeholder="Ask about Jamshoro Rs. 12,000 or city rates…"
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

      {/* ---------------- Hostel FAQ Accordion (in Rs.) ---------------- */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e5192d]">
              COMMONLY ASKED QUESTIONS
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Hostel Policies & Rates FAQ
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
            Jamshoro & Across Pakistan
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Book Your Room with <br />
            <span className="text-[#ff3b4f]">Verified City Rates in Rs.</span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            From MUET & Sindh University in Jamshoro to premier universities across Karachi, Lahore & Islamabad, Smart HMS ensures instant, accurate room bookings.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <button
              onClick={() => openFloatingChat('How can I book a room in Jamshoro for Rs. 12,000?')}
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
            <span>Pakistan (Jamshoro, Hyderabad, Karachi, Islamabad, Lahore)</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#city-pricing" className="hover:text-[#e5192d]">City Rates</a>
            <a href="#rooms" className="hover:text-[#e5192d]">Rooms in Rs.</a>
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
