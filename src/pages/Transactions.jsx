import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  BadgeCheck,
  Clock,
  XOctagon,
  Download,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  FileDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'react-toastify/dist/ReactToastify.css';
import FilterForm from '../components/FilterForm';

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({
    email: '',
    order_id: '',
    status: '',
    start_date: '',
    end_date: ''
  });

  const [showCSVOptions, setShowCSVOptions] = useState(false);
  const [showPDFOptions, setShowPDFOptions] = useState(false);

  const csvRef = useRef();
  const pdfRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!csvRef.current?.contains(e.target)) setShowCSVOptions(false);
      if (!pdfRef.current?.contains(e.target)) setShowPDFOptions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: pagination.limit });

    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });

    try {
      const [txRes, sumRes] = await Promise.all([
        api.get(`/payment/history?${params.toString()}`),
        api.get(`/payment/report/summary?${params.toString()}`)
      ]);
      setTxs(txRes.data.transactions || []);
      setPagination(prev => ({ ...prev, page, total: txRes.data.total }));
      setSummary(sumRes.data);
    } catch (err) {
      toast.error('Gagal memuat transaksi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleFilter = (e) => {
    e.preventDefault();
    fetchData(1);
  };
  const handleReset = () => {
    setFilters({ email: '', order_id: '', status: '', start_date: '', end_date: '' });
    setTimeout(() => fetchData(1), 0);
  };

  const exportToCSV = () => {
    const csv = [
      ['Order ID', 'Status', 'Amount', 'Email', 'Tanggal'],
      ...txs.map(tx => [
        tx.order_id,
        tx.payment_status,
        `${tx.price_amount} ${tx.price_currency}`,
        tx.customer_email,
        new Date(tx.created_at).toLocaleString()
      ])
    ].map(row => row.map(val => `"${val}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `transaksi_tertampil_${Date.now()}.csv`;
    a.click();
  };

  const exportAllToCSV = async () => {
    try {
      const res = await api.get('/payment/history?limit=10000&page=1');
      const allTxs = res.data.transactions || [];

      const csv = [
        ['Order ID', 'Status', 'Amount', 'Email', 'Tanggal'],
        ...allTxs.map(tx => [
          tx.order_id,
          tx.payment_status,
          `${tx.price_amount} ${tx.price_currency}`,
          tx.customer_email,
          new Date(tx.created_at).toLocaleString()
        ])
      ].map(row => row.map(val => `"${val}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `semua_transaksi_${Date.now()}.csv`;
      a.click();
    } catch (err) {
      toast.error('Gagal export semua CSV');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Transaksi (Tertampil)', 14, 16);
    autoTable(doc, {
      head: [['Order ID', 'Status', 'Amount', 'Email', 'Tanggal']],
      body: txs.map(tx => [
        tx.order_id,
        tx.payment_status,
        `${tx.price_amount} ${tx.price_currency}`,
        tx.customer_email,
        new Date(tx.created_at).toLocaleString()
      ]),
      startY: 22,
      styles: { fontSize: 9 }
    });
    doc.save(`transaksi_tertampil_${Date.now()}.pdf`);
  };

  const exportAllToPDF = async () => {
    try {
      const res = await api.get('/payment/history?limit=10000&page=1');
      const allTxs = res.data.transactions;

      const doc = new jsPDF();
      doc.text('Laporan Semua Transaksi', 14, 16);
      autoTable(doc, {
        head: [['Order ID', 'Status', 'Amount', 'Email', 'Tanggal']],
        body: allTxs.map(tx => [
          tx.order_id,
          tx.payment_status,
          `${tx.price_amount} ${tx.price_currency}`,
          tx.customer_email,
          new Date(tx.created_at).toLocaleString()
        ]),
        startY: 22,
        styles: { fontSize: 9 }
      });
      doc.save(`semua_transaksi_${Date.now()}.pdf`);
    } catch (err) {
      toast.error('Gagal export semua PDF');
    }
  };

  const statusBadge = (status) => {
    const base = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded';
    switch (status) {
      case 'finished': return <span className={`${base} bg-green-100 text-green-700`}><BadgeCheck size={14} className="mr-1" /> Finished</span>;
      case 'waiting': return <span className={`${base} bg-yellow-100 text-yellow-700`}><Clock size={14} className="mr-1" /> Waiting</span>;
      case 'failed': return <span className={`${base} bg-red-100 text-red-700`}><XOctagon size={14} className="mr-1" /> Failed</span>;
      default: return <span className={`${base} bg-gray-200 text-gray-700`}>{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Heading & Export */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileSearch size={22} className="text-blue-600" /> Daftar Transaksi
        </h2>
        <div className="flex gap-2">
          {/* Export CSV Dropdown */}
          <div className="relative" ref={csvRef}>
            <button
              onClick={() => setShowCSVOptions(prev => !prev)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md"
            >
              <Download size={16} /> Export CSV
            </button>
            {showCSVOptions && (
              <div className="absolute right-0 mt-2 bg-white border shadow rounded-md w-44 text-sm z-50">
                <button onClick={() => { exportToCSV(); setShowCSVOptions(false); }} className="block w-full px-4 py-2 hover:bg-gray-100">Tertampil</button>
                <button onClick={() => { exportAllToCSV(); setShowCSVOptions(false); }} className="block w-full px-4 py-2 hover:bg-gray-100">Semua</button>
              </div>
            )}
          </div>

          {/* Export PDF Dropdown */}
          <div className="relative" ref={pdfRef}>
            <button
              onClick={() => setShowPDFOptions(prev => !prev)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md"
            >
              <FileDown size={16} /> Export PDF
            </button>
            {showPDFOptions && (
              <div className="absolute right-0 mt-2 bg-white border shadow rounded-md w-44 text-sm z-50">
                <button onClick={() => { exportToPDF(); setShowPDFOptions(false); }} className="block w-full px-4 py-2 hover:bg-gray-100">Tertampil</button>
                <button onClick={() => { exportAllToPDF(); setShowPDFOptions(false); }} className="block w-full px-4 py-2 hover:bg-gray-100">Semua</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ringkasan */}
      {summary && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded text-sm text-gray-700">
          <p><strong>{summary.total}</strong> transaksi ditemukan.</p>
          <p><strong>Total dibayar:</strong> ${summary.total_paid}</p>
          {summary.email && <p><strong>Email:</strong> {summary.email}</p>}
          {(summary.date_range?.start_date || summary.date_range?.end_date) && (
            <p><strong>Periode:</strong> {summary.date_range.start_date || '-'} s/d {summary.date_range.end_date || '-'}</p>
          )}
        </div>
      )}

      {/* Filter */}
      <FilterForm
        filters={filters}
        onChange={handleChange}
        onFilter={handleFilter}
        onReset={handleReset}
      />

      {/* Table */}
      <div className="overflow-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Email</th>
              <th>Tanggal</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill().map((_, i) => (
                <tr key={i} className="animate-pulse border-b">
                  {Array(6).fill().map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : txs.length > 0 ? (
              txs.map(tx => (
                <tr key={tx._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-3">{tx.order_id}</td>
                  <td>{statusBadge(tx.payment_status)}</td>
                  <td>{tx.price_amount} {tx.price_currency}</td>
                  <td>{tx.customer_email}</td>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td>
                    <Link to={`/invoice/${tx.invoice_id}`} className="text-blue-600 hover:underline text-sm">
                      Lihat
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">Tidak ada transaksi ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Halaman {pagination.page} dari {Math.ceil(pagination.total / pagination.limit)} — Total: {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => fetchData(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => fetchData(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
