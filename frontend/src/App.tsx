import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { DocumentSearch } from './pages/DocumentSearch';
import { ServiceTicket } from './pages/ServiceTicket';
import { Login } from './pages/Login';
import { ServiceAdmin } from './pages/ServiceAdmin';
import { SiteAdmin } from './pages/SiteAdmin'

function App() {
  return (
    <Router>
      <Routes>
        {/* 2. Rota do Painel Administrativo */}

        <Route path="/" element={<Home />} />
        <Route path="/documentos" element={<DocumentSearch />} />
        <Route path="/abrir-chamado" element={<ServiceTicket />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-os" element={<ServiceAdmin />} />
        <Route path="/admin-site" element={<SiteAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;