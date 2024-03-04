import React, { useEffect } from 'react'
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
import OutStandingTable from './OutStandingTable';
import Select from 'react-select';
import { Space, Tooltip } from 'antd';

const OutStandingMaster = () => {
    const location = useLocation()
    const [partylist, setPartyList] = useState([])
    const [data, setData] = useState([])
    const [selectedparty, setSelectedParty] = useState(0)
    const [loading, setLoading] = useState(false);
    const companyid = localStorage.getItem('CRMCompanyId')
    const token = localStorage.getItem('CRMtoken')
    const URL = process.env.REACT_APP_API_URL
    const custId = localStorage.getItem("CRMCustId")
    const Userid = localStorage.getItem('CRMUserId')

    const OutstandingList = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/OutStandingReport1?PartyId=0&CompanyID=${companyid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        OutstandingList()
    }, [])
    useEffect(() => {
        if (!selectedparty) {
            OutstandingList()
        }
    }, [selectedparty])

    const DataSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.get(URL + `/api/Transation/OutStandingReport1?PartyId=${selectedparty}&CompanyID=${companyid}`, {
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
    }, [selectedparty, companyid]); // Add any other dependencies as needed

    const getPartyList = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PartyList?CustId=${custId}&CompanyId=${companyid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setPartyList(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const partyOptions = partylist.map((display) => ({
        value: display.PartyId,
        label: display.PartyName,
    }));
    useEffect(() => {
        getPartyList()
    }, [])

    const fillterPartyName = partylist.find((item) => item.PartyId == selectedparty)
    const generatePDF = () => {
        const doc = new jsPDF();
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name';
        doc.setFont('Arial', 'bold');
        doc.text(` ${companyName}`, 70, 10);
        doc.line(70, 12, 140, 12);
        doc.setFontSize(12)
        doc.text(`Party Name : ${(selectedparty === 0) ? 'All' : fillterPartyName.PartyName}`, 15, 20);
        doc.text(`Total Record : ${data.length}`, 15, 25);
        const leftMargin = 15;
        doc.text('OutStanding Report :-', leftMargin, 30);
        const tableData = data.map((item, index) => [
            index + 1,
            item.PartyName,
            item.Balance
        ]);

        doc.autoTable({
            head: [['No', 'Party Name', 'Balance']],
            body: tableData,
            startY: 35,
        });

        doc.save('OutStanding.pdf');
    };
    const downloadExcel = () => {
        const columeName = ['No', 'Party Name', 'Balance'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.PartyName,
                item.Balance
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "OutStanding.xlsx");
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
            <p>${companyName}</p>
            <hr/>
            <div>
            <b>Party Name :</b> ${(selectedparty === 0) ? 'All' : fillterPartyName.PartyName}<br/>
            <b>Total Record :</b> ${data.length}
            </div>
              <h4>OutStanding Report :</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                  <th>Party Name</th>                                           
                  <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.PartyName}</td>
                      <td>${item.Balance}</td>
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
            <div className='content-wrapper'>
                <section className="content-header">
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-book" aria-hidden="true"></i>

                    </div>
                    <div className="header-title">
                        <h1>Sales OutStanding Report</h1>
                        {/* <small>OutStanding Report list</small> */}
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
                                            <Col lg={11}>
                                                <div className=' date-section-main w-100  p-1 '>
                                                    <div className=' date-lable'>
                                                        <label>Party Name :</label>
                                                    </div>
                                                    <Select
                                                        className='w-100'
                                                        options={partyOptions}
                                                        // value={partyOptions.find((option) => option.value == selectedparty)}
                                                        isClearable={true}
                                                        onChange={(selected) => {
                                                            setSelectedParty(selected ? selected.value : 0)
                                                        }}
                                                        placeholder="Select Party"
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg={1} className='submit-record-data'>
                                                <div className='report-submit-btn'>
                                                    <button onClick={DataSubmit} disabled={loading}>
                                                        {loading ? 'Submit...' : 'Submit [F9]'}
                                                    </button>
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
                                    <OutStandingTable data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default OutStandingMaster