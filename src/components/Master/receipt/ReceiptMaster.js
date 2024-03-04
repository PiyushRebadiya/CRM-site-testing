import React from 'react'
import { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import ReceiptForm from './ReceiptForm'
import { useLocation } from 'react-router-dom'
import ReceiptTable from './ReceiptTable';
import axios from 'axios';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import moment from 'moment';
import jsPDF from 'jspdf';
import { FaFilePdf } from 'react-icons/fa';
import { RiFileExcel2Line } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import { Drawer } from 'antd';
import { Space, Tooltip } from 'antd';

function ReceiptNew(props) {
    const { fetchData, fetchExpense, fetchPayment } = props;
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ReceiptForm fetchData={fetchData} fetchExpense={fetchExpense} fetchPayment={fetchPayment} onHide={props.onHide} />
        </Modal>
    );
}
// function ReceiptNew(props) {
//     const { fetchData, fetchExpense, onClose, receiptnew } = props;
//     const errorData = React.useRef(null);
//     const reset_Data = React.useRef(null);
//     useEffect(()=>{
//         if(receiptnew == true)
//         {
//             errorData.current()
//             reset_Data.current()
//         }
//     },[receiptnew])
//     return (
//         <Drawer
//             {...props}
//             title="Add IFSC"
//             placement="right"
//             onClose={onClose}
//             visible={props.visible}
//             width="75vw"
//         >
//             <ReceiptForm fetchData={fetchData} fetchExpense={fetchExpense} onHide={props.onHide} errorData={errorData} reset_Data={reset_Data} />
//         </Drawer>
//     );
// }

const ReceiptMaster = () => {
    const location = useLocation()
    const [receiptnew, setReceiptNew] = React.useState(false);
    const [searchinput, setSearchInput] = useState("")
    const [data, setData] = useState([])
    const insertData = React.useRef(null);
    const insertDataexpense = React.useRef(null);
    const insertDataPayment = React.useRef(null);

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                setReceiptNew(true);
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

        // Set company name
        doc.text(`${companyName}`, 70, 10);
        doc.setFontSize(13)
        const leftMargin = 15;
        doc.setFont('Arial', 'bold');

        // Set Receipt List below company name
        doc.text(`Total Record :- ${data.length}`, 10, 20);
        doc.text(`${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'} List`, 10, 25);
        // Continue with the rest of your code...
        const tableData = data.map((item, index) => [
            index + 1,
            item.PartyName ? item.PartyName : '-',
            item.CBJ ? item.CBJ : '-',
            item.TranNo ? item.TranNo : '-',
            item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date',
            item.ChequeNo ? item.ChequeNo : '-',
            item.ChequeDate ? moment(item.ChequeDate).format('DD-MM-YYYY') : 'No Date',
            item.NetAmount ? item.NetAmount : '-',
        ]);

        doc.autoTable({
            head: [['No', 'Party Name', 'CBJ', 'No', 'Date', 'Cheque No', 'ChequeDate', 'Amount']],
            body: tableData,
            startY: 30,
        });

        doc.save(`${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}.pdf`);
    };
    const downloadExcel = () => {
        const columeName = ['No', 'Party Name', 'CBJ', 'No', 'Date', 'Cheque No', 'ChequeDate', 'Amount'];
        const formattedData = [
            columeName,
            ...data.map((item, index) => [
                index + 1,
                item.PartyName ? item.PartyName : '-',
                item.CBJ ? item.CBJ : '-',
                item.TranNo ? item.TranNo : '-',
                item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date',
                item.ChequeNo ? item.ChequeNo : '-',
                item.ChequeDate ? moment(item.ChequeDate).format('DD-MM-YYYY') : 'No Date',
                item.NetAmount ? item.NetAmount : '-'
            ]),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}.xlsx`);
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
                    text-align:center
                }
              </style>
            </head>
            <body>
            <p> ${companyName}</p>
            <hr/>
            <div>
            <b>Total Record :- </b>${data.length}
            </div>
              <h5>${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'} List</h5>
              <table>
                <thead>
                  <tr>
                  <th>No</th>
                  <th>Party Name</th>
                  <th>CBJ</th>
                  <th>No</th>
                  <th>Date</th>
                  <th>Cheque No.</th>
                  <th>Cheque Date</th>
                  <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map((item, index) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${item.PartyName ? item.PartyName : '-'}</td>
                    <td>${item.CBJ ? item.CBJ : '-'}</td>
                    <td>${item.TranNo ? item.TranNo : '-'}</td>
                    <td>${item.TransDate ? moment(item.TransDate).format('DD-MM-YYYY') : 'No Date'}</td>
                    <td>${item.ChequeNo ? item.ChequeNo : '-'}</td>
                    <td>${item.ChequeDate ? moment(item.ChequeDate).format('DD-MM-YYYY') : 'No Date'}</td>
                    <td>${item.NetAmount ? item.NetAmount : '-'}</td>
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
        <div>
            <div className='content-wrapper'>
                <section className="content-header">
                    <div className="header-icon">
                        {/* <i className="fa fa-users" /> */}
                        {/* <i class="fa fa-shopping-cart" aria-hidden="true"></i> */}
                        <i class="fa fa-file-text" aria-hidden="true"></i>
                    </div>
                    <div className="header-title">
                        <h1>{location.pathname == '/receiptentry' && 'Receipt ' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}</h1>
                        {/* <small>{location.pathname == '/receiptentry' && 'Receipt List' || location.pathname == '/expenseentry' && 'Expense List'} </small> */}
                    </div>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-lg-12 pinpin">
                            <div className="card lobicard" data-sortable="true">
                                <div className="card-header">
                                    <div className='title-download-section'>
                                        <div className="card-title custom_title">
                                            <h4 className='report-heading'>{location.pathname == '/receiptentry' && 'Receipt List' || location.pathname == '/expenseentry' && 'Expense List' || location.pathname == '/payment' && 'Payment List'}</h4>
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
                                        <Button className="btn btn-add rounded-2" onClick={() => setReceiptNew(true)}>
                                            <i className="fa fa-plus p-1" />{location.pathname == '/receiptentry' && ' Add Receipt [F2]' || location.pathname == '/expenseentry' && 'Add Expense [F2]' || location.pathname == '/payment' && ' Add Payment [F2]'}
                                        </Button>
                                        <ReceiptNew
                                            show={receiptnew}
                                            onHide={() => setReceiptNew(false)}
                                            fetchData={insertData.current}
                                            fetchExpense={insertDataexpense.current}
                                            fetchPayment={insertDataPayment.current}
                                        />
                                        {/* <ReceiptNew
                                            visible={receiptnew}
                                            onHide={() => setReceiptNew(false)}
                                            receiptnew={receiptnew}
                                            fetchData={insertData.current}
                                            fetchExpense={insertDataexpense.current}
                                        /> */}
                                    </div>
                                    <div className='searching-input'>
                                        <input type="text" className='form-control' placeholder='Search here' onChange={(event) => { setSearchInput(event.target.value) }} />
                                    </div>
                                </div>
                                <div className='p-3' >
                                    <ReceiptTable insertData={insertData} insertDataexpense={insertDataexpense} insertDataPayment={insertDataPayment} searchinput={searchinput} onData={handleData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ReceiptMaster