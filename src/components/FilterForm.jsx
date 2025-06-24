// src/components/FilterForm.jsx
import { Filter } from 'lucide-react';

export default function FilterForm({ filters, onChange, onFilter, onReset }) {
  return (
    <form
      onSubmit={onFilter}
      className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div>
        <label htmlFor="order_id" className="block text-sm font-medium text-gray-600 mb-1">
          Order ID
        </label>
        <input
          id="order_id"
          name="order_id"
          value={filters.order_id}
          onChange={onChange}
          placeholder="Contoh: INV-2024..."
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={filters.email}
          onChange={onChange}
          placeholder="nama@email.com"
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={filters.status}
          onChange={onChange}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Status</option>
          <option value="waiting">Menunggu</option>
          <option value="finished">Berhasil</option>
          <option value="failed">Gagal</option>
        </select>
      </div>

      <div>
        <label htmlFor="start_date" className="block text-sm font-medium text-gray-600 mb-1">
          Dari Tanggal
        </label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          value={filters.start_date}
          onChange={onChange}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="end_date" className="block text-sm font-medium text-gray-600 mb-1">
          Sampai Tanggal
        </label>
        <input
          id="end_date"
          name="end_date"
          type="date"
          value={filters.end_date}
          onChange={onChange}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-end justify-end gap-2 mt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md text-sm flex items-center gap-2"
        >
          <Filter size={16} /> Terapkan
        </button>
        <button
          type="button"
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-md text-sm border"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
