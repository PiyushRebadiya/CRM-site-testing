import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import "../../style/Style.css"
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom'
import { BsPrinterFill } from 'react-icons/bs';
import { Drawer } from 'antd';
import { Table } from 'antd';
import moment from 'moment';
import { AiFillSetting } from 'react-icons/ai';
import { OverlayTrigger } from 'react-bootstrap';
import { notification,Tooltip } from 'antd';
import PurchaseForm from './PurchaseForm';

const PurchaseDataTable = ({ insertPurchaseData, editFormOpen, onData, handleNewButtonClick }) => {

    React.useEffect(() => {
        insertPurchaseData.current = fetchDataPurchase
    }, [])
    const location = useLocation()
    const [data, setData] = useState([])
    const [selectedRow, setSelectedRow] = useState([]);
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [searchinput, sertSearchInput] = useState("")
    const [selectedpurchasedata, setSelectedpPurchaseData] = useState([])
    const [editshow, setEditShow] = React.useState(false);
    const [setting, setSetting] = useState("")
    const [settingform, setSettingForm] = useState(null)

    const isNewButtonVisible = !showPurchaseForm && !editFormOpen;

    const token = localStorage.getItem("CRMtoken")
    const URL = process.env.REACT_APP_API_URL
    const customerId = localStorage.getItem("CRMCustId")
    const CompanyId = localStorage.getItem('CRMCompanyId')
    const [result, setResult] = useState("");
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            position: ['bottomCenter']
        },
    });

    const handleAddPurchaseClick = () => {
            handleNewButtonClick();
    };

    useEffect(() => {
        // Function to handle keypress event
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                // fetchSettingData()
                handleAddPurchaseClick();
            }
        }

        // Add event listener for keypress
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Empty dependency array to ensure this effect runs only once

    const filteredData = data.filter((item) => {
        // console.log(item.Duedate, "duedate")
        const searchTermLowerCase = searchinput.toLowerCase();
        // const ticketNumber = (item.Prefix || "") + (item.TranNo || "");
        // const lowerCaseTicketNumber = ticketNumber.toLowerCase();
        const lowerCaseDueDate = moment(item.DueDate).format('DD/MM/YYYY').toLowerCase();
        const lowerCaseTransDate = moment(item.TransDate).format('DD/MM/YYYY').toLowerCase();
        return (
            // item.Remark.toLowerCase().includes(searchTermLowerCase)
            (item.PartyName && item.PartyName.toLowerCase().includes(searchTermLowerCase)) ||// Check for null
            // lowerCaseTicketNumber.includes(searchTermLowerCase) ||
            (lowerCaseDueDate && lowerCaseDueDate.includes(searchTermLowerCase)) ||
            (lowerCaseTransDate && lowerCaseTransDate.includes(searchTermLowerCase)) ||
            (item.Remark && item.Remark.toLowerCase().includes(searchTermLowerCase))
        );
    });

    const fetchDataPurchase = async () => {
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationList?CompanyID=${CompanyId}&TransMode=Purchase`, {
                headers: { Authorization: `bearer ${token}` }
            })
            // const allData = res.data;
            // const filteredData = allData.filter(item => item.CustId === customerId);
            setData(res.data)
            onData(res.data)
            // datarecord(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchDataPurchase()
    }, [location.pathname])

    const updateData = async (rowData) => {
        const id = rowData.Id;
        const cguid = rowData.CGuid;
        try {
            const res = await axios.get(URL + `/api/Transation/GetTransationListById1?CompanyID=${CompanyId}&TransMode=Purchase&Id=${id}&CGUID=${cguid}`, {
                headers: { Authorization: `bearer ${token}` }
            })
            setSelectedRow(res.data.TransationMast)
            setSelectedpPurchaseData(res.data.StockDetail)
            // setEditShow(true)
            setShowPurchaseForm(true)
        } catch (error) {
            console.log(error)
        }
    }

    const showAlert = (rowData) => {
        const id = rowData.CGuid;
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

    const deleteData = async (id) => {
        try {
            const res = await axios.get(URL + `/api/Transation/DeleteTransation?TransMode=Purchase&CGUID=${id}`, {
                headers: { Authorization: `bearer ${token}` },
            })
            fetchDataPurchase()
        } catch (error) {
            console.log(error)
        }
    }
    // const handleSinglePrint = (rowData) => {
    //     const guid = rowData.CGuid
    //     const url = `http://www.report.taxfile.co.in/Report/TransactionReport?CompanyID=${CompanyId}&CGuid=/${guid}/&ReportMode=Purchase`;
    //     const windowName = "myWindow";
    //     const windowSize = "width=1500,height=900";
    //     setResult(window.open(url, windowName, windowSize));
    // }

    const actionTemplate = (rowData) => {
        return (
            <div className="action-btn">
                <Tooltip title='Edit'>
                <button type="button" className="btn btn-add action_btn btn-sm rounded-2" onClick={() => { updateData(rowData) }}><i className="fa fa-pencil fs-4" /></button>
                </Tooltip>
                <Tooltip title="Delete">
                <button type="button" className="btn btn-danger btn-sm" onClick={() => { showAlert(rowData) }}><i className="fa fa-trash-o fs-4" /> </button>
                </Tooltip>
                {/* <button type="button" className="btn btn-primary action_btn btn-sm" onClick={() => { handleSinglePrint(rowData) }} ><BsPrinterFill size={20} /></button> */}
            </div>
        );
    };

    const columns = [
        {
            title: 'Party Name',
            dataIndex: 'PartyName',
            width: 250,

        },
        {
            title: 'Purchase Bill No.',
            dataIndex: "PurchaseNo", 
            width: 100
        },
        // {
        //     title:'Area Name',
        //     key: 'AreaName',
        //     width:180
        //     // render:assignByTemplate,
        // },
        {
            title: 'Net Amount',
            dataIndex: 'NetAmount',
            width: 80
            // render:assignToTemplate,
        },

        {
            title: 'Purchase Date',
            dataIndex: 'TransDate',
            render: (text, record) => record.TransDate ? moment(record.TransDate).format('DD/MM/YYYY') : 'No Date',
            width: 60
        },
        {
            title: 'Due Date',
            dataIndex: "DueDate",
            render: (text, record) => record.DueDate ? moment(record.DueDate).format('DD/MM/YYYY') : 'No Date',
            width: 60
        },
        {
            title: 'Remark',
            dataIndex: "Remark",
            width: 250
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 50,
            render: actionTemplate
        }
        // ... (other columns)
    ];
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    }

    const totalRecords = filteredData.length; // Assuming filteredData is the data array


    const TotalRecordFooter = () => (
        <div>
            <h5><b>Total Records: </b>{totalRecords}</h5>
        </div>
    );

    return (
        <div className='p-3'>
        <div className="table-responsive">
            {isNewButtonVisible && (
                <div className="col-sm-12">
                    <div className='user-action-btn'>
                        <div className="btn-group d-flex input-searching-main pb-3" role="group">
                            <div className="buttonexport d-flex " id="buttonlist">
                                <Button className="btn btn-add rounded-2 media-btn1" onClick={handleAddPurchaseClick}>
                                    <i className="fa fa-plus" /> Add Purchase [F2]
                                </Button>
                                {/* <div className='ml-3'>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="add-tooltip">Prefix Setting</Tooltip>}
                                    >
                                        <Button className="btn btn-add rounded" style={{ marginRight: '800px' }} onClick={() => setSettingForm(true)}>
                                            <AiFillSetting className='mb-1' />
                                        </Button>
                                    </OverlayTrigger>
                                    <SettingModal
                                        show={settingform}
                                        onHide={() => setSettingForm(false)}
                                        setting={setting}
                                        fetchSettingData={fetchSettingData}
                                    />
                                </div> */}
                            </div>
                            <div className='searching-input'>
                                <input type="text" className='form-control' placeholder='Search Here ' onChange={(event) => { sertSearchInput(event.target.value) }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!showPurchaseForm && (
                <Table columns={columns} size='small' bordered dataSource={filteredData} pagination={tableParams.pagination}
                    onChange={handleTableChange} footer={TotalRecordFooter} />
            )}
        </div>
        {showPurchaseForm && (
            <PurchaseForm
                rowData={selectedRow}
                onHide={() => setShowPurchaseForm(false)}
                fetchPurchaseData={fetchDataPurchase}
                selectedpurchasedata={selectedpurchasedata}
            />
        )}

    </div>
    )
}

export default PurchaseDataTable