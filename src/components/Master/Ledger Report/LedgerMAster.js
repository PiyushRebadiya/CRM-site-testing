import React from 'react'
import { useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Space, Tooltip, Tabs } from 'antd';
import LedgerTable from './LedgerTable';

const LedgerMAster = () => {

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
    const [partylist, setPartyList] = useState([])
    const [selectedparty, setSelectedParty] = useState(0)
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('CRMtoken')
    const CustId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const URL = process.env.REACT_APP_API_URL

    const getPartyList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyListDropdown?CustId=${CustId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setPartyList(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // LedgerReportList()
        getPartyList()
    }, [])

    const DataSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URL + `/api/Transation/LedgerReport?CompanyID=${CompanyId}&PartyId=${selectedparty}&startdate=${fromdate}&endDate=${todate}`, {
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
        setData([])
    }, [location.pathname])

    const partyOptions = partylist.map((display) => ({
        value: display.PartyId,
        label: display.PartyName,
    }));

    const handlePartyChange = (selected) => {
        setSelectedParty(selected ? selected.value : 0);
    };

    const DataClear = () => {
        setFromDate(formattedfrom)
        setTodate(formattedto)
        setSelectedParty(0)
        // LedgerReportList();
        setData([]);
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
    }, [selectedparty, fromdate, todate, CompanyId]); // Add any other dependencies as needed

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                DataClear()
            }
        };

        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [fromdate, todate]);


    const filterPartyName = partylist.find((item) => item.PartyId == selectedparty)
    const generatePDF = () => {
        const doc = new jsPDF('landscape');
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');

        doc.text(` ${companyName}`, 120, 10);
        doc.line(110, 12, 180, 12); // Draw a horizontal line after companyName
        doc.setFontSize(12);
        doc.text(`From Date : ${moment(fromdate).format('DD/MM/YYYY')}`, 15, 18);
        doc.text(`To date : ${moment(todate).format('DD/MM/YYYY')}`, 15, 23);
        doc.text(`Party Name : ${(selectedparty === 0) ? '-' : filterPartyName.PartyName}`, 15, 28);
        doc.text(`Total Record : ${data.length}`, 15, 33);

        // const leftMargin = 15;
        doc.text('Task Report List :-', 15, 45);

        const tableData = data.map((item, index) => [
            index + 1,
            // item.PartyName ? item.PartyName : '',
            item.TransMode ? item.TransMode : '',
            item.TranNo ? item.Prefix + item.TranNo : '',
            item.TransDate ? moment(item.TransDate).format('DD/MM/YYYY') : 'No Date',
            item.Remark ? item.Remark : '',
            item.PaymentAmt ? item.PaymentAmt : '',
            item.ReceiptAmt ? item.ReceiptAmt : '',
            item.Balance ? item.Balance + " " + item.CRDR.toUpperCase() : '',
        ]);

        doc.autoTable({
            head: [['No', 'Trans No.', 'Trans Type', 'Trans Date', 'Remark', 'Debit', 'Credit', 'Balance']],
            body: tableData,
            startY: 48,
        });

        doc.save('LedgerReport.pdf');
    };
    const downloadExcel = () => {
        const columeName = ['No', 'Trans No.', 'Trans Type', 'Trans Date', 'Remark', 'Debit', 'Credit', 'Balance'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.TransMode ? item.TransMode : '',
                item.TranNo ? item.Prefix + item.TranNo : '',
                item.TransDate ? moment(item.TransDate).format('DD/MM/YYYY') : 'No Date',
                item.Remark ? item.Remark : '',
                item.PaymentAmt ? item.PaymentAmt : '',
                item.ReceiptAmt ? item.ReceiptAmt : '',
                item.Balance ? item.Balance + " " + item.CRDR.toUpperCase() : '',
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "LedgerReport.xlsx");
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
            <b>From Date :</b> ${moment(fromdate).format('DD/MM/YYYY')}<br/>
            <b>To date :</b> ${moment(todate).format('DD/MM/YYYY')}<br/>
            <b>Party Name :</b> ${(selectedparty === 0) ? 'All' : filterPartyName.PartyName}<br/>
            <b>Total Record :</b> ${data.length}<br/>
            </div>
              <h4>Ledger Report</h4>
              <table>
                <thead>
                  <tr>
                  <th>No.</th>
                  <th>Trans No</th>
                  <th>Trans Type</th>
                  <th>Trans Date</th>
                  <th>Remark</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${item.TranNo ? item.Prefix + item.TranNo : ''}</td>
                    <td>${item.TransMode ? item.TransMode : ''}</td>
                    <td>${item.TransDate ? moment(item.TransDate).format('DD/MM/YYYY') : 'No Date'}</td>
                    <td>${item.Remark ? item.Remark : ''}</td>
                    <td>${item.PaymentAmt ? item.PaymentAmt : ''}</td>
                    <td>${item.ReceiptAmt ? item.ReceiptAmt : ''}</td>
                    <td>${item.Balance ? item.Balance + " " + item.CRDR.toUpperCase() : ''}</td>
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
        <div>
            <div>
                <div className='content-wrapper'>
                    <section className="content-header">
                        <div className="header-icon">
                            {/* <i className="fa fa-users" /> */}
                            <i class="fa fa-book" aria-hidden="true"></i>
                        </div>
                        <div className="header-title">
                            <h1>Ledger Report</h1>
                            {/* <small>{`${location.pathname == '/taskregister' && 'Task' || location.pathname == '/expenseregister' && 'Expense List'} Report`}</small> */}
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
                                                <Col xl={3}>
                                                    <div className=' date-section-main w-100 p-1'>
                                                        <div className='date-lable w-50'>
                                                            <label>From Date :</label>
                                                        </div>
                                                        <div className='w-100'>
                                                            <input type='date' className='form-control w-100' value={fromdate} onChange={(event) => { setFromDate(event.target.value) }} />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl={3}>
                                                    <div className=' date-section-main w-100 p-1'>
                                                        <div className='w-50 date-lable'>
                                                            <label>To Date :</label>
                                                        </div>
                                                        <div className='w-100'>
                                                            <input type='date' className='form-control w-100' value={todate} onChange={(event) => { setTodate(event.target.value) }} />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl={3}>
                                                    <div className=' date-section-main w-100  p-1 '>
                                                        <div className=' w-50 date-lable'>
                                                            <label>Party Name :</label>
                                                        </div>
                                                        <Select
                                                            className='w-100'
                                                            options={partyOptions}
                                                            // value={partyOptions.find((option) => option.value == selectedparty)}
                                                            value={selectedparty ? partyOptions.find((option) => option.value === selectedparty) : null}
                                                            onChange={handlePartyChange}
                                                            // isClearable={true}
                                                            placeholder="Select Party"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col xl={2} >
                                                    <div className='ml-4 submit-record-data'>
                                                        <div className='report-submit-btn'>
                                                            <button onClick={DataSubmit} disabled={!selectedparty || loading} style={{ cursor: !selectedparty || loading ? 'not-allowed' : 'pointer' }}>
                                                                {loading ? 'Submit...' : 'Submit [F9]'}
                                                            </button>
                                                        </div>
                                                        <div className='report-submit-btn p-1'>
                                                            <button onClick={DataClear}
                                                            // disabled={selectedparty != 0 || selectedTask ? true : false}
                                                            >
                                                                Clear [Esc]</button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    {/* <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                        <div className="buttonexport" id="buttonlist">
                                        </div>
                                    </div> */}
                                    <div className='p-3' >
                                        <LedgerTable data={data} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default LedgerMAster