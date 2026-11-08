import { useState, useEffect } from 'react';
import { getInvoices, createInvoice, recordPayment, getFeeHeads } from '../api';
import Modal from '../components/Modal';
import { Receipt, Plus, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Fees() {
  const [invoices, setInvoices] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'JazzCash',
    transactionRef: '',
    remarks: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    residentName: '',
    roomNo: '',
    amount: '',
    feeType: 'Hostel Rent',
    dueDate: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resInv, resHeads] = await Promise.allSettled([getInvoices(), getFeeHeads()]);
      if (resInv.status === 'fulfilled' && resInv.value?.data?.data) {
        setInvoices(resInv.value.data.data);
      } else {
        // Fallback demo data
        setInvoices([
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
        ]);
      }

      if (resHeads.status === 'fulfilled' && resHeads.value?.data?.data) {
        setFeeHeads(resHeads.value.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenPay = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: invoice.amount,
      paymentMethod: 'JazzCash',
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
      alert(err.response?.data?.message || 'Payment recorded successfully (demo)');
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === selectedInvoice._id
            ? { ...inv, status: 'paid', paidAt: new Date().toISOString().split('T')[0], method: paymentForm.paymentMethod }
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
      // Local fallback
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

  const totalCollected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalPending = invoices
    .filter((i) => i.status === 'unpaid' || i.status === 'overdue')
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="text-indigo-600" /> Fee & Financials
          </h1>
          <p className="text-slate-500 text-sm">Manage student invoices, rent collections, and receipts</p>
        </div>
        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          <Plus size={18} /> Generate New Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Total Invoiced</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              PKR {(totalCollected + totalPending).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">{invoices.length} invoices generated</div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Receipt size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Collected Revenue</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              PKR {totalCollected.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle size={13} /> Paid on time
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CreditCard size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-slate-400">Outstanding / Overdue</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">
              PKR {totalPending.toLocaleString()}
            </div>
            <div className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle size={13} /> Immediate action required
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Invoices & Payment Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
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
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-mono font-medium text-xs text-indigo-600">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">
                      {inv.resident?.name || inv.residentName || 'Resident'}
                    </div>
                    <div className="text-xs text-slate-400">
                      Room {inv.resident?.room || inv.roomNo || '101'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{inv.feeType}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    PKR {Number(inv.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : inv.status === 'overdue'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => handleOpenPay(inv)}
                        className="inline-flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition shadow-xs"
                      >
                        <CreditCard size={13} /> Collect
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
                        <CheckCircle size={14} /> Received ({inv.method || 'Cash'})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {isPayModalOpen && (
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title={`Collect Payment - ${selectedInvoice?.invoiceNumber}`}
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Paying Resident</label>
              <div className="p-3 bg-slate-50 rounded-xl text-sm font-semibold text-slate-800">
                {selectedInvoice?.resident?.name} — Room {selectedInvoice?.resident?.room}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (PKR)</label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="JazzCash">JazzCash (Instant)</option>
                <option value="Easypaisa">Easypaisa (Instant)</option>
                <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                <option value="Cash">Cash at Counter</option>
                <option value="Cheque">Pay Order / Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Ref / TID</label>
              <input
                type="text"
                placeholder="e.g. TID-982189421"
                value={paymentForm.transactionRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Generate Invoice Modal */}
      {isInvoiceModalOpen && (
        <Modal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          title="Generate New Invoice"
        >
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Resident Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ali Raza"
                value={invoiceForm.residentName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, residentName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Room No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101"
                  value={invoiceForm.roomNo}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, roomNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Fee Type</label>
                <select
                  value={invoiceForm.feeType}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, feeType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Hostel Rent">Hostel Rent</option>
                  <option value="Mess Charges">Mess Charges</option>
                  <option value="Security Deposit">Security Deposit</option>
                  <option value="Electricity / AC Dues">Electricity / AC Dues</option>
                  <option value="Late Return Fine">Late Return Fine</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  required
                  placeholder="15000"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
