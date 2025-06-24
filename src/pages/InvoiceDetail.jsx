import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import {
  FileText, BadgeCheck, Clock, XOctagon,
  Mail, Link as LinkIcon, FileCode
} from 'lucide-react';

export default function InvoiceDetail() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    api.get(`/payment/${invoiceId}`).then(res => setInvoice(res.data));
  }, [invoiceId]);

  const statusBadge = (status) => {
    const base = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full';
    switch (status) {
      case 'finished':
        return <span className={`${base} bg-green-100 text-green-700`}><BadgeCheck size={14} className="mr-1" /> Selesai</span>;
      case 'waiting':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><Clock size={14} className="mr-1" /> Menunggu</span>;
      case 'failed':
        return <span className={`${base} bg-red-100 text-red-700`}><XOctagon size={14} className="mr-1" /> Gagal</span>;
      default:
        return <span className={`${base} bg-gray-200 text-gray-700`}>{status}</span>;
    }
  };

  if (!invoice) {
    return <div className="p-6 text-center text-gray-500">⏳ Memuat detail invoice...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={24} className="text-blue-600" /> Detail Invoice
        </h2>
        <button
          onClick={() => setShowJson(true)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded text-gray-700 border"
        >
          <FileCode size={16} /> Lihat JSON
        </button>
      </div>

      <div className="bg-white border shadow rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
        <div>
          <p className="text-gray-500 font-medium">Order ID</p>
          <p className="font-semibold">{invoice.order_id}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Status Pembayaran</p>
          {statusBadge(invoice.payment_status)}
        </div>

        <div>
          <p className="text-gray-500 font-medium">Nominal</p>
          <p>{invoice.price_amount} {invoice.price_currency}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Deskripsi</p>
          <p>{invoice.order_description}</p>
        </div>

        {invoice.customer_email && (
          <div>
            <p className="text-gray-500 font-medium">Email Pelanggan</p>
            <p className="inline-flex items-center gap-1 text-blue-600">
              <Mail size={14} /> {invoice.customer_email}
            </p>
          </div>
        )}

        {invoice.invoice_url && (
          <div>
            <p className="text-gray-500 font-medium">Link Invoice</p>
            <a
              href={invoice.invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline inline-flex items-center gap-1"
            >
              <LinkIcon size={14} /> Buka Invoice
            </a>
          </div>
        )}

        <div>
          <p className="text-gray-500 font-medium">Dibuat Pada</p>
          <p>{new Date(invoice.created_at).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium">Diperbarui</p>
          <p>{new Date(invoice.updated_at).toLocaleString()}</p>
        </div>

        {invoice.xsid && (
          <div className="md:col-span-2">
            <p className="text-gray-500 font-medium">XSID</p>
            <p>{invoice.xsid}</p>
          </div>
        )}
      </div>

      {/* Modal JSON */}
      {showJson && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 relative">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
              <FileCode size={18} /> JSON Payload
            </h3>
            <pre className="bg-gray-100 text-xs rounded p-4 max-h-[70vh] overflow-auto text-gray-800">
              {JSON.stringify(invoice, null, 2)}
            </pre>
            <button
              onClick={() => setShowJson(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
