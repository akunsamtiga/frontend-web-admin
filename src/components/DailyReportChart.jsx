import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { CalendarDays } from 'lucide-react';
import api from '../api';

export default function DailyReportChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/payment/admin/daily')
      .then(res => setData(res.data))
      .catch(err => {
        console.error('❌ Gagal ambil data harian:', err);
        setData([]);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-10 max-w-6xl mx-auto border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* 🟦 Chart Area */}
        <div className="h-[220px]">
          {data === null ? (
            <p className="text-gray-500 text-sm">⏳ Memuat data...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada transaksi dalam 7 hari terakhir.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(val) => `$${val}`} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 🟨 Deskripsi */}
        <div className="text-gray-700 text-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-800 font-semibold text-base">
            <CalendarDays className="text-blue-600" size={18} />
            Laporan Harian
          </div>
          <p className="mb-3 leading-relaxed">
            Grafik di samping menampilkan <strong>jumlah pembayaran sukses (USD)</strong> selama <strong>7 hari terakhir</strong>.
            Grafik ini sangat berguna untuk mengevaluasi performa harian sistem pembayaran dan melihat tren top up pengguna secara cepat.
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Kolom menunjukkan total uang masuk per hari</li>
            <li>Hanya menampilkan status <code className="bg-gray-100 px-1 rounded text-xs">finished</code></li>
            <li>Data diperbarui secara real-time setiap kali transaksi berhasil</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
