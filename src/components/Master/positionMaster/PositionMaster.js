import React, { useEffect } from 'react'
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
import { useState } from 'react';
import PositionForm from './PositionForm';
import PositionTable from './PositionTable';
import axios from 'axios'
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Space, Tooltip } from 'antd';

const PositionMaster = ({ getPositionData, projectdata, onHide }) => {
    const [data, setData] = useState([])
    const URL = process.env.REACT_APP_API_URL
    const token = localStorage.getItem('CRMtoken')
    const cusId = localStorage.getItem('CRMCustId')
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const [departmentnew, setDepartmentNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [rowData, setRowData] = useState()

    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Master/PositionList?CustId=${cusId}&CompanyId=${CompanyId}`, {
                headers: { Authorization: `bearer ${token}` }
            })
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
        const leftMargin = 20;
        doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
        doc.text('Designation List', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.PositionName ? item.PositionName : '-',
            item.DepartmentName ? item.DepartmentName : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Designation ', 'Department Name']],
            body: tableData,
            startY: 30,
        });

        doc.save('Designation.pdf');
    };
    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'Position.xlsx');
    // };
    const downloadExcel = () => {
        const columeName = ['No', 'Designation ', 'Department Name'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.PositionName ? item.PositionName : '-',
                item.DepartmentName ? item.DepartmentName : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Position.xlsx");
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
            <b>Total Record :-</b>${data.length}
            </div>
              <h4>Position List</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                  <th>Designation  Name</th>
                  <th>Department Name</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `  
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.PositionName ? item.PositionName : '-'}</td>
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
        // <div className='content-wrapper'>
        <div>
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-user" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Designation Master</h1>
                        {/* <small>Position List</small> */}
                    </div>
                </div>
                {
                    getPositionData ? (<div>
                        <div className='close-btn'>
                            <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>) : null
                }
            </section>
            <div className='pb-5'>
                <section className="content">
                    <div className="row">
                        <div className={getPositionData ? 'col-lg-12' : 'col-lg-6 col-md-12'}>
                            <PositionForm getPositionData={getPositionData} rowData={rowData} fetchData={fetchData} projectdata={projectdata} />
                        </div>
                        <div className={getPositionData ? 'col-lg-12 pinpin h-100' : 'col-lg-6 col-md-12 pinpin'}>
                            <div className="card lobicard" data-sortable="true">
                                <div className="card-header">
                                    <div className='title-download-section'>
                                        <div className="card-title custom_title">
                                            <h4 className='report-heading'>Designation List</h4>
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
                                    <PositionTable getPositionData={getPositionData} data={data} searchinput={searchinput} onRow={handleRowData} fetchData={fetchData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default PositionMaster