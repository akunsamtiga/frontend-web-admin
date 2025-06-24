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
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/invoice/:invoiceId" element={<InvoiceDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
