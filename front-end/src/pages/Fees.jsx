import { useState, useEffect } from 'react';
import { getInvoices, createInvoice, recordPayment, getFeeHeads } from '../api';
import Modal from '../components/Modal';
import {
  Receipt,
  Plus,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Settings2,
  Building2,
  Wallet,
  Smartphone,
  Banknote,
  ShieldCheck,
  Check,
  Search,
  Filter
} from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'JazzCash',
    name: 'JazzCash',
    subtitle: 'Mobile Wallet / Instant',
    color: 'from-amber-600 via-rose-600 to-amber-700',
    accent: '#d97706',
    icon: Smartphone,
    accountNo: '0300-1234567 (Hostel Admin)',
  },
  {
    id: 'Easypaisa',
    name: 'Easypaisa',
    subtitle: 'Telenor Bank Instant Transfer',
    color: 'from-emerald-600 via-teal-600 to-emerald-700',
    accent: '#059669',
    icon: Wallet,
    accountNo: '0345-9876543 (HMS Billing)',
  },
  {
    id: 'Bank Transfer',
    name: 'Bank Transfer (HBL / Meezan)',
    subtitle: 'Direct Interbank Raast / IBAN',
    color: 'from-blue-600 via-indigo-700 to-purple-800',
    accent: '#4f46e5',
    icon: Building2,
    accountNo: 'PK89MEZN0001234567890123',
  },
  {
    id: 'Cash',
    name: 'Cash at Counter',
    subtitle: 'Warden Desk Physical Receipt',
    color: 'from-slate-700 via-slate-800 to-zinc-900',
    accent: '#334155',
    icon: Banknote,
    accountNo: 'Cashier Counter 1, Ground Floor',
  },
  {
    id: 'Card / POS',
    name: 'Credit / Debit Card',
    subtitle: 'Visa / MasterCard / UnionPay',
    color: 'from-purple-600 via-violet-700 to-indigo-900',
    accent: '#7c3aed',
    icon: CreditCard,
    accountNo: 'Hostel Terminal POS #4421',
  },
];

const defaultDemoInvoices = [
  {
    _id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    resident: { name: 'Ali Raza', room: '101' },
    feeType: 'Hostel Rent (Nov 2026)',
    amount: 15000,
    dueDate: '2026-11-10',
    status: 'paid',
    paidAt: '2026-11-05',
    method: 'JazzCash',
  },
  {
    _id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    resident: { name: 'Hamza Tariq', room: '102' },
    feeType: 'Hostel Rent (Nov 2026)',
    amount: 15000,
    dueDate: '2026-11-10',
    status: 'unpaid',
  },
  {
    _id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    resident: { name: 'Zainab Bibi', room: '201' },
    feeType: 'Mess Charges (Nov 2026)',
    amount: 8500,
    dueDate: '2026-11-05',
    status: 'overdue',
  },
  {
    _id: 'inv-4',
    invoiceNumber: 'INV-2026-004',
    resident: { name: 'Bilal Ahmed', room: '204' },
    feeType: 'Security Deposit (Refundable)',
    amount: 20000,
    dueDate: '2026-11-15',
    status: 'paid',
    paidAt: '2026-11-02',
    method: 'Bank Transfer',
  },
  {
    _id: 'inv-5',
    invoiceNumber: 'INV-2026-005',
    resident: { name: 'Saad Malik', room: '301' },
    feeType: 'Hostel Rent (Nov 2026)',
    amount: 12000,
    dueDate: '2026-11-10',
    status: 'unpaid',
  },
];

