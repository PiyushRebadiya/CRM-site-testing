import React, { useState } from 'react'
import EmployeeForm from './EmployeeForm'
import { Button, Modal } from 'react-bootstrap';
import EmployeeTable from './EmployeeTable';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'
import { useEffect } from 'react';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';

function EmployeeFormModal(props) {
    const { fetchData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >    <Modal.Header closeButton>
                <Modal.Title>Employee Details</Modal.Title>
            </Modal.Header>
            <EmployeeForm
                fetchData={fetchData}
                onHide={props.onHide}
            />
        </Modal>
    );
}
// function EmployeeFormModal(props) {
//     const { fetchData, onClose, emoplyeeform } = props;
//     const errorData = React.useRef(null);
//     const reset_Data = React.useRef(null);
//     useEffect(()=>{
//         if(emoplyeeform == true)
//         {
//             errorData.current()
//             reset_Data.current()
//         }
//     },[emoplyeeform])

//     return (
//         <Drawer
//             {...props}
//             title="Add Employee"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width="75vw"
//         > 
//            {/* <Drawer.Header closeButton>
//                 <Modal.Title>Employee Details</Modal.Title>
//             </Drawer.Header> */}
//             <EmployeeForm
//                 fetchData={fetchData}
//                 onHide={props.onHide}
//                 errorData={errorData} 
//                 reset_Data={reset_Data}
//             />
//         </Drawer>
//     );
// }
function EmployeeMaster() {
    const [emoplyeeform, setEmployeeform] = React.useState(false);
    const [data, setData] = useState([])
    const insertData = React.useRef(null);
    const [searchinput, setSearchInput] = useState("")

    const URL = process.env.REACT_APP_API_URL
    const handleData = (data) => {
        setData(data)
    }

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setEmployeeform(true);
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
        const doc = new jsPDF('landscape');
        const companyName = localStorage.getItem('CRMCompanyName') || 'Your Company Name'; // Retrieve company name from Local Storage
        doc.setFont('Arial', 'bold');
        doc.text(` ${companyName}`, 120, 10);
        doc.setFontSize(13)
        const leftMargin = 15;
        doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
        doc.text('Employee List', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.FirstName ? item.FirstName : '-',
            item.LastName ? item.LastName : '-',
            item.Email ? item.Email : "-",
            item.DOB ? moment(item.DOB).format('DD/MM/YYYY') : 'No Date',
            item.DOJ ? moment(item.DOJ).format('DD/MM/YYYY') : 'No Date',
            item.Gender ? item.Gender : "-",
            item.Mobile1 ? item.Mobile1 : "-",
            item.PAN ? item.PAN : "-",
            item.UserName ? item.UserName : "-",
            item.Password ? item.Password : "-",
            item.Role ? item.Role : "-",

        ]);

        doc.autoTable({
            head: [['No', "FirstName", 'LastName', 'Email', "DOB", "DOJ", "Gender", "Mobile1", "PAN", "UserName", "Password", "Role"]],
            body: tableData,
            orientation: 'portrait',
            startY: 30,
        });

        doc.save('Employee.pdf');
    };
    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'Employee.xlsx');
    // };
    const downloadExcel = () => {
        const columeName = ['No', "FirstName", 'LastName', 'Email', "DOB", "DOJ", "Gender", "Mobile1", "PAN", "UserName", "Password", "Role"];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.FirstName ? item.FirstName : '-',
                item.LastName ? item.LastName : '-',
                item.Email ? item.Email : "-",
                item.DOB ? moment(item.DOB).format('DD/MM/YYYY') : 'No Date',
                item.DOJ ? moment(item.DOJ).format('DD/MM/YYYY') : 'No Date',
                item.Gender ? item.Gender : "-",
                item.Mobile1 ? item.Mobile1 : "-",
                item.PAN ? item.PAN : "-",
                item.UserName ? item.UserName : "-",
                item.Password ? item.Password : "-",
                item.Role ? item.Role : "-"
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Employee.xlsx");
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
              <h4>Employee List</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                    <th>FirstName</th>                 
                    <th>LastName</th>                 
                    <th>Email</th>                 
                    <th>DOB</th>                 
                    <th>DOJ</th>                 
                    <th>Gender</th>                 
                    <th>Mobile1</th>                 
                    <th>PAN</th>                 
                    <th>UserName</th>                 
                    <th>Password</th>                 
                    <th>Role</th>                 
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                      <td>${item.FirstName ? item.FirstName : '-'}</td>                    
                      <td>${item.LastName ? item.LastName : '-'}</td>                    
                      <td>${item.Email ? item.Email : '-'}</td>                    
                      <td>${item.DOB ? moment(item.DOB).format('DD/MM/YYYY') : '-'}</td>                    
                      <td>${item.DOJ ? moment(item.DOJ).format('DD/MM/YYYY') : '-'}</td>                    
                      <td>${item.Gender ? item.Gender : '-'}</td>                    
                      <td>${item.Mobile1 ? item.Mobile1 : '-'}</td>                    
                      <td>${item.PAN ? item.PAN : "-"}</td>                    
                      <td>${item.UserName ? item.UserName : '-'}</td>                    
                      <td>${item.Password ? item.Password : '-'}</td>                    
                      <td>${item.Role ? item.Role : '-'}</td>                    
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
                    <i class="fa fa-user-circle" aria-hidden="true"></i>
                </div>
                <div className="header-title">
                    <h1>Employee Master</h1>
                    {/* <small>Employee List</small> */}
                </div>

            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin emp-master">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>Employee List</h4>
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
                                    <Button className="btn btn-add rounded-2" onClick={() => setEmployeeform(true)}>
                                        <i className="fa fa-plus" /> Add Employee [F2]
                                    </Button>
                                    <EmployeeFormModal
                                        show={emoplyeeform}
                                        onHide={() => setEmployeeform(false)}
                                        fetchData={insertData.current}
                                    />
                                    {/* <EmployeeFormModal
                                        visible={emoplyeeform}
                                        onHide={() => setEmployeeform(false)}
                                        emoplyeeform= {emoplyeeform}
                                        fetchData={insertData.current}
                                    /> */}
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                                </div>
                            </div>
                            <div className='p-3' >
                                <EmployeeTable insertData={insertData} searchinput={searchinput} onData={handleData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default EmployeeMaster