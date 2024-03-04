import React, { useState, useEffect } from 'react'
import DscManagementTable from './DscManagementTable'
import { Button } from 'react-bootstrap'
import { Modal } from 'react-bootstrap';
import DscManagementForm from './DscManagementForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';
import moment from 'moment';

function DscForm(props) {
    const { fetchData } = props
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <DscManagementForm onHide={props.onHide} fetchData={fetchData} />
        </Modal>
    );
}


const DscManagementMain = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const insertData = React.useRef(null);
    const [data, setData] = useState([])

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setModalShow(true);
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
        doc.setFontSize(13);
        const leftMargin = 15;
        doc.text(`Total Record :- ${data.length}`, leftMargin, 20);
        doc.text('Service Management List', leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.Startdate ? moment(item.Startdate).format('DD/MM/YYYY') : 'No Date',
            item.FirstName ? item.FirstName + '' + item.LastName : '-',
            item.PartyName ? item.PartyName : '-',
            item.Type ? item.Type : '-',
            item.Remark ? item.Remark : '-',
            item.Enddate ? moment(item.Enddate).format('DD/MM/YYYY') : 'No Date'
        ]);

        doc.autoTable({
            head: [['No', 'Issue Date', 'Assign By', 'Party Name', 'Type', 'Remark', 'Expiry Date']],
            body: tableData,
            startY: 30,
        });

        doc.save('ServiceManagement.pdf');
    };
    const downloadExcel = () => {
        const columeName = ['No', 'Issue Date', 'Assign By', 'Party Name', 'Type', 'Remark', 'Expiry Date'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.Startdate ? moment(item.Startdate).format('DD/MM/YYYY') : 'No Date',
                item.FirstName ? item.FirstName + '' + item.LastName : '-',
                item.PartyName ? item.PartyName : '-',
                item.Type ? item.Type : '-',
                item.Remark ? item.Remark : '-',
                item.Enddate ? moment(item.Enddate).format('DD/MM/YYYY') : 'No Date'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "ServiceManagement.xlsx");
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
            <p>${companyName}</p>
            <hr/>
            <div>
            <b>Total Record :- </b>${data.length}
            </div>
              <h4>Service Management List</h4>
              <table>
                <tr>
                <th>No</th>
                <th>Issue Date</th>
                <th>Assign By</th>
                <th>Party Name</th>
                <th>Type</th>
                <th>Remark</th>
                <th>Expiry Date</th>
                </tr>
                <tbody>
                  ${data.map((item, index) =>
            `
            <tr>
                      <td>${index + 1}</td>
                      <td>${item.Startdate ? moment(item.Startdate).format('DD/MM/YYYY') : 'No Date'}</td>
                      <td>${item.FirstName ? item.FirstName + '' + item.LastName : '-'}</td>                   
                      <td>${item.PartyName ? item.PartyName : '-'}</td>                   
                      <td>${item.Type ? item.Type : '-'}</td>                   
                      <td>${item.Remark ? item.Remark : '-'}</td>                   
                      <td>${item.Enddate ? moment(item.Enddate).format('DD/MM/YYYY') : 'No Date'}</td>                   
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
    const handleData = (data) => {
        // console.log(data, "data-datadatadatda")
        setData(data)
    }
    return (
        <div>
            <div className="content-wrapper h-75">
                <section className="content-header close-btn-flex">
                    <div>
                        <div className="header-icon">
                            {/* <i className="fa fa-users" /> */}
                            <i class="fa fa-cogs" aria-hidden="true"></i>
                        </div>
                        <div className="header-title">
                            <h1>Service Management</h1>
                            {/* <small>IFSC List</small> */}
                        </div>
                    </div>
                </section>
                <section className="content padding-main ">
                    <div className="row ">
                        <div className="col-lg-12 pinpin ">
                            <div className="card lobicard " data-sortable="true">
                                <div className="card-header">
                                    <div className='title-download-section'>
                                        <div className="card-title custom_title">
                                            <h4 className='report-heading'>Service Management List</h4>
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
                                        <Button className="btn btn-add rounded-2" onClick={() => setModalShow(true)}>
                                            <i className="fa fa-plus" /> Add Service [F2]
                                        </Button>
                                    </div>
                                    <DscForm
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                        fetchData={insertData.current}
                                    />
                                    <div className='searching-input'>
                                        <input type="text" className='form-control' placeholder='Search ' onChange={(event) => { setSearchInput(event.target.value) }} />
                                    </div>
                                </div>
                                <div className='p-3' >
                                    <DscManagementTable insertData={insertData} searchinput={searchinput} onData={handleData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default DscManagementMain