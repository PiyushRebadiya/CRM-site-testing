import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import PerfomaTable from './PerfomaTable';
import PerfomaForm from './PerfomaForm';
import PartyForm from '../PartyMaster/PartyForm';
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
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'


function PerfomaNewForm(props) {
  const { fetchData } = props;
  // console.log(username, 'usernameusernameusernameusernameusername')
  return (
    <Modal
      // className='animate__animated animate__zoomIn'
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <PerfomaForm fetchData={fetchData} onHide={props.onHide} />
    </Modal>
  );
}
// function PerfomaNewForm(props) {
//   const { fetchData, fetchSalesData, onClose } = props;
//   // console.log(username, 'usernameusernameusernameusernameusername')
//   return (
//     <Drawer
//       // className='animate__animated animate__zoomIn'
//       {...props}
//             title="Add Proforma"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width={1670}
//     >
//       <PerfomaForm fetchData={fetchData} fetchSalesData={fetchSalesData} onHide={props.onHide} />
//     </Drawer>
//   );
// }

const PerfomaMaster = () => {
  const location = useLocation()
  const [perfomanew, setPerfomaNew] = React.useState(false);
  const [PINUMBER, SETPINUMBER] = useState('')
  const [performanewform, setPerformanewform] = React.useState(false);
  const [searchinput, setSearchInput] = useState("")
  const [showDataTable, setShowDataTable] = useState(true); // State to manage DataTable visibility
  const [data, setData] = useState([])
  const [editFormOpen, setEditFormOpen] = useState(false);
  const insertData = React.useRef(null);
  const insertSalesData = React.useRef(null);
  const token = localStorage.getItem('CRMtoken')
  const URL = process.env.REACT_APP_API_URL
  const companyId = localStorage.getItem("CRMCompanyId")
  const custId = localStorage.getItem("CRMCustId")

  // filter
  const fromDate = new Date()
  const formattedfrom = moment(fromDate).format('YYYY-MM-DD');
  const [fromdate, setFromDate] = useState(formattedfrom)
  const formattedto = moment(fromDate).format('YYYY-MM-DD');
  const [todate, setTodate] = useState(formattedto)
  const [filter, setFilter] = useState(false)
  const [partyData, setPartyData] = useState([])
  const [party, setParty] = useState(0)

  const handleClose = () => setFilter(false);
  const handleShow = () => setFilter(true);

  const getPartyData = async () => {
    try {
      const res = await axios.get(URL + `/api/Master/PartyList?CustId=${custId}&CompanyId=${companyId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setPartyData(res.data);
    } catch (error) {
      // Handle error
    }
  };
  useEffect(() => {
    getPartyData()
  }, [])

  const partyOptions = partyData.map((display) => ({
    value: display.PartyId,
    label: display.PartyName,
    // label: (
    //     <div>
    //         <div>{display.PartyName}<span style={{ fontSize: "10px", color: "grey" }}>{display.LegelName && (`(${display.LegelName})`)}</span></div>
    //     </div>
    // ),
  }));


  const getTranNo = async () => {
    try {
      const res = await axios.get(URL + `/api/Transation/GetTransationAddonList?CompanyID=${companyId}&TransMode=Proforma`, {
        headers: { Authorization: `bearer ${token}` }
      })
      SETPINUMBER(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewButtonClick = () => {
    setPerformanewform(true);
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

    // Check if the current location is '/proformaentry'
    const isProformaEntry = location.pathname === '/proformaentry';

    if (isProformaEntry) {
      // Move the "Proforma List" text down
      doc.setFontSize(13);
      doc.text(`Total Record :- ${data.length}`, 15, 20);
      doc.text('Proforma List :-', 15, 25);
    }

    const tableData = data.map((item, index) => [
      index + 1,
      item.PartyName ? item.PartyName : '-',
      item.TranNo ? item.Prefix + item.TranNo : '-',
      item.NetAmount ? item.NetAmount : '-',
      item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date',
      item.DueDate ? moment(item.DueDate).format('DD-MM-YYYY') : 'No Date',
      item.Remark ? item.Remark : '-',
    ]);

    // Adjust the startY value based on whether "Proforma List" is displayed
    const startY = isProformaEntry ? 30 : 20;

    doc.autoTable({
      head: [['No', 'Party Name', 'INV No.', 'Net Amount', 'Proforma Date', 'Due Date', 'Remark']],
      body: tableData,
      startY: startY,
    });

    doc.save('proforma.pdf');
  };

  const downloadExcel = () => {
    const columeName = ['No', 'Party Name', 'INV No.', 'Net Amount', 'Proforma Date', 'Due Date', 'Remark'];
    const formattedData = [
      columeName,
      ...data.map((item, index) => [
        index + 1,
        item.PartyName ? item.PartyName : '-',
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
    XLSX.writeFile(workbook, "Proforma.xlsx");
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
        <b>Tortal Record :- </b>${data.length}
        </div>
          <h4>Proforma List :-</h4>
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
          {/* <i className="fa fa-users" /> */}
          <i class="fa fa-file-text" aria-hidden="true"></i>
        </div>
        <div className='headeradjust'>
          <div className="header-title">
            <h1>Proforma</h1>
            {/* <small>Task details</small> */}
          </div>
          {/* <Button className="btn btn-add rounded-2" onClick={() => setInquiryNew(true)}>
                                Add Inquiry <i class="fa fa-plus" aria-hidden="true"></i>
                            </Button> */}
          {/* <i class="fa fa-filter fa-2x" onClick={handleShow} aria-hidden="true"></i> */}
          <Modal
            show={filter}
            onHide={handleClose}
            centered
            size='lg'
          >
            <Modal.Header closeButton>
              <Modal.Title>Filter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col lg={6}>
                  <div className='filter-form date-section-main w-100 p-1'>
                    <div className='date-lable left'>
                      <label>From Date :</label>
                    </div>
                    <div className='w-100'>
                      <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className='filter-label date-section-main w-100 p-1'>
                    <div className='date-lable left'>
                      <label>To Date :</label>
                    </div>
                    <div className='w-100'>
                      <input type='date' className='form-control w-100' value={todate} onChange={(event) => { setTodate(event.target.value) }} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <div className='filter-label date-section-main w-100 mt-4'>
                    <div className='date-lable'>
                      <label>Party :</label>
                    </div>
                    <div className='w-100 p-1'>
                      <Select
                        className=''
                        options={partyOptions}
                        value={partyOptions.find((option) => option.value == party)}
                        onChange={(selected) => {
                          setParty(selected.value)
                          // if (errors.party) {
                          //     setErrors(prevErrors => ({ ...prevErrors, party: '' }));
                          // }
                        }}
                        placeholder="Select Party"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button className='ms-2'
              // onClick={resetRecord}
              >
                Reset
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary"
              // onClick={DataSubmit}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          {/* <Popover
                            content={filterPop}
                            trigger="click"
                            open={open}
                            onOpenChange={handleOpenChange}
                        >
                            <Button type="primary"> <i class="fa fa-filter fa-2x" onClick={handleShow} aria-hidden="true"></i></Button>
                        </Popover> */}
        </div>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-lg-12 pinpin">
            <div className="card lobicard" data-sortable="true">
              <div className="card-header">
                <div className='title-download-section'>
                  <div className="card-title custom_title">
                    <h4 className='report-heading'>Proforma List</h4>
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
              {/* <PerfomaNewForm
                    show={perfomanew}
                    onHide={() => setPerfomaNew(false)}
                    fetchData={insertData.current}
                    fetchSalesData={insertSalesData.current}
                  /> */}
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
                    <PerfomaTable insertData={insertData} searchinput={searchinput} onData={handleData} editFormOpen={editFormOpen} handleNewButtonClick={handleNewButtonClick} />
                  </div>
                </div>
              )}
              {performanewform && (
                <PerfomaForm
                  onHide={() => {
                    setPerformanewform(false);
                    setShowDataTable(true);
                    // Show the DataTable when the form is closed
                  }}
                  fetchData={insertData.current}
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

export default PerfomaMaster