import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import 'animate.css';
import AutoTaskForm from './AutoTaskForm';
import AutoTaskTable from "./AutoTaskTable";
import { Space, Tooltip } from 'antd';
function AutoTaskNewForm(props) {
    const { fetchData, getAutoTaskData } = props;
    return (
        <Modal
            // className='animate__animated animate__zoomIn'
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <AutoTaskForm fetchData={fetchData} onHide={props.onHide} getAutoTaskData={getAutoTaskData} />
        </Modal>
    );
}

function AutoTaskMaster({ getAutoTaskData, onHide }) {
    const [autotasknew, setAutoTaskNew] = React.useState(false);
    const [data, setData] = useState([])
    const [searchinput, setSearchInput] = useState("")
    const insertData = React.useRef(null);

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setAutoTaskNew(true);
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
        doc.text('AutoTask Report List', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.ProjectName ? item.ProjectName : '-',
            item.CategoryName ? item.CategoryName : '-',
            item.Heading ? item.Heading : '-',
            item.TaskName ? item.TaskName : '-',
            item.Date ? moment(item.Date).format('DD/MM/YYYY') : 'No Date',
            item.TimePeriod ? item.TimePeriod : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Project Name', 'CategoryName', 'Sub-CategoryName', "Task Name", 'Start Date', 'Time Period']],
            body: tableData,
            startY: 30,
        });

        doc.save('AutoTaskReport.pdf');
    };
    const downloadExcel = () => {
        const columeName = ['No', 'Project Name', 'CategoryName', 'Sub-CategoryName', "Task Name", 'Start Date', 'Time Period'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.ProjectName ? item.ProjectName : '-',
                item.CategoryName ? item.CategoryName : '-',
                item.Heading ? item.Heading : '-',
                item.TaskName ? item.TaskName : '-',
                item.Date ? moment(item.Date).format('DD/MM/YYYY') : 'No Date',
                item.TimePeriod ? item.TimePeriod : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "AutoTask.xlsx");
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
        <b>Total Record :- </b>${data.length}
        </div>
          <h4>AutoTask Report</h4>
          <table>
            <thead>
              <tr>
              <th>No</th>
              <th>Project Name</th>
              <th>Category Name</th>
              <th>Sub-Category Name</th>
              <th>Task Name</th>
              <th>Start Date</th>
              <th>Time Period</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item, index) => `
                <tr>
                <td>${index + 1}</td>
                <td>${item.ProjectName ? item.ProjectName : '-'}</td>
                <td>${item.CategoryName ? item.CategoryName : '-'}</td>
                <td>${item.Heading ? item.Heading : '-'}</td>
                <td>${item.TaskName ? item.TaskName : '-'}</td>
                <td>${item.Date ? moment(item.Date).format('DD/MM/YYYY') : 'No Date'}</td>
                <td>${item.TimePeriod ? item.TimePeriod : '-'}</td>
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
        <div className={getAutoTaskData ? '' : 'content-wrapper'}>
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>Task Scheduler </h1>
                        {/* <small>Project List</small> */}
                    </div>
                </div>
                {
                    getAutoTaskData ? (<div>
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
                                        <h4 className='report-heading'>Task Scheduler List</h4>
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
                                    {/* <button className="btn btn-add" onClick={() => setProjectNew(true)}> <i className="fa fa-plus" /> Add Project</button> */}
                                    <Button className="btn btn-add rounded-2" onClick={() => setAutoTaskNew(true)}>
                                        <i className="fa fa-plus" /> Add Task Scheduler [F2]
                                    </Button>
                                    <AutoTaskNewForm
                                        show={autotasknew}
                                        onHide={() => setAutoTaskNew(false)}
                                        fetchData={insertData.current}
                                        getAutoTaskData={getAutoTaskData}
                                    />
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                                </div>
                            </div>
                            <div className='p-3' >
                                <AutoTaskTable insertData={insertData} searchinput={searchinput} onData={handleData} getAutoTaskData={getAutoTaskData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AutoTaskMaster