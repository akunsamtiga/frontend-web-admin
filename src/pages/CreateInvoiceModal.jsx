import { useState } from 'react';
import { Receipt, X } from 'lucide-react';
import api from '../api';

export default function CreateInvoiceModal({ visible, onClose }) {
  const [form, setForm] = useState({
    email: '',
    amount: '',
    currency: 'USD',
    order_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalForm = {
      price_amount: Number(form.amount),
      price_currency: form.currency,
      order_id: form.order_id.trim() || `INV-${Date.now()}`,
      order_description: 'Invoice dari admin panel',
      customer_email: form.email
    };

    try {
      const res = await api.post('/payment/create', finalForm);
      alert(`✅ Invoice berhasil dibuat untuk ${form.email}\n\nLink pembayaran:\n${res.data?.invoice_url || '-'}`);
      onClose();
      setForm({ email: '', amount: '', currency: 'USD', order_id: '' });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Terjadi kesalahan.';
      alert('❌ Gagal: ' + msg);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white border rounded-xl shadow-2xl w-full max-w-md p-6 relative transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 border-b pb-3">
          <Receipt size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Buat Invoice Baru</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email Pelanggan</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contoh@email.com"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Nominal</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Jumlah dalam USD"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mata Uang</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="IDR">IDR</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Order ID (Opsional)</label>
            <input
              type="text"
              value={form.order_id}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              placeholder="INV-00001"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Buat Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
