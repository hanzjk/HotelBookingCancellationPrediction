import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Table from "react-dj-table";
import "bootstrap/dist/js/bootstrap.bundle.js";
import { MDBDataTableV5 } from "mdbreact";
import { useTable } from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";

import Pagination from "./Pagination";

let PageSize = 10;

function Home2() {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedFile, setSelectedFile] = useState([]);
  const [predictions, setPredictions] = useState([0]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return predictions.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

    
    
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(selectedFile);
  };

  function uploadFile(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("file", selectedFile);
    console.log(selectedFile);
    axios
      .post("/file_upload", formData)
      .then((res) => {
        setPredictions(res.data);
        console.log(res.data);
      })
      .catch((err) => console.warn(err));
  }

  const DisplayData = predictions.map((info) => {
    return (
      <tr>
        <td>{info.Prediction}</td>
        <td>{info["Cancellation Probability"]}</td>
        <td>{info["Confirmation Probability"]}</td>
      </tr>
    );
  });

  return (
    <div>
      <Container className="mt-5">
        <form onSubmit={uploadFile}>
          <input type="file" id="file" onChange={handleFileSelect} />
          <input type="submit" value="Upload File!" />
        </form>
        <br></br>
        <Card className="mt-4">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Prediction</th>
                <th>Cancellation Probability</th>
                <th>Confirmation Probability</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((info) => {
                return (
                  <tr>
                    <td>{info.Prediction}</td>
                    <td>{info["Cancellation Probability"]}</td>
                    <td>{info["Confirmation Probability"]}</td>
                  </tr>
                );
                  
              })}

              {DisplayData}
            </tbody>
          </table>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={predictions.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Card>
      </Container>
    </div>
  );
}

export default Home2;
