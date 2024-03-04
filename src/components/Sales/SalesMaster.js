import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import SalesDataTable from './SalesDataTable';
import SalesForm from './SalesForm';
import { useLocation } from 'react-router-dom'
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import moment from 'moment';
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import 'animate.css';
import { Drawer } from 'antd';
import axios from 'axios'
import { Space, Tooltip } from 'antd';

const SalesMaster = () => {
  const location = useLocation()
  const [salesnewform, setSalesNewForm] = React.useState(false);
  const [searchinput, setSearchInput] = useState("")
  const [PINUMBER, SETPINUMBER] = useState('')
  const [showDataTable, setShowDataTable] = useState(true); // State to manage DataTable visibility
  const [data, setData] = useState([])
  const [editFormOpen, setEditFormOpen] = useState(false);
  const insertData = React.useRef(null);
  const insertSalesData = React.useRef(null);
  const token = localStorage.getItem('CRMtoken')
  const URL = process.env.REACT_APP_API_URL
  const companyId = localStorage.getItem("CRMCompanyId")

  const getTranNo = async () => {
    try {
      const res = await axios.get(URL + `/api/Transation/GetTransationAddonList?CompanyID=${companyId}&TransMode=Sales`, {
        headers: { Authorization: `bearer ${token}` }
      })
      SETPINUMBER(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewButtonClick = () => {
    setSalesNewForm(true);
    getTranNo();
    setShowDataTable(false);
  }

  // useEffect(() => {
  //   // Function to handle keypress event
  //   function handleKeyPress(event) {
  //     if (event.key === 'F2') {
  //       handleNewButtonClick();
  //     }
  //   }

  //   // Add event listener for keypress
  //   window.addEventListener('keydown', handleKeyPress);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, []); // Empty dependency array to ensure this effect runs only once

  const handleData = (data) => {
    setData(data)
  }
  const generatePDF = () => {
    const doc = new jsPDF();
    const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
    doc.setFont('Arial', 'bold');
    doc.text(` ${companyName}`, 70, 10);
    doc.setFontSize(13)
    const leftMargin = 15;
    doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
    doc.text('Sales List :-', leftMargin, 25);
    const tableData = data.map((item, index) => [
      index + 1,
      item.PartyName ? item.PartyName : 'No Date',
      item.TranNo ? item.Prefix + item.TranNo : '-',
      item.NetAmount ? item.NetAmount : '-',
      item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date',
      item.DueDate ? moment(item.DueDate).format('DD-MM-YYYY') : 'No Date',
      item.Remark ? item.Remark : '-',
    ]);

    doc.autoTable({
      head: [['No', 'Party Name', 'INV No.', 'NetAmount', 'TransDate', 'DueDate', 'Remark']],
      body: tableData,
      startY: 30,
    });

    doc.save('Sales.pdf');
  };
  const downloadExcel = () => {
    const columeName = ['No', 'Party Name', 'INV No.', 'NetAmount', 'TransDate', 'DueDate', 'Remark'];
    const formattedData = [
      columeName,
      ...data.map((item, index) => [
        index + 1,
        item.PartyName ? item.PartyName : 'No Date',
        item.TranNo ? item.Prefix + item.TranNo : '-',
        item.NetAmount ? item.NetAmount : '-',
        item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date',
        item.DueDate ? moment(item.DueDate).format('DD-MM-YYYY') : 'No Date',
        item.Remark ? item.Remark : '-'
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Sales.xlsx");
  };
  const handlePrint = () => {
    const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name';

    const printContent = `
   
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
          <h4>Sales List :-</h4>
          <table>
            <thead>
              <tr>
              <th>No</th>
              <th>Party Name</th>
              <th>INV No.</th>
              <th>Net Amount</th>
              <th>Poforma Date</th>
              <th>Due Date</th>
              <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item, index) => `
                <tr>
                <td>${index + 1}</td>
                <td>${item.PartyName ? item.PartyName : '-'}</td>
                <td>${item.TranNo ? item.Prefix + item.TranNo : '-'}</td>
                <td>${item.NetAmount ? item.NetAmount : '-'}</td>
                <td>${item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date'}</td>
                <td>${item.DueDate ? moment(item.DueDate).format('DD-MM-YYYY') : 'No Date'}</td>
                <td>${item.Remark ? item.Remark : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </ >
  `;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger print after the content is loaded in the new tab
    printWindow.print();
  };
  return (
    <div className='content-wrapper'>
      <section className="content-header">
        <div className="header-icon">
          <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        </div>
        <div className="header-title">
          <h1>Sales</h1>
          {/* <small>{`${ location.pathname == '/proformaentry' && "Proforma" || location.pathname == '/sales' && 'Sales' } List`}</small> */}
        </div>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-lg-12 pinpin">
            <div className="card lobicard" data-sortable="true">
              <div className="card-header">
                <div className='title-download-section'>
                  <div className="card-title custom_title">
                    <h4 className='report-heading'>Sales List</h4>
                  </div>
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

                  </div>
                </div>
              </div>
              {/* <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                <div className="buttonexport" id="buttonlist">
                  <Button className="btn btn-add rounded-2" onClick={() => setPerfomaNew(true)}>
                    <i className="fa fa-plus" /> Add {`${location.pathname == '/proformaentry' && "Proforma [F2]" || location.pathname == '/sales' && 'Sales [F2]'} `}
                  </Button>
                  <PerfomaNewForm
                    show={perfomanew}
                    onHide={() => setPerfomaNew(false)}
                    fetchData={insertData.current}
                    fetchSalesData={insertSalesData.current}
                  />


                </div>
                <div className='searching-input'>
                  <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />

                </div>
              </div>
              <div className='p-3' >
                <PerfomaTable insertData={insertData} insertSalesData={insertSalesData} searchinput={searchinput} onData={handleData} />
              </div> */}
              {showDataTable && (
                <div>
                  <div className='party-main-section'>
                    <SalesDataTable searchinput={searchinput} onData={handleData} editFormOpen={editFormOpen} insertSalesData={insertSalesData} handleNewButtonClick={handleNewButtonClick} />
                  </div>
                </div>
              )}
              {salesnewform && (
                <SalesForm
                  onHide={() => {
                    setSalesNewForm(false);
                    setShowDataTable(true);
                  }}
                  fetchSalesData={insertSalesData.current}
                  PINUMBER={PINUMBER}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SalesMaster