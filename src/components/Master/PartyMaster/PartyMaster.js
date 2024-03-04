import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import PartyTable from './PartyTable';
import PartyForm from './PartyForm';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
// import { useLocation } from 'react-router-dom'
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { LuImport } from "react-icons/lu";
import PartyRecordImport from './PartyRecordImport'
import { Space, Tooltip } from 'antd';

// function ImportFile(props) {
//     return (
//         <Modal
//             {...props}
//             size="lg"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <PartyRecordImport onHide={props.onHide} />

//         </Modal>
//     );
// }

function PartyNewForm(props) {
    const { fetchData, getPartyData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <PartyForm getPartyData={getPartyData} fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}

const PartyMaster = ({ getPartyData, onHide }) => {
    // const location = useLocation()
    const [partynew, setPartyNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [data, setData] = useState([])
    const [importdata, setImportData] = useState([]);
    const insertData = React.useRef(null);
    const [importfile, setImportFile] = useState(false);
    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setPartyNew(true);
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
        const doc = new jsPDF('landscape');
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');
        doc.text(` ${companyName}`, 120, 10);
        doc.setFontSize(13)
        const leftMargin = 15;
        doc.text(`Total Record :- ${data.length}`, leftMargin, 15);
        doc.text('Party List :-', leftMargin, 19);
        const tableData = data.map((item, index) => [
            index + 1,
            item.PartyName ? item.PartyName : "-",
            item.LegelName ? item.LegelName : "-",
            item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + item.Code,
            item.StateName ? item.StateName : "-",
            item.Mobile1 ? `+${item.Mobile1}` : "-",
            item.DOB ? moment(item.DOB).format('DD-MM-YYYY') : "No Date",
            item.DOJ ? moment(item.DOJ).format('DD-MM-YYYY') : "No Date",
            item.AnnivarsaryDate ? moment(item.AnnivarsaryDate).format('DD-MM-YYYY') : "No Date",
            item.PAN ? item.PAN : "-",
            item.GST ? item.GST : "-",
        ]);

        doc.autoTable({
            head: [['No', 'Party Name', 'Legal Name', "Address", 'State', 'Mobile', 'Date of Birth', 'Date Of Join', 'Date of Anniversary', 'PAN', 'GST']],
            body: tableData,
            startY: 20,
        });

        doc.save('Party.pdf');
    };
    const downloadExcel = () => {
        const columeName = ['No', 'Party Name', 'Legal Name', "Address", 'State', 'Mobile', 'Date of Birth', 'Date Of Join', 'Date of Anniversary', 'PAN', 'GST'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.PartyName ? item.PartyName : "-",
                item.LegelName ? item.LegelName : "-",
                item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + item.Code,
                item.StateName ? item.StateName : "-",
                item.Mobile1 ? `+${item.Mobile1}` : "-",
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
        XLSX.writeFile(workbook, "Party.xlsx");
    };
    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet([]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'Sample.xlsx');
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
              <h4>Party List :-</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                    <th>Party Name</th>
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
                      <td>${item.PartyName ? item.PartyName : '-'}</td>
                      <td>${item.LegelName ? item.LegelName : "-"}</td>
                      <td>${item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + (item.Code ? item.Code : '')}</td>
                      <td>${item.StateName ? item.StateName : '-'}</td>
                      <td>${item.Mobile1 ? `+${item.Mobile1}` : '-'}</td>
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
    const readExcel = (file) => {
        // const promise = new Promise((resolve, reject) => {
        //     const fileReader = new FileReader();
        //     fileReader.readAsArrayBuffer(file);

        //     fileReader.onload = (e) => {
        //         const bufferArray = e.target.result;

        //         const wb = XLSX.read(bufferArray, { type: "buffer" });

        //         const wsname = wb.SheetNames[0];

        //         const ws = wb.Sheets[wsname];

        //         const data = XLSX.utils.sheet_to_json(ws);

        //         resolve(data);
        //     };

        //     fileReader.onerror = (error) => {
        //         reject(error);
        //     };
        // });

        // promise.then((display) => {
        //     setImportData(display);
        // });

        const promise = new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                try {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, { type: 'buffer' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise
            .then((display) => {
                setImportData(display);
            })
            .catch((error) => {
                console.error('Error reading Excel file:', error);
            });
    };
    const [isOpen, setIsOpen] = useState(false);
    const [convertdata, setConvertData] = useState([])
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const handlecomplate = (data) => {
        const ImportExcelFileRecord = data.rows
        const transformedData = ImportExcelFileRecord.map(item => item.values);
        //     const transformedData = ImportExcelFileRecord.map(item => {
        //         const newValues = {};
        //         for (const key in item.values) {
        //             if (item.values.hasOwnProperty(key)) {
        //                 const newKey = capitalizeFirstLetter(key);
        //                 newValues[newKey] = item.values[key];
        //             }
        //         }
        //         return newValues;
        //     });
        //     setConvertData(transformedData)
    }

    return (
        <div className={getPartyData ? '' : 'content-wrapper'}>
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-id-card-o" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Party Master</h1>
                        {/* <small>Party List</small> */}
                    </div>
                </div>
                {
                    getPartyData ? (<div>
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
                                        <h4 className='report-heading'>Party List</h4>
                                    </div>
                                    <div className='d-flex'>
                                        <div class="upload-btn-wrapper">
                                            {
                                                !getPartyData ? (
                                                    <Space wrap>
                                                        <Tooltip title="Import Excel" >
                                                            <LuImport className='import-icon' onClick={() => setImportFile(true)} />
                                                        </Tooltip>
                                                    </Space>
                                                ) : null
                                            }

                                            {/* <button class="btn" onClick={() => setImportFile(true)}>Upload a file</button> */}
                                            {
                                                importfile == true ? (
                                                    <PartyRecordImport fetchData={insertData.current} setImportFile={setImportFile} />
                                                ) : null
                                            }
                                            {/* <ImportFile
                                                show={importfile}
                                                onHide={() => setImportFile(false)}
                                            /> */}
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
                                            <Space wrap>
                                                <Tooltip title="Sample Download Excel" >
                                                    <div className='sample-download-excel' onClick={handleDownload} >
                                                        <span>Download Sample File</span>
                                                    </div>
                                                </Tooltip>
                                            </Space>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group">
                                <div className="buttonexport" id="buttonlist">
                                    <Button className="btn btn-add rounded-2" onClick={() => setPartyNew(true)}>
                                        <i className="fa fa-plus" /> Add Party [F2]
                                    </Button>
                                    <PartyNewForm
                                        show={partynew}
                                        onHide={() => setPartyNew(false)}
                                        fetchData={insertData.current}
                                        getPartyData={getPartyData}
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
                                <PartyTable insertData={insertData} searchinput={searchinput} ondata={handleData} getPartyData={getPartyData} importdata={importdata} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PartyMaster