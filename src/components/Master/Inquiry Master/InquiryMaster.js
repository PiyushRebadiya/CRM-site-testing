import React, { useEffect, useState } from 'react'
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import InquiryCalander from './InquiryCalander';
// import Calender from './Calender';
import InquiryForm from './InquiryForm';
import InquiryTable from './InquiryTable';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import moment from 'moment';
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';

function InquiryNewForm(props) {
    const { fetchInquiryData } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <InquiryForm onHide={props.onHide} fetchData={fetchInquiryData} />
        </Modal>
    );
}

// function InquiryNewForm(props) {
//     const { fetchInquiryData, onClose, inquirynew } = props;
//     const errorData = React.useRef(null);
//     const reset_Data = React.useRef(null);
//     useEffect(()=>{
//         if(inquirynew == true)
//         {
//             errorData.current()
//             reset_Data.current()
//         }
//     },[inquirynew])
//     return (
//         <Drawer
//         {...props}
//         title="Add IFSC"
//         placement="right"
//         onClose={onClose}
//         visible={props.visible}
//         width="75vw"
//         >
//             <InquiryForm onHide={props.onHide} fetchData={fetchInquiryData} errorData={errorData} reset_Data={reset_Data}/>
//         </Drawer>
//     );
// }

const InquiryMaster = () => {
    const [inquirynew, setInquiryNew] = useState(false);
    const [searchinput, sertSearchInput] = useState("")
    const insertData = React.useRef(null);
    const [data, setData] = useState([])

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setInquiryNew(true);
            }
        }

        window.addEventListener('keydown', handleKeyPress);

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
        doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
        doc.text("Inquiry List", leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.TicketNo ? item.Prefix + item.TicketNo : '-',
            item.ProjectName ? item.ProjectName : '-',
            item.CategoryName ? item.CategoryName : '-',
            item.TaskName ? item.TaskName : '-',
            item.FirstName ? item.FirstName + " " + item.LastName : '-',
            item.ATFName ? item.ATFName + " " + item.ATLName : '-',
            item.ToDate ? moment(item.ToDate).format('DD-MM-YYYY') : 'No Date',
            item.Priority ? item.Priority : '-',
            item.TaskStatus ? item.TaskStatus : '-'
        ]);
        doc.autoTable({
            head: [["No", "Ticket No", 'Project Name', 'Category Name', 'Inquiry Name', 'Assign By', 'Assign To', 'Due Date', 'Priority', 'Status']],
            body: tableData,
            startY: 30,
        });

        doc.save('Inquiry.pdf');
    };
    const downloadExcel = () => {
        const columeName = ["No", "Ticket No", 'Project Name', 'Category Name', 'Inquiry Name', 'Assign By', 'Assign To', 'Due Date', 'Priority', 'Status'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.TicketNo ? item.Prefix + item.TicketNo : '-',
                item.ProjectName ? item.ProjectName : '-',
                item.CategoryName ? item.CategoryName : '-',
                item.TaskName ? item.TaskName : '-',
                item.FirstName ? item.FirstName + " " + item.LastName : '-',
                item.ATFName ? item.ATFName + " " + item.ATLName : '-',
                item.ToDate ? moment(item.ToDate).format('DD-MM-YYYY') : 'No Date',
                item.Priority ? item.Priority : '-',
                item.TaskStatus ? item.TaskStatus : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Inquiry.xlsx");
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
            <b>Total Recoord :- </b>${data.length}
            </div>
              <h4>Inquiry List</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                  <th>Ticket No</th>
                  <th>Project Name</th>
                  <th>Category Name</th>
                  <th>Task Name</th>
                  <th>Assign By</th>
                  <th>Assign To</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${item.TicketNo ? item.Prefix + item.TicketNo : '-'}</td>
                    <td>${item.ProjectName ? item.ProjectName : '-'}</td>
                    <td>${item.CategoryName ? item.CategoryName : '-'}</td>
                    <td>${item.TaskName ? item.TaskName : '-'}</td>
                    <td>${item.FirstName ? item.FirstName + " " + item.LastName : '-'}</td>
                    <td>${item.ATFName ? item.ATFName + " " + item.ATLName : '-'}</td>
                    <td>${item.ToDate ? moment(item.ToDate).format('DD-MM-YYYY') : 'No Date'}</td>
                    <td>${item.Priority ? item.Priority : '-'}</td>
                    <td>${item.TaskStatus ? item.TaskStatus : '-'}</td>
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
                <div>
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-search-plus" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Inquiry </h1>
                    </div>
                </div>
                {/* {
            getPartyData ? (<div>
                <div className='close-btn'>
                    <button type="button" className="close ml-auto" aria-label="Close" style={{ color: 'black' }} onClick={onHide}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>) : null
        } */}
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>Inquiry List</h4>
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

                                    <Button className="btn btn-add rounded-2" onClick={() => setInquiryNew(true)}>
                                        <i className="fa fa-plus" /> Add Inquiry [F2]
                                    </Button>

                                    <InquiryNewForm
                                        show={inquirynew}
                                        onHide={() => setInquiryNew(false)}
                                        inquirynew={inquirynew}
                                        fetchInquiryData={insertData.current}
                                    />
                                    {/* <InquiryNewForm
                                        visible={inquirynew}
                                        onHide={() => setInquiryNew(false)}
                                        inquirynew={inquirynew}
                                        fetchInquiryData={insertData.current}
                                    /> */}
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { sertSearchInput(event.target.value) }} />
                                </div>
                            </div>
                            <div className='p-3' >
                                <InquiryTable insertData={insertData} searchinput={searchinput} onData={handleData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default InquiryMaster