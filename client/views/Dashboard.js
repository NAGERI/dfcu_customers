import React from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { BACKEND_URL } from "../config/configs";
import { useState, useEffect } from "react";

function Dashboard() {
  const [newData, setData] = useState([]);

  useEffect(() => {
    fetch(BACKEND_URL)
      .then((res) => console.log(res.json()))
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">
                  DFCU customer endpoint Statistics
                </Card.Title>
                <p className="card-category">Successful / Failed Requests</p>
              </Card.Header>
              <Card.Body>
                <div
                  className="ct-chart ct-perfect-fourth"
                  id="chartPreferences"
                >
                  <ChartistGraph
                    data={{
                      labels: ["70%", "30%"],
                      series: [70, 30],
                    }}
                    type="Pie"
                  />
                </div>
                <div className="legend">
                  <i className="fas fa-circle text-danger"></i>
                  Failed <i className="fas fa-circle text-info"></i>
                  Successful
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock"></i>
                  Statistics Updated 5 minutes ago
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