export default function Fees() {
  const [invoices, setInvoices] = useState(defaultDemoInvoices);
  const [feeHeads, setFeeHeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isDefaultMethodModalOpen, setIsDefaultMethodModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Default Payment & Fee Method state (persisted)
  const [defaultMethod, setDefaultMethod] = useState(() => {
    return localStorage.getItem('hms_default_fee_method') || 'JazzCash';
  });

  const [defaultFeeConfig, setDefaultFeeConfig] = useState(() => {
    const saved = localStorage.getItem('hms_default_fee_config');
    return saved
      ? JSON.parse(saved)
      : {
          defaultRentAmount: 15000,
          defaultDueDay: 10,
          gracePeriodDays: 5,
          feeHead: 'Hostel Rent',
          currency: 'PKR',
          accountTitle: 'Smart Hostel Operations',
        };
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: defaultMethod,
    transactionRef: '',
    remarks: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    residentName: '',
    roomNo: '',
    amount: defaultFeeConfig.defaultRentAmount.toString(),
    feeType: defaultFeeConfig.feeHead,
    dueDate: '',
  });

  const [savedBannerToast, setSavedBannerToast] = useState(false);

  const fetchData = async () => {
    try {
      const [resInv, resHeads] = await Promise.allSettled([getInvoices(), getFeeHeads()]);
      if (resInv.status === 'fulfilled' && resInv.value?.data?.data) {
        const raw = resInv.value.data.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.invoices)
          ? raw.invoices
          : [];
        if (list.length > 0) {
          setInvoices(list);
        }
      }

      if (resHeads.status === 'fulfilled' && resHeads.value?.data?.data) {
        const headsRaw = resHeads.value.data.data;
        if (Array.isArray(headsRaw)) setFeeHeads(headsRaw);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectDefaultMethod = (methodId) => {
    setDefaultMethod(methodId);
    localStorage.setItem('hms_default_fee_method', methodId);
    setPaymentForm((prev) => ({ ...prev, paymentMethod: methodId }));
    setSavedBannerToast(true);
    setTimeout(() => setSavedBannerToast(false), 3000);
  };

  const handleSaveDefaultConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('hms_default_fee_config', JSON.stringify(defaultFeeConfig));
    setIsDefaultMethodModalOpen(false);
    setSavedBannerToast(true);
    setTimeout(() => setSavedBannerToast(false), 3000);
  };

  const handleOpenPay = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: invoice.amount,
      paymentMethod: defaultMethod, // Pre-select configured default payment method!
      transactionRef: '',
      remarks: '',
    });
    setIsPayModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await recordPayment(selectedInvoice._id, paymentForm);
      setIsPayModalOpen(false);
      fetchData();
    } catch (err) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === selectedInvoice._id
            ? {
                ...inv,
                status: 'paid',
                paidAt: new Date().toISOString().split('T')[0],
                method: paymentForm.paymentMethod,
              }
            : inv
        )
      );
      setIsPayModalOpen(false);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await createInvoice(invoiceForm);
      setIsInvoiceModalOpen(false);
      fetchData();
    } catch (err) {
      const newInv = {
        _id: 'inv-' + Date.now(),
        invoiceNumber: 'INV-2026-' + Math.floor(100 + Math.random() * 900),
        resident: { name: invoiceForm.residentName, room: invoiceForm.roomNo },
        feeType: invoiceForm.feeType,
        amount: Number(invoiceForm.amount),
        dueDate: invoiceForm.dueDate,
        status: 'unpaid',
      };
      setInvoices([newInv, ...invoices]);
      setIsInvoiceModalOpen(false);
    }
  };

  const safeInvoices = Array.isArray(invoices) ? invoices : defaultDemoInvoices;

  const totalCollected = safeInvoices
    .filter((i) => i && i.status === 'paid')
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalPending = safeInvoices
    .filter((i) => i && (i.status === 'unpaid' || i.status === 'overdue'))
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const activeMethodObj =
    PAYMENT_METHODS.find((m) => m.id === defaultMethod) || PAYMENT_METHODS[0];

  const filteredInvoices = safeInvoices.filter((inv) => {
    if (!inv) return false;
    const rName = inv.resident?.name || inv.residentName || '';
    const rRoom = inv.resident?.room || inv.roomNo || '';
    const invNo = inv.invoiceNumber || '';
    const matchesSearch =
      rName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rRoom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || (inv.status && inv.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-7 pb-10">
      {/* 3D Toast Notification for Default Method Change */}
      {savedBannerToast && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className="card-depth-3d bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-emerald-400/40">
            <ShieldCheck size={22} className="text-emerald-200" />
            <div>
              <p className="text-sm font-bold">Default Method Updated!</p>
              <p className="text-xs text-emerald-100">
                Primary hostel fee collection is now set to <b>{defaultMethod}</b>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with 3D Depth */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.35)] transform-gpu hover:rotate-6 transition">
              <Receipt size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                Fee & Financial Management
                <span className="pill-3d bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 border border-indigo-200/60">
                  3D Glass Engine
                </span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Hostel billing, default payment gateway rules, instant receipts & reconciliations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDefaultMethodModalOpen(true)}
            className="btn-3d btn-3d-slate px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Settings2 size={16} className="text-slate-600" />
            Configure Defaults
          </button>
          <button
            onClick={() => {
              setInvoiceForm({
                residentName: '',
                roomNo: '',
                amount: defaultFeeConfig.defaultRentAmount.toString(),
                feeType: defaultFeeConfig.feeHead,
                dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
              });
              setIsInvoiceModalOpen(true);
            }}
            className="btn-3d btn-3d-indigo px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus size={16} />
            Generate New Invoice
          </button>
        </div>
      </div>

      {/* 3D FEATURE: DEFAULT HOSTEL FEE METHOD SPOTLIGHT CARD */}
      <div className="card-depth-3d bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-7 relative overflow-hidden border border-slate-700/60">
        {/* Holographic background sheen */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Interactive 3D Payment Card */}
          <div className="lg:col-span-5">
            <div className="group relative perspective-1000">
              <div
                className={`w-full h-52 rounded-2xl bg-gradient-to-tr ${activeMethodObj.color} p-5 flex flex-col justify-between shadow-[0_20px_35px_-5px_rgba(0,0,0,0.5)] border border-white/20 transform-gpu transition-all duration-300 group-hover:rotate-1 group-hover:-translate-y-2`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Specular Line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-2xl" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="pill-3d bg-white/20 text-white text-[11px] px-2.5 py-0.5 backdrop-blur-md border border-white/30">
                      ★ Active Default Fee Method
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <activeMethodObj.icon size={20} className="text-white drop-shadow" />
                  </div>
                </div>

                {/* EMV 3D Metallic Chip & Hologram */}
                <div className="flex items-center gap-4 my-2">
                  <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-inner flex flex-col justify-around p-1">
                    <div className="h-0.5 bg-amber-700/60 w-full" />
                    <div className="h-0.5 bg-amber-700/60 w-full" />
                  </div>
                  <div className="font-mono text-xs tracking-widest text-white/80">
                    {activeMethodObj.id === 'JazzCash' && 'JC-PK • 0300 •••• 567'}
                    {activeMethodObj.id === 'Easypaisa' && 'EP-PK • 0345 •••• 543'}
                    {activeMethodObj.id === 'Bank Transfer' && 'HBL-IBAN •••• 90123'}
                    {activeMethodObj.id === 'Cash' && 'CASHIER-DESK • FL-01'}
                    {activeMethodObj.id === 'Card / POS' && '•••• •••• •••• 4421'}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                      Account / Routing
                    </p>
                    <p className="text-xs font-mono font-bold text-white tracking-wide truncate max-w-[200px]">
                      {activeMethodObj.accountNo}
                    </p>
                    <p className="text-[11px] text-white/90 font-medium mt-0.5">
                      {defaultFeeConfig.accountTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black tracking-tight text-white drop-shadow">
                      {activeMethodObj.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant 3D Method Switcher & Quick Settings */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400" />
                  Select Default Hostel Collection Method
                </h3>
                <p className="text-xs text-slate-300">
                  Pre-selected during student admissions, routine bill generation, and portal payments.
                </p>
              </div>
              <span className="hidden sm:inline-flex text-[11px] text-emerald-400 font-semibold items-center gap-1 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <Check size={12} /> Auto-Applied
              </span>
            </div>

            {/* 3D Method Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = defaultMethod === method.id;
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handleSelectDefaultMethod(method.id)}
                    className={`card-depth-3d text-left p-3 rounded-xl transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-400 ring-2 ring-indigo-400/50 shadow-[0_8px_20px_rgba(79,70,229,0.4)]'
                        : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700/80 hover:border-slate-500'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow">
                        ✓
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-white/20' : 'bg-slate-700'
                        }`}
                      >
                        <IconComponent size={14} className={isSelected ? 'text-white' : 'text-slate-300'} />
                      </div>
                      <span className="text-xs font-bold truncate">{method.name.split(' ')[0]}</span>
                    </div>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {method.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Default Parameters bar */}
            <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <span>
                  Default Monthly Rent:{' '}
                  <strong className="text-white font-mono">
                    PKR {defaultFeeConfig.defaultRentAmount.toLocaleString()}
                  </strong>
                </span>
                <span>
                  Due Day:{' '}
                  <strong className="text-white font-mono">{defaultFeeConfig.defaultDueDay}th</strong> of month
                </span>
              </div>
              <button
                onClick={() => setIsDefaultMethodModalOpen(true)}
                className="text-xs text-indigo-300 hover:text-white underline flex items-center gap-1 font-semibold"
              >
                Modify Fee Rules →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D KPI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-depth-3d p-5 rounded-2xl flex items-center justify-between group">
          <div>
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Total Invoiced
            </div>
            <div className="text-2xl font-black text-slate-800 mt-1 tracking-tight">
              PKR {(totalCollected + totalPending).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Receipt size={13} className="text-indigo-500" />
              {invoices.length} invoices generated this cycle
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-[0_8px_18px_rgba(79,70,229,0.35)] transform-gpu group-hover:scale-110 group-hover:rotate-3 transition">
            <Receipt size={26} />
          </div>
        </div>

        <div className="card-depth-3d p-5 rounded-2xl flex items-center justify-between group">
          <div>
            <div className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
              Collected Revenue
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">
              PKR {totalCollected.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
              <CheckCircle size={13} />
              Default collection on track
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-[0_8px_18px_rgba(16,185,129,0.35)] transform-gpu group-hover:scale-110 group-hover:rotate-3 transition">
            <CreditCard size={26} />
          </div>
        </div>

        <div className="card-depth-3d p-5 rounded-2xl flex items-center justify-between group">
          <div>
            <div className="text-xs uppercase font-extrabold text-rose-500 tracking-wider">
              Outstanding / Overdue
            </div>
            <div className="text-2xl font-black text-rose-600 mt-1 tracking-tight">
              PKR {totalPending.toLocaleString()}
            </div>
            <div className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-semibold">
              <AlertCircle size={13} />
              {invoices.filter((i) => i.status !== 'paid').length} pending resident payments
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-[0_8px_18px_rgba(244,63,94,0.35)] transform-gpu group-hover:scale-110 group-hover:rotate-3 transition">
            <Clock size={26} />
          </div>
        </div>
      </div>

      {/* Filter and Invoices Table with 3D Depth */}
      <div className="card-depth-3d overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Invoices & Student Ledgers</h2>
            <p className="text-xs text-slate-500">
              Tracking all fees with real-time settlement & default method tagging
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search resident, room, inv #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs w-48 sm:w-60"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              {['all', 'paid', 'unpaid', 'overdue'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-2.5 py-1 rounded-lg capitalize font-semibold transition ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Fee Head</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-indigo-50/30 transition group">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                      {inv.invoiceNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">
                      {inv.resident?.name || inv.residentName || 'Resident'}
                    </div>
                    <div className="text-xs text-slate-400">
                      Room {inv.resident?.room || inv.roomNo || '101'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>{inv.feeType}</span>
                      {inv.feeType.includes('Rent') && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          Monthly
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-800">
                    PKR {Number(inv.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`pill-3d px-2.5 py-1 text-xs font-bold capitalize ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'overdue'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => handleOpenPay(inv)}
                        className="btn-3d btn-3d-indigo text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <CreditCard size={13} />
                        Collect ({defaultMethod})
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-600 font-bold">
                        <CheckCircle size={15} />
                        <span>Paid via {inv.method || defaultMethod}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: COLLECT PAYMENT (With Default Method Highlight) */}
      {isPayModalOpen && (
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title={`Collect Payment • ${selectedInvoice?.invoiceNumber}`}
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="p-3.5 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Paying Resident</p>
                <p className="text-sm font-bold text-slate-800">
                  {selectedInvoice?.resident?.name || selectedInvoice?.residentName}
                </p>
                <p className="text-xs text-indigo-600 font-medium">
                  Room {selectedInvoice?.resident?.room || selectedInvoice?.roomNo} • {selectedInvoice?.feeType}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Invoice Amount</p>
                <p className="text-base font-black text-slate-800">
                  PKR {Number(selectedInvoice?.amount).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount Received (PKR)
              </label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Payment Method</label>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  (Default: {defaultMethod})
                </span>
              </div>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.id === defaultMethod ? '★ (Hostel Default)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Transaction ID / Receipt Reference
              </label>
              <input
                type="text"
                placeholder="e.g. TID-982189421 or Bank Slip #091"
                value={paymentForm.transactionRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-3d btn-3d-emerald px-5 py-2 text-xs flex items-center gap-1.5">
                <CheckCircle size={15} /> Confirm & Mark Paid
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: GENERATE INVOICE */}
      {isInvoiceModalOpen && (
        <Modal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          title="Generate New Hostel Invoice"
        >
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Resident Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ali Raza"
                value={invoiceForm.residentName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, residentName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101"
                  value={invoiceForm.roomNo}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, roomNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fee Type</label>
                <select
                  value={invoiceForm.feeType}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, feeType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Hostel Rent">Hostel Rent (Default)</option>
                  <option value="Mess Charges">Mess Charges</option>
                  <option value="Security Deposit">Security Deposit</option>
                  <option value="Electricity / AC Dues">Electricity / AC Dues</option>
                  <option value="Late Return Fine">Late Return Fine</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  required
                  placeholder="15000"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-3d btn-3d-indigo px-5 py-2 text-xs">
                Create Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: CONFIGURE DEFAULT HOSTEL FEE RULES */}
      {isDefaultMethodModalOpen && (
        <Modal
          isOpen={isDefaultMethodModalOpen}
          onClose={() => setIsDefaultMethodModalOpen(false)}
          title="Configure Hostel Default Fee & Payment Rules"
        >
          <form onSubmit={handleSaveDefaultConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Payment Gateway / Method
              </label>
              <select
                value={defaultMethod}
                onChange={(e) => setDefaultMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.subtitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Rent Rate (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={defaultFeeConfig.defaultRentAmount}
                  onChange={(e) =>
                    setDefaultFeeConfig({
                      ...defaultFeeConfig,
                      defaultRentAmount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Due Day (1-28)
                </label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  required
                  value={defaultFeeConfig.defaultDueDay}
                  onChange={(e) =>
                    setDefaultFeeConfig({
                      ...defaultFeeConfig,
                      defaultDueDay: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Title / Hostel Billing Name
              </label>
              <input
                type="text"
                required
                value={defaultFeeConfig.accountTitle}
                onChange={(e) =>
                  setDefaultFeeConfig({
                    ...defaultFeeConfig,
                    accountTitle: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDefaultMethodModalOpen(false)}
                className="btn-3d btn-3d-slate px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-3d btn-3d-indigo px-5 py-2 text-xs">
                Save & Apply Defaults
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
