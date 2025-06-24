import { useEffect, useState } from 'react';
import api from '../api';
import {
  FileText,
  DollarSign,
  Timer,
  XOctagon,
  BarChart3,
  PlusCircle
} from 'lucide-react';
import CreateInvoiceModal from './CreateInvoiceModal';
import DailyReportChart from '../components/DailyReportChart';

const icons = {
  total_invoices: FileText,
  total_paid: DollarSign,
  pending: Timer,
  failed: XOctagon,
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/payment/admin/stats').then(res => setStats(res.data));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 size={24} className="text-blue-600" />
          Statistik Transaksi
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <PlusCircle size={18} /> Buat Invoice
        </button>
      </div>

      {/* Statistik Cards */}
      {!stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill().map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-md border animate-pulse space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(stats).map(([key, val]) => {
            const Icon = icons[key] || FileText;
            return (
              <div key={key} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600 flex items-center gap-4">
                <Icon size={32} className="text-blue-600" />
                <div>
                  <div className="text-gray-500 uppercase text-sm font-semibold">{key.replace(/_/g, ' ')}</div>
                  <div className="text-2xl font-bold text-gray-800">{val}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CreateInvoiceModal visible={showModal} onClose={() => setShowModal(false)} />
        <DailyReportChart />

    </div>
  );
}
