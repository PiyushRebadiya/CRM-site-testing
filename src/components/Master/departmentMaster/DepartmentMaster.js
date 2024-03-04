import React, { useEffect } from 'react'
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
import { useState } from 'react';
import DepartmentForm from './DepartmentForm';
import DepartmentTable from './DepartmentTable';
import axios from 'axios'
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Space, Tooltip } from 'antd';

function DepartmentNewForm(props) {
    const { fetchData, getDepartmentData } = props;
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <DepartmentForm getDepartmentData={getDepartmentData} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}

const DepartmentMaster = ({ getDepartmentData, getProjectData, onHide, }) => {
    const [data, setData] = useState([])
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const [departmentnew, setDepartmentNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [rowData, setRowData] = useState()
    const cusId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/DepartmentList?CustId=${cusId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            // console.log(res, "response")
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setDepartmentNew(true);
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to ensure this effect runs only once
    const handleRowData = (rowData) => {
        setRowData(rowData)
    }
    const generatePDF = () => {
        const doc = new jsPDF();
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');
        doc.text(` ${companyName}`, 70, 10);
        doc.setFontSize(13)
        const leftMargin = 15;
        doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
        doc.text('Department List', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.DepartmentName ? item.DepartmentName : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Department']],
            body: tableData,
            startY: 30,
        });

        doc.save('Department.pdf');
    };

    const downloadExcel = () => {
        const columeName = ['No', 'Department'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.DepartmentName ? item.DepartmentName : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Department.xlsx");
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
            <b>Total Record :</b>${data.length}
            </div>
              <h4>Department List</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                  <th>DepartmentName</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `  
                    <tr>
                    <td>${index + 1}</td>
                      <td>${item.DepartmentName ? item.DepartmentName : '-'}</td>
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
        <>
            {/* <div className='content-wrapper'> */}
            <div>
                <section className="content-header close-btn-flex">
                    <div>
                        <div className="header-icon">
                            {/* <i className="fa fa-users" /> */}
                            <i class="fa fa-users" aria-hidden="true"></i>
                        </div>
                        <div className="header-title">
                            <h1>Department Master</h1>
                            {/* <small>Department List</small> */}
                        </div>
                    </div>
                    {/* </div> */}
                    {
                        getDepartmentData ? (<div>
                            <div className='close-btn'>
                                <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>) : null
                    }
                </section >
                <section className="content">
                    <div className="row">
                        <div className={getDepartmentData ? 'col-lg-12' : 'col-lg-6 col-md-12'}>
                            <DepartmentForm rowData={rowData} fetchData={fetchData} getProjectData={getProjectData} getDepartmentData={getDepartmentData} />
                        </div>
                        <div className={getDepartmentData ? 'col-lg-12 pinpin h-100' : 'col-lg-6 col-md-12 pinpin'}>
                            <div className="card lobicard" data-sortable="true">
                                <div className="card-header">
                                    <div className='title-download-section'>
                                        <div className="card-title custom_title">
                                            <h4 className='report-heading'>Department List</h4>
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
                                <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                    <div className='searching-input ml-auto'>
                                        <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                                    </div>
                                </div>
                                <div className='p-3' >
                                    <DepartmentTable data={data} searchinput={searchinput} onRow={handleRowData} fetchData={fetchData} getProjectData={getProjectData} getDepartmentData={getDepartmentData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </>
    )
}

export default DepartmentMaster