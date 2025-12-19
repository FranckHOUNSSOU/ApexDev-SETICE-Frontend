import React, { useState, useEffect } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import axios from "axios";

type Formateur = {
  id: number;
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    actif: boolean;
    dateCreation: string;
    role: string;
  };
  specialite: string;
};


const GestionFormateurs: React.FC = () => {
  // =======================
  // STATES
  // =======================
 const [formateurs, setFormateurs] = useState<Formateur[]>([]);
 const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Champs formulaire
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [specialite, setspecialite] = useState("JAVA");
  const [actif, setActif] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchFormateurs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/formateur');
        setFormateurs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des formateurs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormateurs();
  }, []);

  // =======================
  // RECHERCHE
  // =======================
  const filteredFormateurs = formateurs.filter(
    (f) =>
      f.utilisateur.nom.toLowerCase().includes(search.toLowerCase()) ||
      f.utilisateur.email.toLowerCase().includes(search.toLowerCase())
  );

  // =======================
  // AJOUT FORMATEUR
  // =======================
  const handleAddFormateur = async () => {
   
    // Validation des champs requis
  if (!nom || !email) {
    // Créer un message temporaire
    const messageDiv = document.createElement('div');
    messageDiv.textContent = 'Veuillez valider tous les champs !';
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;

    // Ajouter l'animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Ajouter le message au DOM
    document.body.appendChild(messageDiv);

    // Supprimer le message après 3 secondes
    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    }, 3000);

    return;
  }
  const data = {
    nom,
    prenom,
    email,
    telephone,
    specialite,
  };

  try {
    await axios.post('http://localhost:3000/formateur', data);
    // Refetch data
    const response = await axios.get('http://localhost:3000/formateur');
    setFormateurs(response.data);
  } catch (error) {
    console.error("Erreur lors de l'ajout du formateur:", error);
  }

    // reset formulaire
    setNom("");
    setPrenom("");
    setEmail("");
    setTelephone("");
    setspecialite("JAVA");
    setActif(true);

    // fermer le formulaire
    setShowForm(false);
  };

  // =======================
  // COLONNES TABLEAU
  // =======================
  const columns: TableColumn<Formateur>[] = [
    {
      name: "Nom",
      selector: (row) => row.utilisateur.nom,
      sortable: true,
    },
     {
      name: "Prenom",
      selector: (row) => row.utilisateur.prenom,
      sortable: true,
    },

    {
      name: "Email",
      selector: (row) => row.utilisateur.email,
    },
    {
      name: "Telephone",
      selector: (row) => row.utilisateur.telephone,
    },
    {
      name: "Rôle",
      selector: (row) => row.specialite,
    },
    {
      name: "Statut",
      cell: (row) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            backgroundColor: row.utilisateur.actif ? "#dcfce7" : "#fee2e2",
            color: row.utilisateur.actif ? "#166534" : "#991b1b",
          }}
        >
          {row.utilisateur.actif ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={async () => {
            try {
              await axios.delete(`http://localhost:3000/formateur/${row.id}`);
              const response = await axios.get('http://localhost:3000/formateur');
              setFormateurs(response.data);
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
            }
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#ef4444",
            cursor: "pointer",
          }}
        >
          🗑
        </button>
      ),
    },
  ];

  // =======================
  // RENDER
  // =======================
  if (loading) {
    return (
      <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
        <p>Chargement des formateurs...</p>
      </div>
    );
  }

  return (
    <div style={{// maxWidth: "1100px", margin: "40px auto", padding: "20px",

  maxWidth: "1100px", 
  margin: "40px auto", 
  padding: "20px",
  border: "1px solid #e5e7eb", // ← Ajoutez cette ligne
  borderRadius: "10px",         // ← Ajoutez cette ligne
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)" // ← Optionnel




     }}>
      {/* TITRE + BOUTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Gestion des Formateurs</h2>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "#3b82f6",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Créer un formateur
          </button>
        )}
      </div>

      {/* FORMULAIRE AJOUT */}
      {showForm && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h3>Ajouter un formateur</h3>

          <input
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ width: "45%", padding: "10px", marginBottom: "10px",marginRight:"10px",borderRadius:"10px" }}
          />

           <input
            placeholder="Prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            style={{ width: "50%", padding: "10px", marginBottom: "10px",borderRadius:"10px" }}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "45%", padding: "10px", marginBottom: "10px", marginRight:"10px",borderRadius:"10px" }}
          />

           <input
            placeholder="Telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={{ width: "50%", padding: "10px", marginBottom: "10px",borderRadius:"10px" }}
          />

          <select
            value={specialite}
            onChange={(e) => setspecialite(e.target.value)}
            style={{ width: "45%", padding: "10px", marginBottom: "10px",borderRadius:"10px" }}
          >
            <option>JAVA</option>
            <option>Formateur</option>
            <option>Responsable pédagogique</option>
          </select>

          <label style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input
              type="checkbox"
              checked={actif}
              onChange={() => setActif(!actif)}
            />
            Actif
          </label>

          <button
            onClick={handleAddFormateur}
            style={{
              background: "#22c55e",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
           Enregistrer
          </button>
        </div>
      )}

      {/* TABLEAU */}
      <DataTable
        columns={columns}
        data={filteredFormateurs}
        pagination
        highlightOnHover
         fixedHeader
        fixedHeaderScrollHeight="400px" 
        subHeader
        subHeaderComponent={
          <input
            placeholder="Rechercher des formateurs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px", width: "250px",borderRadius:"10px" }}
          />
        }
        noDataComponent={<p>Aucun formateur trouvé. Vérifiez la connexion au backend ou ajoutez des données.</p>}
      />
    </div>
  );
};

export default GestionFormateurs;
