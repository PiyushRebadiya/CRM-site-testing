import React from 'react'
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import ReceiptForm from './ReceiptForm';
import moment from 'moment';
import Swal from 'sweetalert2';
import { BsPrinterFill } from 'react-icons/bs';
import { Table, Tag, Space, Dropdown, Menu, Tooltip } from 'antd';
import { MdOutlineMailOutline } from "react-icons/md";
function EditData(props) {
    const { selectedrow, fetchData, fetchExpense, fetchPayment } = props
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <ReceiptForm rowData={selectedrow} fetchData={fetchData} fetchExpense={fetchExpense} fetchPayment={fetchPayment} onHide={props.onHide} />
        </Modal>
    );
}
const ReceiptTable = ({ insertData, insertDataexpense, insertDataPayment, searchinput, onData }) => {
    React.useEffect(() => {
        insertData.current = fetchData
    }, [])
    React.useEffect(() => {
        insertDataexpense.current = fetchDataExpense
    }, [])
    React.useEffect(() => {
        insertDataPayment.current = fetchPaymentData
    }, [])
    const [data, setData] = useState([])
    const [selectedrow, setSelectedRow] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [locationmodule, setLocationModule] = useState("")
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const token = localStorage.getItem("CRMtoken")
    const companyid = localStorage.getItem('CRMCompanyId')
    const location = useLocation()
    const [result, setResult] = useState("");
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });
    const URL = process.env.REACT_APP_API_URL
    const filteredData = data.filter((item) => {
        const searchTermLowerCase = searchinput.toLowerCase();
        const tranNoString = item.TranNo ? item.TranNo.toString() : '';
        const lowerCaseDueDate = moment(item.DueDate).format('DD/MM/YYYY').toLowerCase();
        const lowerCaseTransDate = moment(item.TransDate).format('DD/MM/YYYY').toLowerCase();
        return (
            (item.PartyName && item.PartyName.toLowerCase().includes(searchTermLowerCase)) ||
            (item.CBJ && item.CBJ.toLowerCase().includes(searchTermLowerCase)) ||
            (lowerCaseDueDate && lowerCaseDueDate.includes(searchTermLowerCase)) ||
            (lowerCaseTransDate && lowerCaseTransDate.includes(searchTermLowerCase)) ||
            (tranNoString && tranNoString.toLowerCase().includes(searchTermLowerCase))
            // (item.TranNo && typeof item.TranNo === 'string' && item.TranNo.toLowerCase().includes(searchTermLowerCase))
        );
    });
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }
    const fetchData = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationList?CompanyID=${companyid}&TransMode=Receipt`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
            onData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchDataExpense = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationList?CompanyID=${companyid}&TransMode=Expense`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
            onData(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    const fetchPaymentData = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationList?CompanyID=${companyid}&TransMode=Payment`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setData(res.data)
            onData(res.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        if (location.pathname == '/receiptentry') {
            fetchData()
        }
        else if (location.pathname == '/payment') {
            fetchPaymentData()
        }
        else {
            fetchDataExpense()
        }
    }, [location.pathname])

    const updateData = async (id, guid) => {
        try {
            // const res = await axios.get(URL + `/api/Transation/GetTransationListById?CompanyID=${companyid}&TransMode=${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense'}&Id=${id}`
            const res = await axios.get(URL + `/api/Transation/GetTransationListById1?CompanyID=${companyid}&TransMode=${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}&Id=${id}&CGUID=${guid}`
                , {
                    headers: { Authorization: `bearer ${token}` }
                })
            // console.log(res, "response")
            setSelectedRow(res.data.TransationMast)
            setEditShow(true)
        } catch (error) {
            console.log(error)
        }
    }
    const showAlert = (id) => {
        const timerDuration = 2000; // 4000 milliseconds = 4 seconds
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            // timer: timerDuration,
            timerProgressBar: true,
            onClose: () => {
                // Optional: Perform any action when the timer expires
                // console.log('Timer expired');
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteData(id)
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'No changes have been made.',
                    icon: 'error',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            }
        });
    };

    const deleteData = async (CGuid) => {
        try {
            const res = await axios.get(URL + `/api/Transation/DeleteTransation?TransMode=${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}&CGUID=${CGuid}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            if (location.pathname == '/receiptentry') {
                fetchData()
            }
            else if (location.pathname == '/payment') {
                fetchPaymentData()
            }
            else {
                fetchDataExpense()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSinglePrint = (guid) => {
        // var targetURL = `http://www.report.taxfile.co.in/Report/MasterReport?CompanyID=${companyid}&CGuid=/${guid}/&ReportMode=${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense'}`;

        // // Redirect to the specified URL
        // window.open(targetURL, '_blank');
        const url = `https://report.taxfile.co.in/Report/MasterReport?CompanyID=${companyid}&CGuid=/${guid}/&ReportMode=${location.pathname == '/receiptentry' && 'Receipt' || location.pathname == '/expenseentry' && 'Expense' || location.pathname == '/payment' && 'Payment'}`;
        const windowName = "myWindow";
        const windowSize = "width=1500,height=900";
        setResult(window.open(url, windowName, windowSize));
    }

    const showAlertEmail = (rowData) => {
        // const id = rowData.CGuid;
        const timerDuration = 2000; // 4000 milliseconds = 4 seconds
        Swal.fire({
            title: 'Send Email ?',
            text: "Are You Sure !!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Send it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            // timer: timerDuration,
            timerProgressBar: true,
        }).then((result) => {
            if (result.isConfirmed) {
                sentEmail(rowData, timerDuration)
                // Swal.fire({
                //     title: 'Email Sent !!',
                //     text: 'Email Sent Successfully !!!',
                //     icon: 'success',
                //     timer: timerDuration,
                //     timerProgressBar: true,
                //     showConfirmButton: true,
                // });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Email Was Not Sent.',
                    icon: 'error',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            }
        });
    };
    const sentEmail = async (rowData, timerDuration) => {
        const Cguid = rowData.CGuid;
        const tranmode = rowData.TransMode;

        let swalLoading = Swal.fire({
            title: 'Please wait...',
            html: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"  viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#3AC977" stroke-width="4"><animate attributeName="r" from="20" to="0" dur="1s" begin="0s" repeatCount="indefinite" /></circle></svg>',
            allowOutsideClick: false,
            showConfirmButton: false, // hide the Confirm button
            showCancelButton: false, // hide the Cancel button
            onBeforeOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const res = await axios.post(
                URL + `/api/Master/SendMail?Cguid=${Cguid}&Transmode=${tranmode}`,
                {
                    Cguid: Cguid,
                    Transmode: tranmode,
                },
                {
                    headers: { Authorization: `bearer ${token}` },
                }
            );

            if (res.data == true) {
                Swal.close(); // Close loading state
                Swal.fire({
                    title: 'Email Sent !!',
                    text: 'Email Sent Successfully !!!',
                    icon: 'success',
                    timer: timerDuration,
                    timerProgressBar: true,
                    showConfirmButton: true,
                });
            } else {
                const Error = res.data.Errors;
                Swal.close(); // Close loading state
                Swal.fire({
                    title: 'Email Not Sent !!',
                    html: true,
                    icon: 'error',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: true,
                    html: `${Error.map((item) => item.ErrorName).join('<br/>')}`,
                });
            }
        } catch (error) {
            console.log(error, 'error');
            Swal.close(); // Close loading state in case of an error
        }
    };
    const actionTemplate = (rowData) => {
        return (
            <div className='action-btn'>
                <Tooltip title="Edit">
                    <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(rowData.Id, rowData.CGuid) }}><i className="fa fa-pencil fs-4" /></button>
                </Tooltip>
                <Tooltip title="Delete">
                    <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(rowData.CGuid) }}><i className="fa fa-trash-o fs-4" /> </button>
                </Tooltip>
                <Tooltip title="Print">
                    <button type="button" className="btn btn-primary action_btn btn-sm" onClick={() => { handleSinglePrint(rowData.CGuid) }} ><BsPrinterFill size={20} /></button>
                </Tooltip>
                {
                    location.pathname == '/payment' || location.pathname == '/receiptentry' ? (
                        <Tooltip title="Email">
                            <button type="button" className="btn btn-email" onClick={() => { showAlertEmail(rowData) }}><MdOutlineMailOutline size={20} /></button>
                        </Tooltip>
                    ) : null
                }
            </div>
        );
    };
    const columns = [
        // ... (other columns)
        {
            title: 'Party Name',
            dataIndex: 'PartyName',
            width: 180
        },
        {
            title: 'CBJ',
            dataIndex: 'CBJ',
            width: 80,
            align: 'center',
        },
        {
            title: 'NO.',
            dataIndex: 'TranNo',
            width: 50,
            align: 'center',

        },
        {
            title: 'Date',
            render: (text, record) => record.TransDate ? moment(record.TransDate).format('DD/MM/YYYY') : 'No Date',
            width: 80,
            align: 'center',

        },
        {
            title: 'Cheque No.',
            render: (text) => (text.ChequeNo ? text.ChequeNo : "No Cheque"),
            width: 100,
            align: 'center',

        },
        {
            title: 'Cheque Date',
            render: (text, record) => record.ChequeDate ? moment(record.ChequeDate).format('DD/MM/YYYY') : 'No Date',
            width: 80,
            align: 'center',

        },
        {
            title: 'Amount',
            dataIndex: 'NetAmount',
            width: 120
        },
        {
            title: 'Action',
            fixed: 'right',
            align: 'center',
            fixed: 'right',
            render: actionTemplate,
            width: 120
        }
        // ... (other columns)
    ];

    const totalRecords = filteredData.length; // Assuming filteredData is the data array


    const TotalRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{totalRecords}</h5>
        </div>
    );
    return (
        <div>
            <div>
                {/* <div className="table-responsive ">
                    <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className=" back-color  info">
                                <th>#</th>
                                <th>Party Name</th>
                                <th>CBJ</th>
                                <th>No</th>
                                <th>Date</th>
                                <th>Cheque No.</th>
                                <th>Cheque Date</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredData.map((item, index) => {
                                    return (
                                        <tr key={index} className='align_middle'>
                                            <td className='data-index'>{index + 1}</td>
                                            <td>{item.PartyName}</td>
                                            <td>{item.CBJ}</td>
                                            <td>{item.TranNo}</td>
                                            <td>{moment(item.TransDate).format('DD/MM/YYYY')}</td>
                                            <td>{item.ChequeNo ? item.ChequeNo : "No Cheque"}</td>
                                            <td>{item.ChequeDate ? moment(item.ChequeDate).format('DD/MM/YYYY') : "No Date"}</td>
                                            <td>{item.NetAmount}</td>
                                            <td className='w-10'>
                                                <div className='action-btn'>
                                                    <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(item.Id, item.CGuid) }}><i className="fa fa-pencil fs-4" /></button>
                                                    <button type="button" className="btn btn-danger action_btn btn-sm" onClick={() => { showAlert(item.CGuid) }}><i className="fa fa-trash-o fs-4" /> </button>
                                                    <button type="button" className="btn btn-primary action_btn btn-sm" onClick={() => { handleSinglePrint(item.CGuid) }} ><BsPrinterFill size={20} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div> */}
                <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
                    onChange={handleTableChange} scroll={{ x: 1000 }} footer={TotalRecordFooter} />

                {
                    selectedrow ?
                        <EditData
                            show={editshow}
                            onHide={() => setEditShow(false)}
                            selectedrow={selectedrow}
                            fetchData={fetchData}
                            fetchExpense={fetchDataExpense}
                            fetchPayment={fetchPaymentData}
                        /> : null
                }

            </div>
        </div>
    )
}

export default ReceiptTable