import { useState } from 'react';
import { FileSpreadsheet, Download, Printer, Filter, DollarSign, Users, AlertCircle, BedDouble } from 'lucide-react';

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
    alert('Exporting data as CSV / Excel format...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-indigo-600" /> Operational & Audit Reports
          </h1>
          <p className="text-slate-500 text-sm">
            Generate printable audit reports, fee defaulter summaries, and occupancy analytics
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Download size={15} /> Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Printer size={15} /> Print Report (PDF)
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setReportType('defaulters')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            reportType === 'defaulters' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border'
          }`}
        >
          Fee Defaulters List
        </button>
        <button
          onClick={() => setReportType('collection')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            reportType === 'collection' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border'
          }`}
        >
          Revenue & Collection Summary
        </button>
        <button
          onClick={() => setReportType('occupancy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            reportType === 'occupancy' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border'
          }`}
        >
          Block-wise Occupancy Audit
        </button>
      </div>

      {/* REPORT 1: DEFAULTERS */}
      {reportType === 'defaulters' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-600" /> Pending Fee Defaulters (Overdue &gt; 5 Days)
            </h2>
            <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-1 rounded-lg">
              Total Outstanding: PKR 23,500
            </span>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Room & Block</th>
                <th className="px-6 py-4">Student Phone</th>
                <th className="px-6 py-4">Guardian Contact</th>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Amount Due</th>
                <th className="px-6 py-4">Overdue Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {defaultersList.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-semibold text-slate-800">{d.name}</td>
                  <td className="px-6 py-4 text-xs font-mono">{d.room}</td>
                  <td className="px-6 py-4 text-xs">{d.phone}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-rose-600">{d.guardianPhone}</td>
                  <td className="px-6 py-4 text-xs font-mono text-indigo-600">{d.invoiceNo}</td>
                  <td className="px-6 py-4 font-bold text-rose-600">PKR {d.amountDue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                      {d.daysOverdue} Days Late
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT 2: COLLECTION SUMMARY */}
      {reportType === 'collection' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-600" /> Monthly Collection & Reconciliation Audit
            </h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Billing Month</th>
                <th className="px-6 py-4">Total Invoiced</th>
                <th className="px-6 py-4">Total Collected</th>
                <th className="px-6 py-4">Pending Balance</th>
                <th className="px-6 py-4">Recovery Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collectionsList.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{c.period}</td>
                  <td className="px-6 py-4 text-xs">PKR {c.totalBilled.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-bold text-emerald-600">PKR {c.collected.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-bold text-rose-600">PKR {c.pending.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      {c.rate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT 3: OCCUPANCY AUDIT */}
      {reportType === 'occupancy' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <BedDouble size={18} className="text-indigo-600" /> Block-wise Bed Occupancy & Capacity
            </h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Hostel Block</th>
                <th className="px-6 py-4">Total Beds</th>
                <th className="px-6 py-4">Occupied</th>
                <th className="px-6 py-4">Available Vacant</th>
                <th className="px-6 py-4">Under Maintenance</th>
                <th className="px-6 py-4">Occupancy %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {occupancyList.map((o, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{o.block}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{o.totalBeds} Beds</td>
                  <td className="px-6 py-4 text-xs text-indigo-600 font-bold">{o.occupied} Beds</td>
                  <td className="px-6 py-4 text-xs text-emerald-600 font-bold">{o.vacant} Beds Free</td>
                  <td className="px-6 py-4 text-xs text-amber-600">{o.maintenance} Beds</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
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
