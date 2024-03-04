import React from 'react'
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import CompanyTable from './CompanyTable';
import CompanyForm from './CompanyForm';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useEffect } from 'react';
import 'animate.css';
import { Space, Tooltip } from 'antd';

// function NewData(props) {
//     const { fetchData } = props

//     return (
//         <Modal
//             // className='animate__animated animate__zoomIn'
//             {...props}
//             size="xl"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//             backdrop="static"
//         // style={{height: "100vh", width: "75vw"}}
//         >
//             <CompanyForm fetchData={fetchData} onHide={props.onHide} />
//         </Modal>
//     );
// }

const CompanyMaster = () => {
    const [searchinput, sertSearchInput] = useState("")
    const [companynew, setCompanyNew] = React.useState(false)
    const [companynewform, setCompanynewform] = React.useState(false);
    const [showDataTable, setShowDataTable] = useState(true); // State to manage DataTable visibility
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [data, setData] = useState([])
    const insertData = React.useRef(null);

    const handleNewButtonClick = () => {
        setCompanynewform(true);
        setShowDataTable(false);
    }
    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                handleNewButtonClick();
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
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
        doc.text(`Total Record :-${data.length}`, leftMargin, 20);
        doc.text('Company List', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.CompanyName ? item.CompanyName : '-',
            item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + (item.Code ? item.Code : ''),
            item.CityName ? item.CityName : '-',
            item.StateName ? item.StateName : '-',
            item.Mobile1 ? `+${item.Mobile1}` : '-',
            item.Email ? item.Email : '-',
            item.PAN ? item.PAN : '-',
            item.GST ? item.GST : '-',
        ]);
        doc.autoTable({
            head: [['No', 'Company Name', 'Address', "City", 'State', 'Mobile', 'E-mail', 'PAN', 'GST']],
            body: tableData,
            startY: 30,
        });
        doc.save('Company Details.pdf');
    };

    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'CompanyDetails.xlsx');
    // };
    const downloadExcel = () => {
        const columeName = ['No', 'Company Name', 'Address', "City", 'State', 'Mobile', 'E-mail', 'PAN', 'GST'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.CompanyName ? item.CompanyName : '-',
                item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + (item.Code ? item.Code : ''),
                item.CityName ? item.CityName : '-',
                item.StateName ? item.StateName : '-',
                item.Mobile1 ? `+${item.Mobile1} ` : '-',
                item.Email ? item.Email : '-',
                item.PAN ? item.PAN : '-',
                item.GST ? item.GST : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "CompanyDetails.xlsx");
    };
    const handlePrint = () => {
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name';
        const printContent = `
                    < html >
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
            <b>Total Record :- ${data.length}</b>
            </div>
              <h4>Company List</h4>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Company Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Mobile</th>
                    <th>E-mail</th>
                    <th>PAN</th>
                    <th>GST</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) =>
            `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.CompanyName ? item.CompanyName : '-'}</td>
                      <td>${item.Add1 + " ," + item.Add2 + " ," + item.Add3 + " ," + (item.Code ? item.Code : '')}</td>
                      <td>${item.CityName ? item.CityName : '-'}</td>
                      <td>${item.StateName ? item.StateName : '-'}</td>
                      <td>${item.Mobile1 ? `+${item.Mobile1}` : '-'}</td>
                      <td>${item.Email ? item.Email : '-'}</td>
                      <td>${item.PAN ? item.PAN : '-'}</td>
                      <td>${item.GST ? item.GST : '-'}</td>                   
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
        <div>
            <div className='content-wrapper'>
                <section className="content-header">
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-building-o" aria-hidden="true"></i>

                    </div>
                    <div className="header-title">
                        <h1>Company Master</h1>
                        {/* <small>Company List</small> */}
                    </div>
                </section>
                <section className="content footer-section-form-padding">
                    <div className="row">
                        <div className="col-lg-12 pinpin">
                            <div className="card lobicard" data-sortable="true">
                                <div className="card-header">
                                    <div className='title-download-section'>
                                        <div className="card-title custom_title">
                                            <h4 className='report-heading'>Company List</h4>
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
                                {/* <div className="btn-group d-flex input-searching-main pt-3 pl-3 ps-3" role="group"> */}
                                {/* <div className="buttonexport" id="buttonlist"> */}
                                {/* <button className="btn btn-add"> <i className="fa fa-plus" /> Add Customer
                                        </button> */}
                                {/* <Button className="btn btn-add rounded-2" onClick={() => setCompanyNew(true)}> */}
                                {/* <i className="fa fa-plus" /> Add Company [F2] */}
                                {/* </Button> */}
                                {/* <NewData
                                            show={companynew}
                                            onHide={() => setCompanyNew(false)}
                                            fetchData={insertData.current}
                                        /> */}
                                {/* </div> */}
                                {/* <div className='searching-input'> */}
                                {/* <input type="text" className='form-control' placeholder='Search Company ' onChange={(event) => { sertSearchInput(event.target.value) }} /> */}
                                {/* </div> */}
                                {/* </div> */}
                                {/* <div className='p-3'>
                                    <CompanyTable insertData={insertData} searchinput={searchinput} onData={handleData} />
                                </div> */}
                                {showDataTable && (
                                    <div>
                                        <div className='party-main-section'>
                                            <CompanyTable insertData={insertData} searchinput={searchinput} onData={handleData} editFormOpen={editFormOpen} handleNewButtonClick={handleNewButtonClick} />
                                        </div>
                                    </div>
                                )}
                                {companynewform && (
                                    <CompanyForm
                                        onHide={() => {
                                            setCompanynewform(false);
                                            setShowDataTable(true); // Show the DataTable when the form is closed
                                        }}
                                        fetchData={insertData.current}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default CompanyMaster