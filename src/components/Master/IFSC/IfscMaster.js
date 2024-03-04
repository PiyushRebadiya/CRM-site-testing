import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import IfscForm from './IfscForm'
import IfscTable from './IfscTable'
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Drawer } from 'antd';
import { LuImport } from "react-icons/lu";
import { Space, Tooltip } from 'antd';

function IfscFormModal(props) {
    const { fetchData, fetchIFSCData } = props;
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <IfscForm
                fetchIFSCData={fetchIFSCData}
                fetchData={fetchData}
                onHide={props.onHide}
            />
        </Modal>
    );
}

// function IfscFormDrawer(props) {
//     const { fetchData, fetchIFSCData, onClose, ifscnew } = props;
//     const errorData = React.useRef(null);
//     const reset_Data = React.useRef(null);
//     // useEffect(() => {
//     //     if (ifscnew == true) {
//     //         errorData.current()
//     //         reset_Data.current()
//     //     }
//     // }, [ifscnew])
//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width="1300"
//         >
//             <IfscForm
//                 fetchIFSCData={fetchIFSCData}
//                 fetchData={fetchData}
//                 onHide={props.onHide}
//                 errorData={errorData}
//                 reset_Data={reset_Data}
//             />
//         </Drawer>
//     );
// }

function

    IfscMaster({ fetchIFSCData, onHide, resetErrors }) {
    const [ifscnew, setIfscnew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [data, setData] = useState([])
    const [importdata, setImportData] = useState([]);
    const insertData = React.useRef(null);

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setIfscnew(true);
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to ensure this effect runs only once

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
        doc.text('IFSC List ', leftMargin, 25);
        doc.setFontSize(20)
        const tableData = data.map((item, index) => [
            index + 1,
            item.BankName ? item.BankName : '-',
            item.BranchName ? item.BranchName : '-',
            item.IFSC ? item.IFSC : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Bank Name', 'Branch Name', 'IFSC Code']],
            body: tableData,
            startY: 30,
        });

        doc.save('IFSC.pdf');
    };
    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'IFSC.xlsx');
    // };
    const downloadExcel = () => {
        const columeName = ['No', 'Bank Name', 'Branch Name', 'IFSC Code'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.BankName ? item.BankName : '-',
                item.BranchName ? item.BranchName : '-',
                item.IFSC ? item.IFSC : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "IFSC.xlsx");
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
              <h4>Ifsc List </h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                    <th>Bank Name</th>
                    <th>Branch Name</th>
                    <th>IFSC Code</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                      <td>${item.BankName ? item.BankName : '-'}</td>
                      <td>${item.BranchName ? item.BranchName : '-'}</td>
                      <td>${item.IFSC ? item.IFSC : '-'}</td>
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
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((display) => {
            setImportData(display);
        });
    };
    return (
        <div className={fetchIFSCData ? "" : 'content-wrapper h-75'} >
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-university" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>IFSC Master</h1>
                        {/* <small>IFSC List</small> */}
                    </div>
                </div>
                {
                    fetchIFSCData ? (<div>
                        <div className='close-btn'>
                            <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>) : null
                }

            </section>
            <section className="content padding-main ">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>IFSC List</h4>
                                    </div>
                                    <div className='d-flex'>
                                        <div class="upload-btn-wrapper">
                                            {/* <button class="btn">Upload a file</button> */}
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
                            </div>
                            <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                <div className="buttonexport" id="buttonlist">
                                    <Button className="btn btn-add rounded-2" onClick={() => setIfscnew(true)}>
                                        <i className="fa fa-plus" /> Add IFSC [F2]
                                    </Button>
                                    <IfscFormModal
                                        show={ifscnew}
                                        onHide={() => setIfscnew(false)}
                                        fetchData={insertData.current}
                                        fetchIFSCData={fetchIFSCData}
                                    />
                                    {/* <IfscFormDrawer
                                        visible={ifscnew}
                                        onHide={() => setIfscnew(false)}
                                        ifscnew={ifscnew}
                                        fetchData={insertData.current}
                                        fetchIFSCData={fetchIFSCData}
                                        importdata={importdata}
                                    /> */}
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                                </div>
                            </div>
                            <div className='p-3' >
                                <IfscTable
                                    insertData={insertData}
                                    searchinput={searchinput}
                                    fetchIFSCData={fetchIFSCData}
                                    onData={handleData}
                                    importdata={importdata}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default IfscMaster