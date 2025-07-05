// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import InvoiceDetail from './pages/InvoiceDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/invoice/:invoiceId" element={<InvoiceDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
