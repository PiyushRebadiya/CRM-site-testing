import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import ProformaSalesTable from './ProformaSalesTable';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Space, Tooltip } from 'antd';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ProformaSalesMaster = () => {
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
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(false)
    const companyid = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem('CRMtoken')
    const Userid = localStorage.getItem('CRMUserId')
    const URL = process.env.REACT_APP_API_URL
    const [submitdata, setSubmitData] = useState(1);
    const [searchinput, setSearchInput] = useState("");

    const ProformaReportList = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationListReport1?CompanyID=${companyid}&TransMode=${location.pathname == '/salesregister' && 'Sales' || location.pathname == '/proformaregister' && 'Proforma' || location.pathname == '/purchaseregister' && 'Purchase'}&startdate=${formattedfrom} &endDate=${formattedto}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        ProformaReportList()
    }, [])

    useEffect(() => {
        setData([])
        ProformaReportList()
    }, [location.pathname])


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
    }, [fromdate, todate]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key == 'Escape') {
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
    }, [submitdata]);

    const DataSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationListReport1?CompanyID=${companyid}&TransMode=${location.pathname == '/salesregister' && 'Sales' || location.pathname == '/proformaregister' && 'Proforma' || location.pathname == '/purchaseregister' && 'Purchase'} &startdate=${fromdate} &endDate=${todate}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
            handleClose();
            setSubmitData(submitdata + 1)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');

        // Set company name
        doc.text(` ${companyName}`, 70, 10);
        doc.line(70, 12, 140, 12); // Draw a horizontal line after companyName
        doc.setFontSize(12);
        doc.text(`From Date : ${moment(fromdate).format('DD/MM/YYYY')}`, 15, 18);
        doc.text(`To date : ${moment(todate).format('DD/MM/YYYY')}`, 15, 23);
        doc.text(`Total Record : ${data.length}`, 15, 28);

        const reportListTitle = (location.pathname == '/proformaregister' && 'Proforma Report :-') || (location.pathname == '/salesregister' && 'Sales Report :-') || (location.pathname == '/purchaseregister' && 'Purchase Report :-');
        doc.setFontSize(13);
        doc.text(`${reportListTitle}`, 15, 33);

        const tableData = data.map((item, index) => [
            index + 1,
            item.PartyName ? item.PartyName : '-',
            location.pathname == '/purchaseregister' ? (item.PurchaseNo ? item.PurchaseNo : '-') : (item.TranNo ? item.Prefix + item.TranNo : '-'),
            item.TransDate ? moment(item.TransDate).format('DD/MM/YYYY') : 'No Date',
            item.DueDate ? moment(item.DueDate).format('DD/MM/YYYY') : 'No Date',
            item.Remark ? item.Remark : '-',
            item.NetAmount ? item.NetAmount : '-'
        ]);

        doc.autoTable({
            head: [['No.', 'Party Name', 'INV No.', 'Date', 'DueDate', 'Remark', 'Amount']],
            body: tableData,
            startY: 35, // Adjust startY value to leave space for company name and report list title
        });

        doc.save(`${location.pathname == '/proformaregister' && 'Proforma' || location.pathname == '/salesregister' && 'Sales' || location.pathname == '/purchaseregister' && 'Purchase'}.pdf`);
    };
    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, `${location.pathname == '/proformaregister' && 'Proforma' || location.pathname == '/salesregister' && 'Sales' || location.pathname == '/purchaseregister' && 'Purchase'}.xlsx`);
    // };
    const downloadExcel = () => {
        const columeName = ['No.', 'Party Name', 'INV No.', 'Date', 'DueDate', 'Remark', 'Amount'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.PartyName ? item.PartyName : '-',
                location.pathname == '/purchaseregister' ? (item.PurchaseNo ? item.PurchaseNo : '-') : (item.TranNo ? item.Prefix + item.TranNo : '-'),
                item.TransDate ? moment(item.TransDate).format('DD/MM/YYYY') : 'No Date',
                item.DueDate ? moment(item.DueDate).format('DD/MM/YYYY') : 'No Date',
                item.Remark ? item.Remark : '-',
                item.NetAmount ? item.NetAmount : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${location.pathname == '/proformaregister' && 'Proforma' || location.pathname == '/salesregister' && 'Sales' || location.pathname == '/purchaseregister' && 'Purchase'}.xlsx`);
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
                    text-align:center
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
              <h5>${`${location.pathname == '/proformaregister' && 'Proforma' || location.pathname == '/salesregister' && 'Sales' || location.pathname == '/purchaseregister' && 'Purchase'} Report :`}</h5>
              <table>
                <thead>
                  <tr>
                  <th>No.</th>
                  <th>Party Name</th>
                  <th> INV No.</th>
                  <th>Date</th>
                  <th>DueDate</th>
                  <th>Remark</th>
                  <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                ${data.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.PartyName ? item.PartyName : '-'}</td>
                  <td>${location.pathname == '/purchaseregister' ? (item.PurchaseNo ? item.PurchaseNo : '-') : (item.TranNo ? item.Prefix + item.TranNo : '-')}</td>
                  <td>${item.TransDate ? moment(item.TransDate).format('DD/MM/YYYY') : 'No Date'}</td>
                  <td>${item.DueDate ? moment(item.DueDate).format('DD/MM/YYYY') : 'No Date'}</td>
                  <td>${item.Remark ? item.Remark : '-'}</td>
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
    const DataClear = () => {
        setFromDate(formattedfrom)
        setTodate(formattedto)
        ProformaReportList()
    }
    const handleClose = () => setFilter(false);
    const handleShow = () => setFilter(true);
    const resetRecord = () => {
        setFromDate(formattedfrom)
        setTodate(formattedto)
    }


    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput?.toLowerCase();
        const INVNo = `${item?.Prefix}${item?.TranNo}`
        const transDate = item?.TransDate && moment(item.TransDate).format('DD/MM/YYYY').toLowerCase();
        const dueDate = item?.DueDate && moment(item.DueDate).format('DD/MM/YYYY').toLowerCase();
        return (
            (item?.PartyName && item?.PartyName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (INVNo && INVNo.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item?.Remark && item.Remark.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (item?.NetAmount && String(item.NetAmount).toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            (transDate && transDate.includes(searchTermLowerCase)) ||
            (dueDate && dueDate.includes(searchTermLowerCase)) 
        );
    });
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
                            <h1>{`${location.pathname == '/proformaregister' && 'Proforma' || location.pathname == '/salesregister' && 'Sales' || location.pathname == '/purchaseregister' && 'Purchase'} Report`}</h1>
                            {/* <small>{`${location.pathname == '/proformaregister' && 'Proforma  List' || location.pathname == '/salesregister' && 'Sales List'} Report`}</small> */}
                        </div>
                        {/* <i class="fa fa-filter fa-2x" aria-hidden="true"></i> */}
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

                                        </div>
                                    </div>
                                </div>
                                <div className='card-body report-section'>
                                    <div className='report-date-main-section'>
                                        <Row>
                                            <Col lg={3}>
                                                <div className='w-100 date-section-main p-1'>
                                                    <div className='date-lable'>
                                                        <label>From Date :</label>
                                                    </div>
                                                    <div className='w-100'>
                                                        <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={3}>
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
                                                        {loading ? 'Submit...' : 'Submit [F9]'}
                                                    </button>
                                                </div>
                                                <div className='report-submit-btn p-1'>
                                                    <button onClick={DataClear} disabled={loading}>
                                                        Clear [Esc]
                                                    </button>
                                                </div>
                                            </Col>
                                            <Col lg={2} className='ml-auto'>
                                                <div className='w-100 date-section-main p-1'>
                                                    <div className='w-100'>
                                                        <input type='text' placeholder='Search here' className='form-control' onChange={(event) => { setSearchInput(event.target.value.trim()) }} />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className='p-3' >
                                    <ProformaSalesTable data={filteredData || data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ProformaSalesMaster