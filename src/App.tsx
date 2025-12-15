import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Dashboard from './components/pages/Dashboard';
import EspacePedagogique from './components/pages/EspacePedagogique';
import Formateur from './components/pages/Formateur';
import Etudiant from './components/pages/Etudiant';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './styles/App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar toggleSidebar={toggleSidebar} />
        <Container fluid className="content-container">
          <Row>
            <Col xs={sidebarCollapsed ? 1 : 2} className="sidebar-col">
              <Sidebar collapsed={sidebarCollapsed} />
            </Col>
            <Col xs={sidebarCollapsed ? 11 : 10} className="main-content">
              <div className="page-container">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/espace-pedagogique" element={<EspacePedagogique />} />
                  <Route path="/formateur" element={<Formateur />} />
                  <Route path="/etudiant" element={<Etudiant />} />
                </Routes>
              </div>
              <Footer />
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default App;