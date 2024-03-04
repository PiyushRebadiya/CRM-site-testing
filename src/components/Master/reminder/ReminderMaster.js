import React, { useEffect, useState } from 'react'
import ReminderTable from './ReminderTable'
import { Button, Modal, ModalBody, OverlayTrigger } from 'react-bootstrap';
import ReminderForm from './ReminderForm';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import moment from 'moment';
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';

function ReminderModal(props) {
    const { fetchData, fetchIFSCData, onHide } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ReminderForm
                fetchData={fetchData}
                onHide={props.onHide}
            />
        </Modal>
    );
}
// function ReminderModal(props) {
//     const { fetchData, fetchIFSCData, onHide, onClose } = props;
//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width="70vw"
//         >
//             <ReminderForm
//                 fetchData={fetchData}
//                 onHide={props.onHide}
//             />
//         </Drawer>
//     );
// }
function ReminderMaster() {
    const [reminderform, setReminderform] = useState(false)
    const [searchinput, sertSearchInput] = useState("")
    const [data, setData] = useState([])
    const insertData = React.useRef(null);


    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setReminderform(true);
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
        doc.text("Remider List", leftMargin, 25);
        const tableData = data.map((item, index) => [
            index + 1,
            item.ReminderName ? item.ReminderName : '-',
            item.ReminderDate ? moment(item.ReminderDate).format('DD-MM-YYYY') : 'No Date',
            item.ReminderType ? item.ReminderType : '-',
        ]);
        doc.autoTable({
            head: [['No', 'Reminder Name', 'Reminder Date', 'Reminder Type']],
            body: tableData,
            startY: 30,
        });

        doc.save('Reminder.pdf');
    };
    const downloadExcel = () => {
        const columeName = ['No', 'Reminder Name', 'Reminder Date', 'Reminder Type'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.ReminderName ? item.ReminderName : '-',
                item.ReminderDate ? moment(item.ReminderDate).format('DD-MM-YYYY') : 'No Date',
                item.ReminderType ? item.ReminderType : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Remider.xlsx");
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
            <b>Total Record :- </b>${data.length}
            </div>
              <h4>Remider List</h4>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                  <th>Reminder Name</th>
                  <th>Reminder Date</th>
                  <th>Reminder Type</th>

                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${item.ReminderName ? item.ReminderName : '-'}</td>
                    <td>${item.ReminderDate ? moment(item.ReminderDate).format('DD-MM-YYYY') : 'No Date'}</td>
                    <td>${item.ReminderType ? item.ReminderType : '-'}</td>
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
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </div>
                <div className="header-title">
                    <h1>Reminder Master</h1>
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-lg-12 pinpin">
                        <div className="card lobicard" data-sortable="true">
                            <div className="card-header">
                                <div className='title-download-section'>
                                    <div className="card-title custom_title">
                                        <h4 className='report-heading'>Reminder List</h4>
                                    </div>
                                    <div className='download-record-section'>
                                        <Space wrap>
                                            <Tooltip title="Download PDF">
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
                                    <Button className="btn btn-add rounded-2"
                                        onClick={() => setReminderform(true)}
                                    >
                                        <i className="fa fa-plus" /> Add Reminder [F2]
                                    </Button>
                                    <ReminderModal
                                        show={reminderform}
                                        onHide={() => setReminderform(false)}
                                        fetchData={insertData.current}
                                    />
                                    {/* <ReminderModal
                                        visible={reminderform}
                                        onHide={() => setReminderform(false)}
                                        fetchData={insertData.current}
                                    /> */}
                                </div>
                                <div className='searching-input'>
                                    <input type="text" className='form-control' placeholder='Search here'
                                        onChange={(event) => { sertSearchInput(event.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className='p-3' >
                                <ReminderTable
                                    insertData={insertData}
                                    searchinput={searchinput}
                                    onData={handleData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ReminderMaster