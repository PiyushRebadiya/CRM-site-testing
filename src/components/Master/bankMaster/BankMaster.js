import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import BankTable from './BankTable';
import BankForm from './BankForm';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';

function BankNewForm(props) {
    const { fetchData } = props;
    // console.log(username, 'usernameusernameusernameusernameusername')
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <BankForm fetchData={fetchData} onHide={props.onHide} />
        </Modal>
    );
}
// function BankNewForm(props) {
//     const { fetchData, onClose, banknew } = props;
//     const errorData = React.useRef(null);
//     const reset_Data = React.useRef(null);
//     useEffect(() => {
//         if (banknew == true) {
//             errorData.current()
//             reset_Data.current()
//         }
//     }, [banknew])
//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width={1300}
//         >
//             <BankForm fetchData={fetchData} onHide={props.onHide} errorData={errorData} reset_Data={reset_Data} />
//         </Drawer>
//     );
// }

const BankMaster = () => {
    const [banknew, setBankNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [data, setData] = useState([])
    const insertData = React.useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [uploadedData, setUploadedData] = useState([]); // Store uploaded data
    const [columnMappings, setColumnMappings] = useState({})
    const token = localStorage.getItem("CRMtoken")

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const fileData = e.target.result;
            // Assuming the file format is Excel (xlsx)
            const workbook = XLSX.read(fileData, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Store uploaded data
            setUploadedData(jsonData);

            // Extract column names
            if (jsonData.length > 0) {
                const columns = Object.keys(jsonData[0]);
                // Initialize column mappings with default values
                const initialMappings = columns.reduce((acc, column) => {
                    acc[column] = ''; // Initialize all columns with an empty mapping
                    return acc;
                }, {});
                setColumnMappings(initialMappings);
            }
        };

        if (file) {
            reader.readAsBinaryString(file);
        }
    };

    const handleColumnMapping = (columnName, apiField) => {
        const updatedMappings = { ...columnMappings };
        updatedMappings[columnName] = apiField;
        setColumnMappings(updatedMappings);
    };

    const handleDataInsertion = async () => {
        // Map Excel columns to API parameters based on user mappings
        const mappedData = uploadedData.map(item => {
            const mappedItem = {};
            for (const [key, value] of Object.entries(columnMappings)) {
                mappedItem[value] = item[key];
            }
            return mappedItem;
        });

        // Insert data using API (Assuming fetchData makes API POST request)
        try {
            const response = await fetch(URL + '/api/Master/CreateBank', {
                method: 'POST',
                headers: {
                    Authorization: `bearer ${token}`
                },
                body: JSON.stringify(mappedData),
            });
            if (response.ok) {
                // Data successfully inserted, update local state or fetch new data
                // Example: fetchData();
            } else {
                console.error('Failed to insert data');
            }
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };


    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleData = (data) => {
        setData(data)
    }
    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setBankNew(true);
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to ensure this effect runs only once
    const generatePDF = () => {
        const doc = new jsPDF();
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');
        doc.text(` ${companyName}`, 70, 10);
        doc.setFontSize(13)
        const leftMargin = 15;
        doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
        doc.text('Bank List :-', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.IFSCCode ? item.IFSCCode : '-',
            item.BankName ? item.IFSCCode : '-',
            item.BranchName ? item.BranchName : '-',
            item.AcNo ? item.AcNo : '-',
            item.Description ? item.Description : '-',
        ]);

        doc.autoTable({
            head: [['No', 'IFSC Code', 'Bank Name', 'Branch Name', 'A/c No', "A/c Type"]],
            body: tableData,
            startY: 30,
        });

        doc.save('Bank.pdf');
    };
    const downloadExcel = () => {
        const columeName = [
            "No",
            "IFSC Code",
            "Bank Name",
            "Branch Name",
            "A/c No",
            "A/c Type",
        ];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.IFSCCode ? item.IFSCCode : "-",
                item.BankName ? item.BankName : "-",
                item.BranchName ? item.BranchName : "-",
                item.AcNo ? item.AcNo : "-",
                item.Description ? item.Description : "-"
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Bank.xlsx");
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
              <h4>Bank List :-</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                    <th>IFSC Code</th>
                    <th>Bank Name</th>
                    <th>Branch Name</th>
                    <th>A/c No</th>
                    <th>A/c Type</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                      <td>${item.IFSCCode ? item.IFSCCode : '-'}</td>
                      <td>${item.BankName ? item.BankName : '-'}</td>
                      <td>${item.BranchName ? item.BranchName : '-'}</td>
                      <td>${item.AcNo ? item.AcNo : '-'}</td>
                      <td>${item.Description ? item.Description : '-'}</td>
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
        <div className='content-wrapper'>
            <section className="content-header">
                <div className="header-icon">
                    {/* <i className="fa fa-users" /> */}
                    <i class="fa fa-university" aria-hidden="true"></i>
                </div>
                <div className="header-title">
                    <h1>Bank Master</h1>
                    {/* <small>Bank List</small> */}
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>Bank List</h4>
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
                                <div className="buttonexport" id="buttonlist">
                                    <Button className="btn btn-add rounded-2" onClick={() => setBankNew(true)}>
                                        <i className="fa fa-plus" /> Add Bank [F2]
                                    </Button>
                                    <Modal show={showModal} onHide={handleCloseModal}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Column Mapping</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* Column mapping UI */}
                                            {Object.keys(columnMappings).map(column => (
                                                <div key={column}>
                                                    <span>{column}</span>
                                                    <input
                                                        type='select'
                                                        value={columnMappings[column]}
                                                        onChange={(e) => handleColumnMapping(column, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant='secondary' onClick={handleCloseModal}>
                                                Close
                                            </Button>
                                            {/* Button to initiate data insertion */}
                                            <Button variant='primary' onClick={handleDataInsertion}>
                                                Insert Data
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <BankNewForm
                                        show={banknew}
                                        onHide={() => setBankNew(false)}
                                        fetchData={insertData.current}
                                    // username={username}
                                    />
                                    {/* <BankNewForm
                                        visible={banknew}
                                        onHide={() => { setBankNew(false) }}
                                        banknew={banknew}
                                        fetchData={insertData.current}
                                    // username={username}
                                    /> */}
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />

                                </div>
                            </div>
                            <div className='p-3' >
                                <BankTable insertData={insertData} searchinput={searchinput} onData={handleData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BankMaster