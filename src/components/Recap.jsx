import jsPDF from 'jspdf';
import 'jspdf-autotable';

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text('Laporan Transaksi SanzyPay', 14, 16);

  const tableData = txs.map(tx => [
    tx.order_id,
    tx.payment_status,
    `${tx.price_amount} ${tx.price_currency}`,
    tx.customer_email,
    new Date(tx.created_at).toLocaleString()
  ]);

  doc.autoTable({
    head: [['Order ID', 'Status', 'Amount', 'Email', 'Tanggal']],
    body: tableData,
    startY: 22
  });

  doc.save(`laporan_transaksi_${Date.now()}.pdf`);
};
