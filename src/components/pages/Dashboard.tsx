// Fichier : src/components/pages/Dashboard.tsx
import React from 'react';
import {Card,CardBody,Row,Col,Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// Utilisez les bons noms d'icônes
import { 
  BarChartFill, 
  PeopleFill, 
  BookFill, 
  PersonBadgeFill 
} from 'react-bootstrap-icons';

const Dashboard: React.FC = () => {

  const WIDGETS = [
  {
    label: "Étudiants actifs",
    value: '1,245',
    icon: <PeopleFill size={30} />,
    color: "primary",
    link: "total",
  },
  {
    label: "Cours disponibles",
    value: '48',
    icon:<BookFill size={30} />,
    color: "success",
    link: "upcoming",
  },
  {
    label: "Formateurs",
    value: '32',
    icon:<PersonBadgeFill size={30} />,
    color: "warning",
    link: "pending",
  },
  {
    label: "Taux de complétion",
    value: '78%',
    icon:<BarChartFill size={30} />,
    color: "info",
    link: "missed",
  },
  
];

  const navigate = useNavigate();

  return (
    <div className="dashboard">
      
      <h1 className="mb-4">Tableau de Bord</h1>
      <div className="row gy-5 mb-5" style={{}}>
        {WIDGETS.map((widget, idx) => {
          return (
            <div className="col-sm-3 col-6" key={idx}>
              <Card className="card-flush border-0 h-100">
                <CardBody className="d-flex align-items-center">
                  <div className="me-5">
                    {/*<img src={widget.icon} className="h-40px" />*/}
                    {widget.icon}
                  </div>

                  <div className="d-flex flex-column">
                    <h2 className={"mb-1 fw-semibold fs-3x lh-1 ls-n2 text-"+widget.color}>
                      {widget.value}
                    </h2>
                    <div className="text-muted fw-bold">
                      <div className="m-0 mb-2">
                        <span className="fw-semibold fs-6 text-gray-400">
                          {widget.label}
                        </span>
                      </div>
                      {/* <a href={}>view</a> */}
                      {/*{widget.link && <Link to={widget.link}>view</Link>}*/}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Activité récente</Card.Title>
            </Card.Header>
            <Card.Body>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Nouveau cours ajouté: "React Avancé"</li>
                <li className="list-group-item">5 nouveaux étudiants inscrits</li>
                <li className="list-group-item">3 devoirs soumis aujourd'hui</li>
                <li className="list-group-item">Mise à jour du système terminée</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;