// Fichier : src/components/pages/Dashboard.tsx
import React from 'react';
import {Card,CardBody,Row,Col,Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
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
  {
    label: "Total de Promotions",
    value: '8',
    icon:<BarChartFill size={30} />,
    color: "info",
    link: "missed",
  },
  {
    label: "Promotions actives",
    value: '3',
    icon:<BarChartFill size={30} />,
    color: "success",
    link: "missed",
  },
  {
    label: "Promotions archivées",
    value: '2',
    icon:<BarChartFill size={30} />,
    color: "warning",
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
      <div className={"mt-7"}>
        <Card>
          <Card.Body>
            <h2 className="mb-6">Upcoming Appointment(s)</h2>
            <DataTable
              /*data={rdata.result.results.filter((r:any, i:number)=> {
                console.log(r, i)
                return i<=3
              })}
              noTableHead
              customStyles={{
                rows: {
                  style: {
                    border: "1px solid #e9ecef",
                    borderRadius: "0.5rem",
                    marginBottom: "0.5rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#007bff",
                    },
                  },
                },
              }}*/
              noDataComponent={
                <div
                  className={
                    "min-h-350px d-flex align-items-center justify-content-center"
                  }
                >
                  <h1>No upcoming appointment</h1>
                </div>
              }
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;