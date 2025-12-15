import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link, useLocation } from 'react-router-dom';
import {
  HouseFill,
  BookFill,
  PersonBadgeFill,
  PeopleFill
} from 'react-bootstrap-icons';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <HouseFill />, label: 'Dashboard' },
    { path: '/espace-pedagogique', icon: <BookFill />, label: 'Espace Pédagogique' },
    { path: '/formateur', icon: <PersonBadgeFill />, label: 'Formateur' },
    { path: '/etudiant', icon: <PeopleFill />, label: 'Étudiant' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <Nav className="flex-column">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Nav.Item key={item.path}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-text">{item.label}</span>}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
     {/*<div className="sidebar-footer">
        {!collapsed && <small className="text-muted">Version 1.0.0</small>}
      </div>*/}
    </div>
  );
};

export default Sidebar;