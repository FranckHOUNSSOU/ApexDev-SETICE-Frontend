//import "./Services.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Navbar, Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { OverlayTrigger, Popover, PopoverBody, Button } from "react-bootstrap";
import AjoutEspaceModal from "D:/GL/SETICE Frontend/src/components/pages/EspacePedagogique/AjoutEspaceModal/AjoutEspaceModal.tsx";
//import rdata from "../../../../../listes/servicesCopy.json";
const EspacePedagogique = (props: any) => {
  const [showAjoutEspaceModal, setShowAjoutEspaceModal] = useState(false);

  const [actionRow, setActionRow] = useState<string | null>(null);

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [espaces, setEspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ selectedRows }: { selectedRows: any }) => {
    setSelectedRows(selectedRows);
  };

  const fetchEspaces = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/espace-pedagogique");
      let data = res.data;
      // support several possible response shapes
      if (data?.result) data = data.result;
      else if (data?.results) data = data.results;
      if (!Array.isArray(data)) data = [];
      // store raw array response (derived fields computed at render time)
      setEspaces(data);
    } catch (err) {
      console.error("Erreur fetch espaces:", err);
      setEspaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspaces();
  }, []);


  const columns = [
    {
      name:"N°",
      width: "70px",
      cell: (row: any) => {
        const idx = espaces.indexOf(row);
        return idx >= 0 ? idx + 1 : "-";
      },
    },
    {
      name:"Nom de l'espace",
      cell: (row: any) => row.nom,
      sortable: true,
    },
    {
      name:"Description",
      cell: (row: any) => row.description,
      sortable: true,
    },
    {
      name:"Matière",
      cell: (row: any) => row.matiere,
      sortable: true,
    },
    {
      name:"Formateur",
      minWidth: "180px",
      cell: (row: any) => row.formateur.utilisateur.nom + " " + row.formateur.utilisateur.prenom ||" ",
      sortable: true,
    },
    {
      name: "Promotion",
      cell: (row: any) => {
        return(
          <div>
            <div>
              {row.promotion.filiere}/{row.promotion.options}
            </div>
            <div className="text-muted" style={{ fontSize: "0.6rem" }}>
              {row.promotion.anneeAcademique}
            </div>
          </div>
        )
      },
      sortable: true,
    },
    {
      name: <h5 className="fs-8">Action</h5>,
      width: "90px",
      center: true,
      cell: (row: any) => {
        const rowId = row.id
        return (
          <>
            <OverlayTrigger
              placement="left"
              trigger="click"
              show={actionRow === rowId}
              rootClose
              overlay={
                <Popover style={{ borderRadius: 0 }}>
                  <PopoverBody style={{ padding: 0 }}>
                    <button
                      className="btn btn-outline-light popover-btn text-start"
                      style={{ width: "100%", fontSize: "0.8rem" }}
                    >
                      <i
                        className="bi bi-eye-fill"
                        style={{ fontSize: "0.8rem" }}
                      ></i>{" "}
                      View
                    </button>
                    <br />
                    <button
                      className="btn btn-outline-light popover-btn text-start"
                      style={{ width: "100%", fontSize: "0.8rem" }}
                    >
                      <i
                        className="bi bi-ban"
                        style={{ fontSize: "0.8rem" }}
                      ></i>{" "}
                      Deactivate
                    </button>
                    <br />
                    <button
                      className="btn btn-outline-light popover-btn text-start"
                      style={{ width: "100%", fontSize: "0.8rem" }}
                    >
                      <i
                        className="bi bi-pencil-fill"
                        style={{ fontSize: "0.8rem" }}
                      ></i>{" "}
                      Edit
                    </button>
                    <br />
                    <button
                      className="btn btn-outline-light popover-btn text-start"
                      style={{ width: "100%", fontSize: "0.8rem" }}
                    >
                      <i
                        className="bi bi-trash-fill"
                        style={{ fontSize: "0.8rem" }}
                      ></i>{" "}
                      Delete
                    </button>
                  </PopoverBody>
                </Popover>
              }
            >
              <button
                className="btn"
                onClick={() =>
                  setActionRow(actionRow === rowId ? null : rowId)
                }
              >
                &#8942;
              </button>
            </OverlayTrigger>
          </>
        );
      },
    },
  ];
  console.log(props);
  return (
    <>
      <Navbar>
        <Container fluid>
          <div className="d-flex align-items-center w-100 justify-content-between flex-wrap">
            <div className="d-flex align-items-center mb-2 mb-md-0">
              <button
                className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center me-2"
                onClick={() => setShowAjoutEspaceModal(true)}
                style={{
                  width: 36,
                  height: 36,
                  borderColor: "#2e7d32",
                  color: "#2e7d32",
                }}
              >
                <FaPlus />
              </button>
              <span
                style={{
                  color: "#2e7d32",
                  fontWeight: 500,
                  fontSize: 22,
                }}
              >
                Ajouter un espace pédagogique
              </span>
            </div>
          </div>
        </Container>
      </Navbar>
      <div className={"Services"}>
        <Card>
          <Card.Body>
            <div className="mb-1" style={{ height: "2rem" }}>
              {selectedRows?.length > 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>
                      {selectedRows?.length} Espace(s) pédagogique(s)
                    </span>
                    <Button
                      variant="light"
                      size="sm"
                      style={{ fontSize: "1rem" }}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </>
              )}
            </div>
            <DataTable
              pagination
              responsive
              selectableRows
              onSelectedRowsChange={handleChange}
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: "#c2def9ff",
                    border: "none",
                    marginBottom: "0.5rem",
                    padding: "0.5rem",
                    fontWeight: "bold",
                  },
                },
                rows: {
                  style: {
                    border: "1px solid #e9ecef",
                    borderRadius: "0.5rem",
                    marginBottom: "0.5rem",
                    height: "fit-content",
                    whiteSpace: "normal",
                    padding: "0.25rem",

                    "&:hover": {
                      borderColor: "#007bff",
                    },
                  },
                },
              }}
              columns={columns}
              data={espaces}
              progressPending={loading}
              noDataComponent={
                <div
                  className={
                    "min-h-350px d-flex align-items-center justify-content-center"
                  }
                >
                  <h3>Aucun Espace Pédagogique</h3>
                </div>
              }
            />
          </Card.Body>
        </Card>
        <AjoutEspaceModal
          show={showAjoutEspaceModal}
          onClose={() => setShowAjoutEspaceModal(false)}
          onEspaceAdded={fetchEspaces}
        />
      </div>
    </>
  );
};
export default EspacePedagogique;

/*
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// Corrigez les imports d'icônes
import { 
  PlayFill, 
  Download, 
  ClockFill 
} from 'react-bootstrap-icons';

const EspacePedagogique: React.FC = () => {
  const courses = [
    { id: 1, title: 'React pour débutants', duration: '4h', lessons: 12 },
    { id: 2, title: 'TypeScript avancé', duration: '6h', lessons: 18 },
    { id: 3, title: 'Architecture Microservices', duration: '8h', lessons: 24 },
    { id: 4, title: 'UI/UX Design', duration: '5h', lessons: 15 },
  ];

  return (
    <div>
      <h1 className="mb-4">Espace Pédagogique</h1>
      <Row>
        {courses.map((course) => (
          <Col md={6} lg={3} key={course.id} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>
                  <small className="text-muted">
                    <ClockFill size={14} className="me-1" />
                    {course.duration} • {course.lessons} leçons
                  </small>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" size="sm" className="me-2">
                  <PlayFill className="me-1" /> Commencer
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <Download className="me-1" /> Télécharger
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EspacePedagogique;*/
