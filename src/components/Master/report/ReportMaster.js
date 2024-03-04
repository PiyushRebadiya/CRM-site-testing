import React, { useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import ReportTable from './ReportTable';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Space, Tooltip } from 'antd';
import { Popover, ConfigProvider } from 'antd';

const ReportMaster = () => {
    const location = useLocation()

    // From date as per Financial Year
    const from_Date = new Date();
    from_Date.setMonth(3); // April is month 3 (0-indexed)
    from_Date.setDate(1); // Set the day to 1
    // Adjust the year if the current month is before April
    if (new Date().getMonth() < 3) {
        from_Date.setFullYear(from_Date.getFullYear() - 1);
    }
    const formattedfrom = moment(from_Date).format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(formattedfrom);

    const to_Date = new Date();
    const formattedto = moment(to_Date).format('YYYY-MM-DD');
    const [todate, setTodate] = useState(formattedto)
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const [filter, setFilter] = useState(false)
    const companyid = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem('CRMtoken')
    const URL = process.env.REACT_APP_API_URL

    const ReceiptList = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationListReport1?CompanyID=${companyid}&TransMode=${location.pathname == '/receiptregister' && 'Receipt' || location.pathname == '/expenseregister' && 'Expense'}&startdate=${formattedfrom} &endDate=${formattedto}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        ReceiptList()
    }, [])

    const DataSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationListReport1?CompanyID=${companyid}&TransMode=${location.pathname == '/receiptregister' && 'Receipt' || location.pathname == '/expenseregister' && 'Expense'}&startdate=${fromdate} &endDate=${todate}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F9') {
                event.preventDefault();
                DataSubmit();
            }
        };

        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [fromdate, todate]); // Add any other dependencies as needed

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                DataClear();
            }
        };

        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [fromdate, todate]); // Add any other dependencies as needed
    const [reportKey, setReportKey] = useState(["PartyName", "CBJ", "No", "ChequeNo", "TransDate", "ChequeDate", "Amount"])
    const [dataStatus, setDataStatus] = useState([{
        key: "PartyName",
        value: "Party Name",
        id: 1,
    }, {
        key: "CBJ",
        value: "CBJ",
        id: 2,
    }, {
        key: "TranNo",
        value: "No",
        id: 3,
    }, {
        key: "TransDate",
        value: "Date",
        id: 4,
    }, {
        key: "ChequeNo",
        value: "Cheque No",
        id: 5,
    }, {
        key: "ChequeDate",
        value: "Cheque Date",
        id: 6,
    }, {
        key: "NetAmount",
        value: "Amount",
        id: 7,
    }])
    const Data = [{
        key: "PartyName",
        value: "Party Name",
        id: 1,
    }, {
        key: "CBJ",
        value: "CBJ",
        id: 2,
    }, {
        key: "TranNo",
        value: "No",
        id: 3,
    }, {
        key: "TransDate",
        value: "Date",
        id: 4,
    }, {
        key: "ChequeNo",
        value: "Cheque No",
        id: 5,
    }, {
        key: "ChequeDate",
        value: "Cheque Date",
        id: 6,
    }, {
        key: "NetAmount",
        value: "Amount",
        id: 7,
    }]
    const handleChecked = (key, value, status, id) => {
        if (status) {
            const AddData = Data.find((display) => display.id == id)
            const pushData = [...dataStatus]
            pushData.push(AddData)
            setDataStatus(pushData)
            setReportKey([...reportKey, key])
        } else {
            const removeRecord = dataStatus.filter((item) => item.id !== id)
            setDataStatus(removeRecord)
            const filterData = reportKey.filter((item) => item !== key)
            setReportKey(filterData)
        }
    }

    useEffect(() => {
        setData([])
        ReceiptList()
    }, [location.pathname])
    const buttonWidth = 80
    const text = <span>Title</span>;
    const content = (
        <div className='custom-export-data'>
            <div>
                <p><label><input type="checkbox" checked={reportKey.includes("PartyName") && true} onChange={(e) => {
                    handleChecked("PartyName", "Party Name", e.target.checked, 1)
                }} />PartyName</label></p>
                <p><label><input type="checkbox" checked={reportKey.includes("CBJ") == true} onChange={(e) => {
                    handleChecked("CBJ", "CBJ", e.target.checked, 2)
                }} />CBJ</label></p>
                <p><label><input type="checkbox" checked={reportKey.includes("No") == true} onChange={(e) => {
                    handleChecked("No", "No", e.target.checked, 3)
                }} />No</label></p>
                <p><label><input type="checkbox" checked={reportKey.includes("TransDate") == true} onChange={(e) => {
                    handleChecked("TransDate", "Date", e.target.checked, 4)
                }} />Date</label></p>
                <p><label><input type="checkbox" checked={reportKey.includes("ChequeNo") == true} onChange={(e) => {
                    handleChecked("ChequeNo", "Cheque No", e.target.checked, 5)
                }} />Cheque No</label></p>
                <p><label><input type="checkbox" checked={reportKey.includes("ChequeDate") == true} onChange={(e) => {
                    handleChecked("ChequeDate", "Cheque Date", e.target.checked, 6)
                }} />Cheque Date</label></p>
                <p><label><input type="checkbox" checked={reportKey.includes("Amount") == true} onChange={(e) => {
                    handleChecked("Amount", "Amount", e.target.checked, 7)
                }} />Amount</label></p>
            </div>
        </div>
    );
    const generatePDF = () => {
        const doc = new jsPDF();
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');

        doc.text(`${companyName}`, 70, 10);
        doc.line(70, 12, 140, 12); // Draw a horizontal line after companyName
        doc.setFontSize(12);
        doc.text(`From Date : ${moment(fromdate).format('DD/MM/YYYY')}`, 15, 18);
        doc.text(`To date : ${moment(todate).format('DD/MM/YYYY')}`, 15, 23);
        doc.text(`Total Record : ${data.length}`, 15, 28);
        const reportListTitle = (location.pathname == '/receiptregister' && 'Receipt Report List :-') || (location.pathname == '/expenseregister' && 'Expense Report List :-');
        doc.setFontSize(13);
        doc.text(`${reportListTitle}`, 15, 33);

        const tableData = data.map((item, index) => [
            index + 1,
            item.PartyName ? item.PartyName : '-',
            item.CBJ ? item.CBJ : '-',
            item.TranNo ? item.TranNo : '-',
            item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date',
            item.ChequeNo ? item.ChequeNo : 'No Cheque',
            item.ChequeDate ? moment(item.ChequeDate).format('DD-MM-YYYY') : 'No Date',
            item.NetAmount ? item.NetAmount : '-'
        ]);

        doc.autoTable({
            head: [['No', 'Party Name', 'CBJ', 'No', 'Date', 'Cheque No.', 'Cheque Date', 'Amount']],
            body: tableData,
            startY: 35, // Adjust startY value to leave space for company name and report list title
        });

        doc.save(`${location.pathname == '/receiptregister' && 'Receipt' || location.pathname == '/expenseregister' && 'Expense'}.pdf`);
    };

    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, `${location.pathname == '/receiptregister' && 'Receipt' || location.pathname == '/expenseregister' && 'Expense'}.xlsx`);
    // };
    const downloadExcel = () => {
        const columeName = ['No', 'Party Name', 'CBJ', 'No', 'Date', 'Cheque No.', 'Cheque Date', 'Amount'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.PartyName ? item.PartyName : '-',
                item.CBJ ? item.CBJ : '-',
                item.TranNo ? item.TranNo : '-',
                item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date',
                item.ChequeNo ? item.ChequeNo : 'No Cheque',
                item.ChequeDate ? moment(item.ChequeDate).format('DD-MM-YYYY') : 'No Date',
                item.NetAmount ? item.NetAmount : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${location.pathname == '/receiptregister' && 'Receipt' || location.pathname == '/expenseregister' && 'Expense'}.xlsx`);
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
                    text-align:center;
                }
              </style>
            </head>
            <body>
            <p> ${companyName}</p>
            <hr/>
            <div>
            <b>From Date:</b> ${moment(fromdate).format('DD/MM/YYYY')}<br/>
            <b>To Date:</b> ${moment(todate).format('DD/MM/YYYY')}<br/>
            <b>Total Record:</b> ${data.length}
        </div>
              <h5>${`${location.pathname == '/receiptregister' && 'Receipt' || location.pathname == '/expenseregister' && 'Expense'} Report :`}</h5>
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Party Name</th>
                    <th>CBJ</th>
                    <th>No</th>
                    <th>Date</th>
                    <th>Cheque No.</th>
                    <th>Cheque Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.PartyName ? item.PartyName : '-'}</td>
                      <td>${item.CBJ ? item.CBJ : '-'}</td>
                      <td>${item.TranNo ? item.TranNo : '-'}</td>
                      <td>${item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date'}</td>
                      <td>${item.ChequeNo ? item.ChequeNo : 'No Cheque'}</td>
                      <td>${item.ChequeDate ? moment(item.ChequeDate).format('DD-MM-YYYY') : 'No Date'}</td>
                      <td>${item.NetAmount ? item.NetAmount : '-'}</td>
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
    const handleClose = () => setFilter(false);
    const handleShow = () => setFilter(true);

    const resetRecord = () => {
        setFromDate(formattedfrom)
        setTodate(formattedto)
    }
    const DataClear = () => {
        setFromDate(formattedfrom)
        setTodate(formattedto)
        ReceiptList()
    }
    return (
        <div>
            <div className='content-wrapper'>
                <section className="content-header">
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-book" aria-hidden="true"></i>
                    </div>
                    <div className='headeradjust'>
                        <div className="header-title">
                            <h1>{`${location.pathname == '/receiptregister' && 'Receipt' || location.pathname == '/expenseregister' && 'Expense'} Report`}</h1>
                            {/* <small>{`${location.pathname == '/receiptregister' && 'Receipt  List' || location.pathname == '/expenseregister' && 'Expense List'} Report`}</small> */}
                        </div>
                        {/* <i class="fa fa-filter fa-2x" style={{ cursor: "pointer" }} onClick={handleShow} aria-hidden="true"></i>
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
                                        <div className='w-100 date-section-main p-1'>
                                            <div className='date-lable'>
                                                <label>From Date :</label>
                                            </div>
                                            <div className='w-100'>
                                                <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className='w-100 date-section-main p-1'>
                                            <div className='-50 date-lable'>
                                                <label>To Date :</label>
                                            </div>
                                            <div className='w-100'>
                                                <input type='date' className='form-control' value={todate} onChange={(event) => { setTodate(event.target.value) }} />
                                            </div>
                                        </div>
                                    </Col> 
                                    <Col lg={2} className='submit-record-data'>
                                    <div className='report-submit-btn'>
                                        <button onClick={DataSubmit} disabled={loading}>
                                            {loading ? 'Submit...' : 'Submit'}
                                        </button>
                                    </div>
                                    <div className='report-submit-btn p-1'>
                                        <button onClick={DataClear} disabled={loading}>
                                            Clear
                                        </button>
                                    </div>
                                </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className='ms-2' onClick={resetRecord}>
                                    Reset
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={DataSubmit}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal> */}
                    </div>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 pinpin">
                            <div className="card lobicard" data-sortable="true">
                                <div className="card-header">
                                    <div className='title-download-section'>
                                        <div className="card-title custom_title">
                                            <h4 className='report-heading'>Report List</h4>
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
                                            {/* <ConfigProvider
                                                button={{
                                                    style: {
                                                        width: buttonWidth,
                                                        margin: 4,
                                                    },
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        marginInlineStart: buttonWidth,
                                                        clear: 'both',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    <Popover placement="bottom" title={text} content={content}>
                                                        <AiOutlinePrinter className='downloan-icon' />
                                                    </Popover>

                                                </div>
                                            </ConfigProvider> */}



                                        </div>
                                    </div>
                                </div>
                                <div className='card-body report-section'>
                                    <div className='report-date-main-section'>
                                        <Row>
                                            <Col lg={5}>
                                                <div className='w-100 date-section-main p-1'>
                                                    <div className='date-lable'>
                                                        <label>From Date :</label>
                                                    </div>
                                                    <div className='w-100'>
                                                        <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={5}>
                                                <div className='w-100 date-section-main p-1'>
                                                    <div className='-50 date-lable'>
                                                        <label>To Date :</label>
                                                    </div>
                                                    <div className='w-100'>
                                                        <input type='date' className='form-control' value={todate} onChange={(event) => { setTodate(event.target.value) }} />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={2} className='submit-record-data'>
                                                <div className='report-submit-btn'>
                                                    <button onClick={DataSubmit} disabled={loading}>
                                                        {loading ? 'Submit...' : 'Submit[F9]'}
                                                    </button>
                                                </div>
                                                <div className='report-submit-btn p-1'>
                                                    <button onClick={DataClear} disabled={loading}>
                                                        Clear [Esc]
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className='p-3' >
                                    <ReportTable data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ReportMaster