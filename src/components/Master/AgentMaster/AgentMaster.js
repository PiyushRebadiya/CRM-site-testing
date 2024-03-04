import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import PartyTable from "./AgentTable";
import PartyForm from "./AgentForm";
import { FaFilePdf } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { AiOutlinePrinter } from "react-icons/ai";
import moment from "moment";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Drawer } from "antd";
import { LuImport } from "react-icons/lu";
import PartyRecordImport from "./AgentRecordImport";
import { TableFlowImporter } from "@tableflow/react";
import { Space, Tooltip } from "antd";

function ImportFile(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <PartyRecordImport onHide={props.onHide} />
    </Modal>
  );
}

function PartyNewForm(props) {
  const { fetchData, getAgentData } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <PartyForm
        getAgentData={getAgentData}
        fetchData={fetchData}
        onHide={props.onHide}
      />
    </Modal>
  );
}

const PartyMaster = ({ getAgentData, onHide }) => {
  const location = useLocation();
  const [partynew, setPartyNew] = React.useState(false);
  const [searchinput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [importdata, setImportData] = useState([]);
  const insertData = React.useRef(null);
  const [importfile, setImportFile] = useState(false);
  useEffect(() => {
    // Function to handle keypress event
    function handleKeyPress(event) {
      if (event.key === "F2") {
        setPartyNew(true);
      }
    }

    // Add event listener for keypress
    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Empty dependency array to ensure this effect runs only once

  const handleData = (data) => {
    setData(data);
  };
  const generatePDF = () => {
    const doc = new jsPDF("landscape");
    const companyName =
      localStorage.getItem("CRMCompanyName") || "Your Company Name"; // Retrieve company name from Local Storage
    doc.setFont("Arial", "bold");
    doc.text(` ${companyName}`, 120, 10);
    doc.setFontSize(13);
    const leftMargin = 15;
    doc.text(`Total Record :- ${data.length}`, leftMargin, 15);
    doc.text("Agent List :-", leftMargin, 19);
    const tableData = data.map((item, index) => [
      index + 1,
      item.AgentName ? item.AgentName : "-",
      item.LegelName ? item.LegelName : "-",
      item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + item.Code,
      item.StateName ? item.StateName : "-",
      item.Mobile1 ? `+${item.Mobile1}` : "-",
      item.DOB ? moment(item.DOB).format("DD-MM-YYYY") : "No Date",
      item.DOJ ? moment(item.DOJ).format("DD-MM-YYYY") : "No Date",
      item.AnnivarsaryDate
        ? moment(item.AnnivarsaryDate).format("DD-MM-YYYY")
        : "No Date",
      item.PAN ? item.PAN : "-",
      item.GST ? item.GST : "-",
    ]);

    doc.autoTable({
      head: [
        [
          "No",
          "Agent Name",
          "Legal Name",
          "Address",
          "State",
          "Mobile",
          "Date of Birth",
          "Date Of Join",
          "Date of Anniversary",
          "PAN",
          "GST",
        ],
      ],
      body: tableData,
      startY: 20,
    });

    doc.save("Agent.pdf");
  };
  const downloadExcel = () => {
    const columeName = [
      "No",
      "Agent Name",
      "Legal Name",
      "Address",
      "State",
      "Mobile",
      "Date of Birth",
      "Date Of Join",
      "Date of Anniversary",
      "PAN",
      "GST",
    ];
    const formattedData = [
      columeName,
      ...data.map((item, index) => [
        index + 1,
        item.AgentName ? item.AgentName : "-",
        item.LegelName ? item.LegelName : "-",
        item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + item.Code,
        item.StateName ? item.StateName : "-",
        item.Mobile1 ? `+${item.Mobile1}` : "-",
        item.DOB ? moment(item.DOB).format("DD-MM-YYYY") : "No Date",
        item.DOJ ? moment(item.DOJ).format("DD-MM-YYYY") : "No Date",
        item.AnnivarsaryDate
          ? moment(item.AnnivarsaryDate).format("DD-MM-YYYY")
          : "No Date",
        item.PAN ? item.PAN : "-",
        item.GST ? item.GST : "-",
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Agent.xlsx");
  };
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet([]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Sample.xlsx");
  };
  const handlePrint = () => {
    const companyName =
      localStorage.getItem("CRMCompanyName") || "Your Company Name";
    const printContent = `
          < html >
            <head>
               <title>Print</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                p{
                    font-size: 25px;
                    font-weight:700;
                    text-align: center;
                }
              </style>
            </head>
            <body>
            <p> ${companyName}</p>
            <hr/>
            <div>
            <b>Total Record :- </b>${data.length}
            </div>
              <h4>Agent List :-</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                    <th>Agent Name</th>
                    <th>Legal Name</th>
                    <th>Address</th>
                    <th>State</th>
                    <th>Mobile</th>
                    <th>Date Of Birth</th>
                    <th>Date Of join</th>
                    <th>Date Of Annivarsary</th>
                    <th>PAN</th>
                    <th>GST</th>

                  </tr>
                </thead>
                <tbody>
                  ${data
        .map(
          (item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                      <td>${item.AgentName ? item.AgentName : "-"}</td>
                      <td>${item.LegelName ? item.LegelName : "-"}</td>
                      <td>${item.Add1 +
            " ," +
            item.Add2 +
            " ," +
            item.Add3 +
            " ," +
            (item.Code ? item.Code : "")
            }</td>
                      <td>${item.StateName ? item.StateName : "-"}</td>
                      <td>${item.Mobile1 ? `+${item.Mobile1}` : "-"}</td>
                      <td>${item.DOB
              ? moment(item.DOB).format("DD-MM-YYYY")
              : "No Date"
            }</td>
                      <td>${item.DOJ
              ? moment(item.DOJ).format("DD-MM-YYYY")
              : "No Date"
            }</td>
                      <td>${item.AnnivarsaryDate
              ? moment(item.AnnivarsaryDate).format("DD-MM-YYYY")
              : "No Date"
            }</td>
                      <td>${item.PAN ? item.PAN : "-"}</td>
                      <td>${item.GST ? item.GST : "-"}</td>
                    </tr>
                  `
        )
        .join("")}
                </tbody>
              </table>
            </body>
          </ >
  `;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger print after the content is loaded in the new tab
    printWindow.print();
  };
  const [isOpen, setIsOpen] = useState(false);
  const [convertdata, setConvertData] = useState([]);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div className={getAgentData ? "" : "content-wrapper"}>
      <section className="content-header close-btn-flex">
        <div>
          <div className="header-icon">
            {/* <i className="fa fa-users" /> */}
            <i class="fa fa-id-card-o" aria-hidden="true"></i>
          </div>
          <div className="header-title">
            <h1>Agent Master</h1>
            {/* <small>Party List</small> */}
          </div>
        </div>
        {getAgentData ? (
          <div>
            <div className="close-btn">
              <button
                type="button"
                className="close ml-auto"
                aria-label="Close"
                style={{ color: "black" }}
                onClick={onHide}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        ) : null}
      </section>
      <section className="content">
        <div className="row">
          <div className="col-lg-12 pinpin">
            <div className="card lobicard" data-sortable="true">
              <div className="card-header">
                <div className="title-download-section">
                  <div className="card-title custom_title">
                    <h4 className="report-heading">Agent List</h4>
                  </div>
                  <div className="d-flex">
                    <div class="upload-btn-wrapper">
                      {/* <ImportFile
                                                show={importfile}
                                                onHide={() => setImportFile(false)}
                                            /> */}
                      {/* <Space wrap>
                                                <Tooltip title="Import Excel" >
                                                    <LuImport className='import-icon' />
                                                    <input type="file" onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        readExcel(file);
                                                    }} />
                                                </Tooltip>
                                            </Space> */}
                    </div>

                    <div className="download-record-section">
                      <Space wrap>
                        <Tooltip title="Download PDF">
                          <FaFilePdf
                            className="downloan-icon"
                            onClick={generatePDF}
                          />
                        </Tooltip>
                      </Space>
                      <Space wrap>
                        <Tooltip title="Download Excel">
                          <RiFileExcel2Line
                            className="downloan-icon"
                            onClick={downloadExcel}
                          />
                        </Tooltip>
                      </Space>
                      <Space wrap>
                        <Tooltip title="Print">
                          <AiOutlinePrinter
                            className="downloan-icon"
                            onClick={handlePrint}
                          />
                        </Tooltip>
                      </Space>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3"
                role="group"
              >
                <div className="buttonexport" id="buttonlist">
                  <Button
                    className="btn btn-add rounded-2"
                    onClick={() => setPartyNew(true)}
                  >
                    <i className="fa fa-plus" /> Add Agent [F2]
                  </Button>
                  <PartyNewForm
                    show={partynew}
                    onHide={() => setPartyNew(false)}
                    fetchData={insertData.current}
                    getAgentData={getAgentData}
                  // username={username}
                  />
                  {/* <PartyNewForm
                                        visible={partynew}
                                        onHide={() => setPartyNew(false)}
                                        partynew = {partynew}
                                        fetchData={insertData.current}
                                        getAgentData={getAgentData}
                                    // username={username}
                                    /> */}
                </div>
                <div className="searching-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search here"
                    onChange={(event) => {
                      setSearchInput(event.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="p-3">
                <PartyTable
                  insertData={insertData}
                  searchinput={searchinput}
                  ondata={handleData}
                  getAgentData={getAgentData}
                  importdata={importdata}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartyMaster;
