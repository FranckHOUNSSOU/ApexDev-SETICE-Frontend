import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Connexion from './Authentification/connexion/connexion';
import Dashboard from './components/pages/Dashboard';
import EspacePedagogique from './components/pages/EspacePedagogique';
import Formateur from './components/pages/Formateur';
import Etudiant from './components/pages/Etudiant';
import Promotion from './components/pages/Promotions/Promotions';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Profile from './components/pages/Parametres/Profile';
import Notifications from './components/pages/Parametres/Notifications';
import Rapports from './components/pages/Parametres/Rapports';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/App.css';

function MainLayout({ toggleSidebar, sidebarCollapsed, isMobile }: { toggleSidebar: () => void; sidebarCollapsed: boolean; isMobile: boolean }) {
  return (
    <div className="app-container">
      {/* Offcanvas mobile (rendu uniquement sur mobile pour éviter la duplication) */}
      {isMobile && <Sidebar isMobile={isMobile} collapsed={sidebarCollapsed} onClose={toggleSidebar} />}
      {isMobile && !sidebarCollapsed && <div className="sidebar-overlay" onClick={toggleSidebar} />}
      {/* Sidebar fixe sur desktop */}
      {!isMobile && <Sidebar collapsed={sidebarCollapsed} />}
      <Navbar toggleSidebar={toggleSidebar} />
      <Container fluid style={{ paddingTop: 70, paddingLeft: 0, paddingRight: 0 }}>
        <Row>
          {/* calculer la largeur pour que la colonne n'occupe que l'espace à droite de la sidebar */}
          <Col
            xs={12}
            className="main-content"
            style={{
              marginLeft: !isMobile ? (sidebarCollapsed ? 70 : 220) : 0,
              width: !isMobile ? `calc(100% - ${sidebarCollapsed ? 70 : 220}px)` : '100%',
              paddingLeft: 0
            }}
          >
            <div className="page-container bg-light rounded" style={{ maxWidth: 1100, margin: '16px auto', padding: '24px' }}>
              <Outlet />
            </div>
            <Footer isMobile={isMobile} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => window.innerWidth <= 768 ? true : false);
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // définir des valeurs par défaut adaptées lors des changements de breakpoint
      if (mobile) {
        setSidebarCollapsed(true); // masquer par défaut sur petits écrans
      } else {
        setSidebarCollapsed(false); // afficher développé sur desktop
      }
    };

    window.addEventListener('resize', handleResize);
    // garantir l'état initial correct
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* Routes that use the main authenticated layout */}
        <Route element={<MainLayout toggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} isMobile={isMobile} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/espace-pedagogique" element={<EspacePedagogique />} />
          <Route path="/formateur" element={<Formateur />} />
          <Route path="/Promotion" element={<Promotion />} />
          <Route path="/etudiant" element={<Etudiant />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/rapports" element={<Rapports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;