import { useRef, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown, Image, Button, Badge } from 'react-bootstrap';
import { FaUser, FaBell, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { BsBell } from 'react-icons/bs';

function HeaderUserbox() {
  const navigate = useNavigate();
  const [emailUserConnect, setEmailUserConnect] = useState("franckhounssou62@gmail.com");
  const [nomUserConnect, setNomUserConnect] = useState("Hounssou");
  const [prenomUserConnect, setPrenomUserConnect] = useState("Franck");

  /*const userInfo = async () => {
      try {
        setEmailUserConnect(sessionStorage.getItem("userEmail") || "");
        setNomUserConnect(sessionStorage.getItem("userNom") || "");
        setPrenomUserConnect(sessionStorage.getItem("userPrenom") || "");
        
        console.log("Données utilisateur:", {
          email: sessionStorage.getItem("userEmail"),
          nom: sessionStorage.getItem("userNom"),
          prenom: sessionStorage.getItem("userPrenom")
        });
      } catch {
        console.error("erreur lors de la récupération des info du user");
      }
    };

  const user = {
    name: prenomUserConnect +" "+nomUserConnect,
    avatar: '/static/images/avatars/1.jpg',
    jobtitle: emailUserConnect
  };*/


  const generateColorFromInitials = (initials: string) => {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = "#" + (hash >>> 0).toString(16).padStart(6, "0").slice(0, 6);

  return color;
};

  const User = ({ initials }:any) => {
  const bgColor = generateColorFromInitials(initials);
  return (
    <div
      className="d-flex align-items-center"
      style={{ height: "100%" }}
    >
      <div
        className="rounded-circle text-white text-center flex-grow-1"
        style={{
          backgroundColor: bgColor + "50",
          marginTop: 5,
          float: "left",
          lineHeight: "50px",
        }}
      >
        <div style={{ color: bgColor, fontSize: "18px", width:50, height:50 }}>{initials}</div>
      </div>
      {/**/}
    </div>
  );
};

const initials = (a: string, b: string) => {
  return a.charAt(0).toUpperCase() + b.charAt(0).toUpperCase();
};

  const handleLogout = async (): Promise<void> => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  /*useEffect(() => {
    userInfo();
  }, []);*/

  return (
    <>
    <div>
      <Button 
        variant="link" 
        className="d-flex align-items-center mt-3 text-decoration-none p-2 border-0 bg-transparent"
        onClick={() => navigate('/management/notifications')}
      >
        <BsBell size={25} />
      </Button>
    </div>
    <Dropdown align="end">
      <Dropdown.Toggle 
        variant="link" 
        id="dropdown-user" 
        className="d-flex align-items-center text-decoration-none p-2 border-0 bg-transparent"
      >
        <User
         initials={initials(prenomUserConnect, nomUserConnect)}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow border-0" style={{ minWidth: '250px' }}>
        <div
        className="ms-1 py-2"
        style={{ float: "right", height: "100%", width: "100%", justifyContent:"center" }}
      >
        <div className="fw-bold" style={{ fontSize: "1rem", whiteSpace: "break-spaces"}}>
          {prenomUserConnect} {nomUserConnect}
        </div>
        <div className="text-muted" style={{ fontSize: "0.6rem" }}>
          {emailUserConnect}
        </div>
      </div>
        <Dropdown.Item as={NavLink} to="/management/profile/details" className="py-2">
          <FaUser className="me-2" />
          Mon Profil
        </Dropdown.Item>
        
        <Dropdown.Item as={NavLink} to="/management/profile/settings" className="py-2">
          <FaBell className="me-2" />
          Notifications
        </Dropdown.Item>

        <Dropdown.Item onClick={() => navigate('/connexion')} className="py-2 text-danger">
          <FaSignOutAlt className="me-2" />
          Déconnexion
        </Dropdown.Item> 
      </Dropdown.Menu>
    </Dropdown>
    </>
  );
}

export default HeaderUserbox;
