import { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  DollarSign,
  Users,
  AlertCircle,
  BedDouble,
  BarChart3,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function Reports() {
  const [reportType, setReportType] = useState('defaulters');

  const defaultersList = [
    { name: 'Hamza Tariq', room: '102 (Block A)', phone: '0312-9876543', guardianPhone: '0313-1122334', invoiceNo: 'INV-2026-002', amountDue: 15000, daysOverdue: 8 },
    { name: 'Zainab Bibi', room: '201 (Block B)', phone: '0333-5566778', guardianPhone: '0334-9988776', invoiceNo: 'INV-2026-003', amountDue: 8500, daysOverdue: 13 },
  ];

  const collectionsList = [
    { period: 'November 2026', totalBilled: 1250000, collected: 980000, pending: 270000, rate: '78.4%' },
    { period: 'October 2026', totalBilled: 1250000, collected: 1210000, pending: 40000, rate: '96.8%' },
    { period: 'September 2026', totalBilled: 1200000, collected: 1190000, pending: 10000, rate: '99.1%' },
    { period: 'August 2026', totalBilled: 1150000, collected: 1150000, pending: 0, rate: '100%' },
  ];

  const occupancyList = [
    { block: 'Block A (Boys)', totalBeds: 60, occupied: 52, vacant: 6, maintenance: 2, rate: '86.6%' },
    { block: 'Block B (Boys)', totalBeds: 40, occupied: 35, vacant: 4, maintenance: 1, rate: '87.5%' },
    { block: 'Block C (Girls Wing)', totalBeds: 25, occupied: 22, vacant: 3, maintenance: 0, rate: '88.0%' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    alert('Exporting data as CSV / Excel format with 3D ledger tags...');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 3D Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(6,182,212,0.35)] transform-gpu hover:rotate-6 transition">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Operational & Audit Reports
              <span className="pill-3d bg-cyan-50 text-cyan-700 text-xs px-2.5 py-0.5 border border-cyan-200">
                3D Analytics
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Printable audit reports, fee defaulter summaries, and occupancy analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="btn-3d btn-3d-slate text-xs px-3.5 py-2 flex items-center gap-1.5 font-bold"
          >
            <Download size={14} /> Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="btn-3d btn-3d-indigo text-xs px-4 py-2 flex items-center gap-1.5 font-bold"
          >
            <Printer size={14} /> Print Report (PDF)
          </button>
        </div>
      </div>

      {/* 3D Report Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setReportType('defaulters')}
          className={`pill-3d px-4 py-2 text-xs font-bold border transition ${
            reportType === 'defaulters'
              ? 'bg-rose-600 text-white border-rose-700 shadow-[0_4px_12px_rgba(244,63,94,0.35)]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Fee Defaulters List
        </button>
        <button
          onClick={() => setReportType('collection')}
          className={`pill-3d px-4 py-2 text-xs font-bold border transition ${
            reportType === 'collection'
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-[0_4px_12px_rgba(79,70,229,0.35)]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Revenue & Collection Summary
        </button>
        <button
          onClick={() => setReportType('occupancy')}
          className={`pill-3d px-4 py-2 text-xs font-bold border transition ${
            reportType === 'occupancy'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.35)]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Block-wise Occupancy Audit
        </button>
      </div>

      {/* REPORT 1: DEFAULTERS */}
      {reportType === 'defaulters' && (
        <div className="card-depth-3d overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
            <h2 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm">
              <AlertCircle size={18} className="text-rose-600" /> Pending Fee Defaulters (Overdue &gt; 5 Days)
            </h2>
            <span className="pill-3d bg-rose-100 text-rose-800 font-extrabold text-xs px-3 py-1 border border-rose-200">
              Total Outstanding: PKR 23,500
            </span>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Room & Block</th>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Phone / Guardian</th>
                <th className="px-6 py-4">Overdue Days</th>
                <th className="px-6 py-4 font-bold text-rose-600">Amount Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {defaultersList.map((d, i) => (
                <tr key={i} className="hover:bg-rose-50/20 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{d.name}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">{d.room}</td>
                  <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-600">{d.invoiceNo}</td>
                  <td className="px-6 py-4 text-xs space-y-0.5">
                    <div>Student: {d.phone}</div>
                    <div className="text-slate-400">Guardian: {d.guardianPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="pill-3d bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-0.5 border border-rose-200">
                      {d.daysOverdue} days late
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-rose-600 text-base">
                    PKR {d.amountDue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT 2: REVENUE COLLECTION */}
      {reportType === 'collection' && (
        <div className="card-depth-3d overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-indigo-50/40">
            <h2 className="font-extrabold text-slate-800 text-sm">
              Monthly Revenue Generation & Collection Efficiency
            </h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Billing Month</th>
                <th className="px-6 py-4">Total Billed</th>
                <th className="px-6 py-4">Revenue Collected</th>
                <th className="px-6 py-4">Pending Dues</th>
                <th className="px-6 py-4 text-right">Recovery Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collectionsList.map((c, i) => (
                <tr key={i} className="hover:bg-indigo-50/20 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{c.period}</td>
                  <td className="px-6 py-4 font-medium">PKR {c.totalBilled.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">PKR {c.collected.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-rose-600">PKR {c.pending.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="pill-3d bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 text-xs font-black">
                      {c.rate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT 3: OCCUPANCY */}
      {reportType === 'occupancy' && (
        <div className="card-depth-3d overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-emerald-50/40">
            <h2 className="font-extrabold text-slate-800 text-sm">
              Hostel Block Occupancy & Capacity Utilization Audit
            </h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Hostel Wing / Block</th>
                <th className="px-6 py-4">Total Beds</th>
                <th className="px-6 py-4">Occupied</th>
                <th className="px-6 py-4">Vacant</th>
                <th className="px-6 py-4">Maintenance</th>
                <th className="px-6 py-4 text-right">Occupancy %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {occupancyList.map((o, i) => (
                <tr key={i} className="hover:bg-emerald-50/20 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{o.block}</td>
                  <td className="px-6 py-4 font-bold">{o.totalBeds}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">{o.occupied}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">{o.vacant}</td>
                  <td className="px-6 py-4 font-semibold text-amber-600">{o.maintenance}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="pill-3d bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-black">
                      {o.rate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
