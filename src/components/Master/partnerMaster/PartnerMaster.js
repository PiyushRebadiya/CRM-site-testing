import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import PartnerForm from "./PartnerForm";
import PartyTable from "../PartyMaster/PartyTable";
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
// import PartyRecordImport from './PartyRecordImport'
import { TableFlowImporter } from "@tableflow/react";
import { Space, Tooltip } from "antd";
import PartnerTable from "./PartnerTable";

function PartnerNewForm(props) {
  const { fetchData, getPartnerData } = props;
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <PartnerForm
        getPartnerData={getPartnerData}
        fetchData={fetchData}
        onHide={props.onHide}
      />
    </Modal>
  );
}

const PartnerMaster = ({ getPartnerData, onHide }) => {
  const location = useLocation();
  const [partnerNew, setPartnerNew] = React.useState(false);
  const [searchinput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [importdata, setImportData] = useState([]);
  const insertData = React.useRef(null);
  const [importfile, setImportFile] = useState(false);

  useEffect(() => {
    // Function to handle keypress event
    function handleKeyPress(event) {
      if (event.key === "F2") {
        setPartnerNew(true);
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
    const doc = new jsPDF('landscape');
    const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
    doc.setFont('Arial', 'bold');
    doc.text(` ${companyName}`, 120, 10);
    doc.setFontSize(13)
    const leftMargin = 15;
    doc.text(`Total Record :- ${data.length}`, leftMargin, 15);
    doc.text('Partner List :', leftMargin, 19);
    const tableData = data.map((item, index) => [
        index + 1,
        item.PartnerName ? item.PartnerName : "-",
        item.LegelName ? item.LegelName : "-",
        item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + item.Code,
        item.StateName ? item.StateName : "-",
        item.Mobile1 ? item.Mobile1 : "-",
        item.DOB ? moment(item.DOB).format('DD-MM-YYYY') : "No Date",
        item.DOJ ? moment(item.DOJ).format('DD-MM-YYYY') : "No Date",
        item.AnnivarsaryDate ? moment(item.AnnivarsaryDate).format('DD-MM-YYYY') : "No Date",
        item.PAN ? item.PAN : "-",
        item.GST ? item.GST : "-",
    ]);

    doc.autoTable({
        head: [['No', 'Partner Name', 'Legal Name', "Address", 'State', 'Mobile', 'Date of Birth', 'Date Of Join', 'Date of Anniversary', 'PAN', 'GST']],
        body: tableData,
        startY: 20,
    });

    doc.save('Partner.pdf');
};

const downloadExcel = () => {
    const columeName = ['No', 'Partner Name', 'Legal Name', "Address", 'State', 'Mobile', 'Date of Birth', 'Date Of Join', 'Date of Anniversary', 'PAN', 'GST'];
    const formattedData = [
        columeName,
        ...data.map((item, index) => [
            index + 1,
            item.PartnerName ? item.PartnerName : "-",
            item.LegelName ? item.LegelName : "-",
            item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + item.Code,
            item.StateName ? item.StateName : "-",
            item.Mobile1 ? item.Mobile1 : "-",
            item.DOB ? moment(item.DOB).format('DD-MM-YYYY') : "No Date",
            item.DOJ ? moment(item.DOJ).format('DD-MM-YYYY') : "No Date",
            item.AnnivarsaryDate ? moment(item.AnnivarsaryDate).format('DD-MM-YYYY') : "No Date",
            item.PAN ? item.PAN : "-",
            item.GST ? item.GST : "-"
        ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Partner.xlsx");
};
  const handlePrint = () => {
    const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name';
    const printContent = `
      <html>
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
          <h4>Partner List:</h4>
          <table>
            <thead>
              <tr>
              <th>No</th>
                <th>Partner Name</th>
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
              ${data.map((item, index) => `
                <tr>
                <td>${index + 1}</td>
                  <td>${item.PartnerName ? item.PartnerName : '-'}</td>
                  <td>${item.LegelName ? item.LegelName : "-"}</td>
                  <td>${item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + (item.Code ? item.Code : '')}</td>
                  <td>${item.StateName ? item.StateName : '-'}</td>
                  <td>${item.Mobile1 ? item.Mobile1 : '-'}</td>
                  <td>${item.DOB ? moment(item.DOB).format('DD-MM-YYYY') : 'No Date'}</td>
                  <td>${item.DOJ ? moment(item.DOJ).format('DD-MM-YYYY') : 'No Date'}</td>
                  <td>${item.AnnivarsaryDate ? moment(item.AnnivarsaryDate).format('DD-MM-YYYY') : 'No Date'}</td>
                  <td>${item.PAN ? item.PAN : '-'}</td>
                  <td>${item.GST ? item.GST : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger print after the content is loaded in the new tab
    printWindow.print();
};

  return (
    <div className={getPartnerData ? '' : 'content-wrapper'}>
    <section className="content-header close-btn-flex">
        <div>
            <div className="header-icon">
                {/* <i className="fa fa-users" /> */}
                <i class="fa fa-id-card-o" aria-hidden="true"></i>
            </div>
            <div className="header-title">
                <h1>Partner Master</h1>
                {/* <small>Party List</small> */}
            </div>
        </div>
        {
            getPartnerData ? (<div>
                <div className='close-btn'>
                    <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>) : null
        }
    </section>
    <section className="content">
        <div className="row">
            <div className="col-lg-12 pinpin">
                <div className="card lobicard" data-sortable="true">
                    <div className="card-header">
                        <div className='title-download-section'>
                            <div className="card-title custom_title">
                                <h4 className='report-heading'>Partner List</h4>
                            </div>
                            <div className='d-flex'>
                                <div className='download-record-section'>
                                    <Space wrap>
                                        <Tooltip title="Download PDF" >
                                            <FaFilePdf className='downloan-icon' onClick={generatePDF} />
                                        </Tooltip>
                                    </Space>
                                    <Space wrap>
                                        <Tooltip title="Download Excel" >
                                            <RiFileExcel2Line className='downloan-icon' onClick={downloadExcel} />
                                        </Tooltip>
                                    </Space>
                                    <Space wrap>
                                        <Tooltip title="Print" >
                                            <AiOutlinePrinter className='downloan-icon' onClick={handlePrint} />
                                        </Tooltip>
                                    </Space>
                                    {/* <Space wrap>
                                        <Tooltip title="Sample Download Excel" >
                                            <div className='sample-download-excel' onClick={handleDownload} >
                                                <span>Download Sample File</span>
                                            </div>
                                        </Tooltip>
                                    </Space> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                        <div className="buttonexport" id="buttonlist">
                            <Button className="btn btn-add rounded-2" onClick={() => setPartnerNew(true)}>
                                <i className="fa fa-plus" /> Add Partner [F2]
                            </Button>
                            <PartnerNewForm
                                show={partnerNew}
                                onHide={() => setPartnerNew(false)}
                                fetchData={insertData.current}
                                getPartnerData={getPartnerData}
                            // username={username}
                            />
                            {/* <PartyNewForm
                                visible={partynew}
                                onHide={() => setPartyNew(false)}
                                partynew = {partynew}
                                fetchData={insertData.current}
                                getPartyData={getPartyData}
                            // username={username}
                            /> */}
                        </div>
                        <div className='searching-input'>
                            <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                        </div>
                    </div>
                    <div className='p-3' >
                        <PartnerTable insertData={insertData} searchinput={searchinput} ondata={handleData} getPartnerData={getPartnerData} importdata={importdata} />
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
  )
};

export default PartnerMaster;
