import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import ProjectForm from './ProjectForm';
import ProjectTable from './ProjectTable';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Space, Tooltip } from 'antd';

function ProjectNewForm(props) {
    const { fetchData, getProjectData } = props;
    return (
        <Modal
            // className='animate__animated animate__zoomIn'
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ProjectForm fetchData={fetchData} onHide={props.onHide} getProjectData={getProjectData} />
        </Modal>
    );
}


const ProjectMaster = ({ getProjectData, onHide }) => {
    const [projectnew, setProjectNew] = React.useState(false);
    const [data, setData] = useState([])
    const [searchinput, setSearchInput] = useState("")
    const insertData = React.useRef(null);

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setProjectNew(true);
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
        doc.setFontSize(13);
        doc.text(`Total Record :- ${data.length}`, 15, 20);
        doc.text('Project List', 15, 25);

        const tableData = data.map((item, index) => [
            index + 1,
            item.ProjectName ? item.ProjectName : '-',
            item.Description ? item.Description : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Project Name', 'Status']],
            body: tableData,
            startY: 30, // Specify the Y-coordinate to start the table
        });

        doc.save('ProjectList.pdf');
    };


    // const downloadExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(workbook, 'ProjectList.xlsx');
    // };
    const downloadExcel = () => {
        const columeName = ['No', 'Project Name', 'Status'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.ProjectName ? item.ProjectName : '-',
                item.Description ? item.Description : '-',
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "ProjectList.xlsx");
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
                <h4>Project List</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Project Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.ProjectName ? item.ProjectName : '-'}</td>
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
        <div className={getProjectData ? '' : 'content-wrapper'}>
            <section className="content-header close-btn-flex">
                <div>
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        <i class="fa fa-desktop" aria-hidden="true"></i>

                    </div>
                    <div className="header-title">
                        <h1>Project/Work/Service Master</h1>
                        {/* <small>Party List</small> */}
                    </div>
                </div>
                {
                    getProjectData ? (<div>
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
                                        <h4 className='report-heading'>Project List</h4>
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
                                    <Button className="btn btn-add rounded-2" onClick={() => setProjectNew(true)}>
                                        <i className="fa fa-plus" /> Add Project [F2]
                                    </Button>
                                    <ProjectNewForm
                                        show={projectnew}
                                        onHide={() => setProjectNew(false)}
                                        fetchData={insertData.current}
                                        getProjectData={getProjectData}
                                    />
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                                </div>
                            </div>
                            <div className='p-3' >
                                <ProjectTable insertData={insertData} searchinput={searchinput} onData={handleData} getProjectData={getProjectData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProjectMaster